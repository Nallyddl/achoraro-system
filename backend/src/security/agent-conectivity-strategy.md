# Estrategia de Conectividad del Agente y Ejecución de Comandos Nativos (NIST SP 800-88 Rev 1)

Este documento detalla la arquitectura de comando unificada implementada para el Agente Local de Windows/Linux. Siguiendo las directivas de seguridad para la economía circular de hardware, se descarta todo acoplamiento con utilitarios privativos de fabricantes (como Samsung Magician o Kingston CLI). En su lugar, el sistema opera interactuando a nivel lógico del bus y a bajo nivel con controladores nativos del Sistema Operativo.

---

## 1. Flujo Completo del Ciclo de Vida del Saneamiento

El agente local (Windows C#/.NET o script de administración seguro) y el backend coordinan bajo el siguiente protocolo seguro de 4 vías:

```
[ Agente Operacional Local ]                                  [ Servidor Central (NestJS Core) ]
            │                                                                │
            ├─────── 1. POST /api/v1/security/handshake ────────────────────>│ [Valida Homologación]
            │        (Sera, Modelo, Vendor, TechnicialId)                    │ [Define directivas]
            │                                                                │
            │<────── 2. 200 OK (sessionToken, eraseMethod, guidelines) ──────┤
            │                                                                │
            │  ──┐                                                           │
            │    │ [Ejecuta directiva nativa]                                │
            │    │ [Valida sectores no asignados]                            │
            │  <─┘                                                           │
            │                                                                │
            ├─────── 3. POST /api/v1/security/certify ──────────────────────>│ [Valida HMAC/Firma]
            │        (sessionToken, Metadatos de Validación, Firma)           │ [Registra Log Inalterable]
            │                                                                │ [Dispara Certificado PDF]
            │                                                                │
            │<────── 4. 201 Created (certificateId, pdfConformityMsg) ───────┤
```

---

## 2. Abstracción de Comandos de Bajo Nivel por Bus de Datos

### A. Para Dispositivos NVMe Modernos (SSD_NVME) - Método: `NVMe Sanitize` o `Cryptographic Erase`
Los SSDs NVMe no deben ser sobreescritos sector a sector de forma secuencial tradicional, ya que esto degrada la celda NAND, consume TBW innecesariamente, e ignora bloques de reserva ocultos (Over-Provisioning) y sectores reasignados.

*   **En Windows (Llamada Powershell Administrativa):**
    Utiliza el comando nativo de aprovisionamiento de discos físicos que interactúa directamente con el driver del bus PCI:
    ```powershell
    # Powershell - Remueve y realiza un formateo de bajo nivel físico llamando al firmware del controlador
    Clear-Disk -Number $DiskIndex -RemoveData -RemoveOEM -Confirm:$false
    ```
*   **En Windows (Llamada al API de C# mediante CTL_CODE de Win32):**
    El Agente abre un Handle al volumen físico e inyecta la instrucción `FSCTL_LOCK_VOLUME` y el código IOCTL de formateo de bajo nivel para invalidar las llaves lógicas de cifrado:
    ```csharp
    // C# - Interacción nativa con el kernel para NVMe Format en bloque
    [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern bool DeviceIoControl(
        SafeFileHandle hDevice,
        uint dwIoControlCode, // IOCTL_STORAGE_PROTOCOL_COMMAND
        IntPtr lpInBuffer,
        uint nInBufferSize,
        IntPtr lpOutBuffer,
        uint nOutBufferSize,
        out uint lpBytesReturned,
        IntPtr lpOverlapped
    );
    ```
*   **En Linux (nvme-cli directo - Purga de Semiconductor):**
    ```bash
    # Acción 0x02 (Sanitize Block Erase) o Format con CryptoErase habilitado
    nvme sanitize /dev/nvme0n1 -a 0x02 -d 0x01
    ```

### B. Para Dispositivos SATA SSD (SSD_SATA) - Método: `ATA Secure Erase`
Se envían comandos SATA directos al controlador para iniciar un ciclo de sobrevoltaje seguro que libera la carga de todas las celdas lógicas de almacenamiento en milisegundos.

*   **Llamadas de Linux directas:**
    ```bash
    # 1. Quitar el estado 'frozen' del disco duro suspendiendo brevemente el bus
    # 2. Configurar una clave temporal de acceso de usuario
    hdparm --user-master u --security-set-pass TempPassword /dev/sdX
    # 3. Lanzar la instrucción física de borrado seguro ATA
    hdparm --user-master u --security-erase TempPassword /dev/sdX
    ```

### C. Para Discos Mecánicos Tradicionales (HDD) - Método: `SDelete / DoD Clear`
Para mitigar la persistencia remanente de datos magnéticos en platos mecánicos tradicionales, se requiere sobreescritura sistemática de principio a fin del disco.

*   **En Windows (Implementación de sobreescritura nativa o SDelete):**
    ```powershell
    # formateo completo forzando al controlador NTFS/REF a reescribir con ceros todos los bloques expuestos
    Format-Volume -DriveLetter "D" -FileSystem NTFS -Full -Force
    ```
*   **En consola cmd tradicional:**
    ```cmd
    sdelete.exe -p 1 -z D:
    ```

---

## 3. Verificación Post-Borrado Rigurosa (NIST Guidelines Compliance)

De acuerdo con el apéndice de verificación de la norma **NIST SP 800-88 Rev 1**, la operación no se asume exitosa solo por completar el comando de escritura. El agente realiza una validación obligatoria:

1.  **Lectura Cruda de Bloques Desordenados:**
    El agente lee pseudoaleatoriamente el $10\%$ de los sectores físicos del disco asegurando que devuelvan exclusivamente nulos (`0x00`) o caracteres de no asignación (`0xFF`).
2.  **Verificación de Estado SMART:**
    Extrae la salud del almacenamiento, Bad Sectors reasignados, y comprueba que ningún bloque con datos siga mapeado.
3.  **Integridad Firmada:**
    Se calcula un hash de la evidencia recolectada y se firma para que el backend asegure la no-modificación de los registros de auditoría legal ante Indecopi u organismos internacionales.
