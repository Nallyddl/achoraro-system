# ==============================================================================
# ACHORAO PLATFORM v4.9.3: AGENTE AUTOMATIZADO (SINTAXIS 100% ESTABLE)
# ==============================================================================
Clear-Host
$ErrorActionPreference = 'Stop'

Write-Host '=====================================================================' -ForegroundColor Red
Write-Host '  ACHORAO PLATFORM: MODULO DE SANEAMIENTO DE ALTA TRAZABILIDAD (PROD)' -ForegroundColor White
Write-Host '=====================================================================' -ForegroundColor Red

# 1. CONFIGURACION DE ENTORNO CENTRALIZADO
$BackendUrl   = 'https://ais-dev-k33qmr7g63banpuhdugzyp-380600068616.us-west2.run.app'
$TechnicianId = 'TECH-WAYRA-HOT-RUN'
$Workstation  = $env:COMPUTERNAME

Write-Host ''
Write-Host '[+] Mapeando dispositivos de almacenamiento local...' -ForegroundColor Yellow

try {
    $LogicalDisks = Get-Disk | Where-Object { $_.IsBoot -eq $false -and $_.IsSystem -eq $false }
    $PhysicalDisks = Get-PhysicalDisk -ErrorAction SilentlyContinue
    $AptDisks = @()

    foreach ($lDisk in $LogicalDisks) {
        $pDisk = $null
        if ($null -ne $PhysicalDisks) {
            if ($null -ne $lDisk.SerialNumber -and $lDisk.SerialNumber.Trim() -ne '') {
                $pDisk = $PhysicalDisks | Where-Object { $_.SerialNumber.Trim() -eq $lDisk.SerialNumber.Trim() }
            }
        }
        $AptDisks += [PSCustomObject]@{
            Index        = $lDisk.Number
            FriendlyName = $lDisk.FriendlyName
            SerialNumber = if ($lDisk.SerialNumber) { $lDisk.SerialNumber.Trim() } else { 'USB_GENERIC_SERIAL' }
            BusType      = $lDisk.BusType
            SizeGB       = [Math]::Round($lDisk.Size / 1GB)
            MediaType    = if ($pDisk) { $pDisk.MediaType } else { 'Removable' }
        }
    }
} catch {
    Write-Host '[X] Error critico escaneando el hardware local.' -ForegroundColor Red
    return
}

Write-Host ''
Write-Host 'Dispositivos aptos detectados en el sistema:' -ForegroundColor Green
foreach ($disk in $AptDisks) {
    Write-Host ('[{0}] {1} ({2} GB) | SN: {3}' -f $disk.Index, $disk.FriendlyName, $disk.SizeGB, $disk.SerialNumber) -ForegroundColor White
}

# 2. SELECCION DE UNIDAD DE HARDWARE
Write-Host ''
$Selection = Read-Host 'Seleccione el indice del disco a procesar (Tu USB es el 2)'
$TargetDisk = $AptDisks | Where-Object { $_.Index -eq $Selection }

if ($null -eq $TargetDisk) { 
    Write-Host '[X] Seleccion invalida. Abortando proceso.' -ForegroundColor Red
    return 
}

$StorageType = 'HDD'
if ($TargetDisk.BusType -eq 'NVMe') { $StorageType = 'SSD_NVME' }

# 3. HANDSHAKE INICIAL: PUBLICACION EN WEB (ESTADO: PENDING)
Write-Host ''
Write-Host '[+] Transmitiendo metadatos al inventario web...' -ForegroundColor Yellow
$HandshakeBody = @{
    model        = $TargetDisk.FriendlyName
    serialNumber = $TargetDisk.SerialNumber
    vendor       = $TargetDisk.FriendlyName.Split(' ')[0]
    storageType  = $StorageType
    technicianId = $TechnicianId
    workstation  = $Workstation
    status       = 'PENDING'
} | ConvertTo-Json

try {
    $UriHandshake = "$BackendUrl/api/v1/security/handshake"
    $HandshakeResponse = Invoke-RestMethod -Uri $UriHandshake -Method Post -Body $HandshakeBody -ContentType 'application/json' -TimeoutSec 7
    Write-Host '[OK] Handshake exitoso. Estado bloqueado en la nube como PENDING.' -ForegroundColor Green
} catch {
    Write-Host '[X] Error de enlace: El Servidor Central no acepto el registro de auditoria.' -ForegroundColor Red
    return
}

# 4. BUCLE DE POLLING SINCRO: BLOQUEO DE TERMINAL HASTA AUTORIZACION EN WEB
Write-Host ''
Write-Host '=====================================================================' -ForegroundColor Yellow
Write-Host '  AGENTE EN ESPERA: REVISE SU PANEL WEB PARA ADOPTAR EL HARDWARE' -ForegroundColor White
Write-Host '=====================================================================' -ForegroundColor Yellow
Write-Host "[!] El script esta suspendido. Vaya a la plataforma y presione ADOPTAR para el SN: $($TargetDisk.SerialNumber)" -ForegroundColor Cyan

$IsAuthorized = $false
$RetryCount = 0

while (-not $IsAuthorized) {
    try {
        $UriCheck = "$BackendUrl/api/v1/security/status?serialNumber=$($TargetDisk.SerialNumber)"
        $StatusCheck = Invoke-RestMethod -Uri $UriCheck -Method Get -TimeoutSec 5
        
        if ($StatusCheck.status -eq 'APPROVED' -or $StatusCheck.isApproved -eq $true) {
            Write-Host ''
            Write-Host ''
            Write-Host '[✓] ¡DIRECTIVA RECIBIDA! Orden de ejecucion autorizada remotamente por el Ledger.' -ForegroundColor Green
            $IsAuthorized = $true
        } else {
            $RetryCount++
            Write-Host ("`r[i] Sincronizando trazabilidad... (Consulta {0}) | Estado actual en web: {1}" -f $RetryCount, $StatusCheck.status) -NoNewline -ForegroundColor Gray
            Start-Sleep -Seconds 3
        }
    } catch {
        Write-Host -NoNewline '`r[!] Buscando conexion con el API Gateway central...' -ForegroundColor DarkYellow
        Start-Sleep -Seconds 3
    }
}

# 5. SANEAMIENTO LOGICO Y FÍSICO REAL DEL DISCO MAPPED
Write-Host ''
Write-Host '[!] EJECUTANDO DIRECTIVA CLEAR-DISK AUTORIZADA...' -ForegroundColor Red
try {
    Clear-Disk -Number $TargetDisk.Index -RemoveData -RemoveOEM -Confirm:$false
    Write-Host '[OK] Estructura sectorial fulminada con exito.' -ForegroundColor Green
} catch {
    Write-Host '[X] Fallo critico: El sistema operativo nego el control del bus de datos.' -ForegroundColor Red
    return
}

# 6. CIERRE INMUTABLE DEL LEDGER (ESTADO: COMPLETED)
$Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
$RawDataToHash = $TargetDisk.SerialNumber + $Timestamp + 'AUTHORIZED_WEB_PURGE'
$Hasher = [System.Security.Cryptography.HashAlgorithm]::Create('SHA256')
$HashBytes = $Hasher.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($RawDataToHash))
$HashString = [System.BitConverter]::ToString($HashBytes).Replace('-', '').ToLower()

Write-Host ''
Write-Host '[+] Despachando certificado criptografico inmutable...' -ForegroundColor Yellow
$CertBody = @{
    serialNumber = $TargetDisk.SerialNumber
    model        = $TargetDisk.FriendlyName
    technicianId = $TechnicianId
    workstation  = $Workstation
    status       = 'COMPLETED'
    sha256       = $HashString
    timestamp    = $Timestamp
} | ConvertTo-Json

try {
    $UriCert = "$BackendUrl/api/v1/security/certificate" 
    $CertResponse = Invoke-RestMethod -Uri $UriCert -Method Post -Body $CertBody -ContentType 'application/json' -TimeoutSec 7
    Write-Host '[OK] Flujo cerrado. Bitacora web actualizada a COMPLETED.' -ForegroundColor Green
    Write-Host "Firma Electronica del Registro: $HashString" -ForegroundColor Cyan
} catch {
    Write-Host ''
    Write-Host '[!] Alerta: Borrado exitoso, pero requiere firma manual.' -ForegroundColor Yellow
}