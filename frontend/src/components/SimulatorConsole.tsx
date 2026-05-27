import { AlertTriangle, Cpu, Gamepad2, Gauge, Loader2, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { SimulationResult } from "../types";

// Datos mockeados para todos los componentes
const CPUs = {
  intel: [
    { id: "i3-12100", name: "Intel Core i3-12100", socket: "LGA1700", cores: 4, price: 450, score: 12000 },
    { id: "i5-12400F", name: "Intel Core i5-12400F", socket: "LGA1700", cores: 6, price: 699, score: 18500 },
    { id: "i7-13700K", name: "Intel Core i7-13700K", socket: "LGA1700", cores: 16, price: 1499, score: 35000 },
    { id: "i9-14900K", name: "Intel Core i9-14900K", socket: "LGA1700", cores: 24, price: 2299, score: 48000 },
  ],
  amd: [
    { id: "r5-5600X", name: "AMD Ryzen 5 5600X", socket: "AM4", cores: 6, price: 759, score: 19500 },
    { id: "r7-5700X", name: "AMD Ryzen 7 5700X", socket: "AM4", cores: 8, price: 999, score: 26000 },
    { id: "r7-7800X3D", name: "AMD Ryzen 7 7800X3D", socket: "AM5", cores: 8, price: 2199, score: 42000 },
    { id: "r9-7950X", name: "AMD Ryzen 9 7950X", socket: "AM5", cores: 16, price: 2799, score: 55000 },
  ],
};

const GPUs = {
  nvidia: [
    { id: "rtx3060", name: "NVIDIA GeForce RTX 3060", vram: 12, price: 1199, score: 15000 },
    { id: "rtx4060", name: "NVIDIA GeForce RTX 4060", vram: 8, price: 1399, score: 18000 },
    { id: "rtx4070super", name: "NVIDIA GeForce RTX 4070 SUPER", vram: 12, price: 2499, score: 32000 },
    { id: "rtx4080super", name: "NVIDIA GeForce RTX 4080 SUPER", vram: 16, price: 3499, score: 45000 },
    { id: "rtx4090", name: "NVIDIA GeForce RTX 4090", vram: 24, price: 4999, score: 58000 },
  ],
  amd: [
    { id: "rx6600", name: "AMD Radeon RX 6600", vram: 8, price: 999, score: 14000 },
    { id: "rx7600", name: "AMD Radeon RX 7600", vram: 8, price: 1199, score: 16500 },
    { id: "rx7800xt", name: "AMD Radeon RX 7800 XT", vram: 16, price: 2299, score: 31000 },
    { id: "rx7900xtx", name: "AMD Radeon RX 7900 XTX", vram: 24, price: 3999, score: 50000 },
  ],
};

const Motherboards = {
  LGA1700: [
    { id: "mb1", name: "MSI B760 Gaming Plus WiFi", chipset: "B760", price: 619, score: 5000 },
    { id: "mb2", name: "ASUS ROG Strix Z790-E", chipset: "Z790", price: 1299, score: 8000 },
  ],
  AM4: [
    { id: "mb3", name: "ASUS TUF Gaming B550-PLUS", chipset: "B550", price: 549, score: 4800 },
    { id: "mb4", name: "MSI MPG X570S Carbon", chipset: "X570", price: 899, score: 7000 },
  ],
  AM5: [
    { id: "mb5", name: "Gigabyte B650 AORUS Elite", chipset: "B650", price: 899, score: 6000 },
    { id: "mb6", name: "ASUS ROG Strix X670E-E", chipset: "X670E", price: 1499, score: 9000 },
  ],
};

const RAMs = {
  DDR4: [
    { id: "ram1", name: "Corsair Vengeance LPX 16GB DDR4-3200", capacity: 16, price: 189, score: 4000 },
    { id: "ram2", name: "Kingston Fury Beast 32GB DDR4-3600", capacity: 32, price: 349, score: 6000 },
  ],
  DDR5: [
    { id: "ram3", name: "Kingston Fury Beast 16GB DDR5-5600", capacity: 16, price: 299, score: 5500 },
    { id: "ram4", name: "Corsair Vengeance 32GB DDR5-6000", capacity: 32, price: 549, score: 8500 },
  ],
};

const Storages = [
  { id: "ssd1", name: "Kingston NV3 1TB NVMe", type: "NVMe", price: 269, score: 3000 },
  { id: "ssd2", name: "Samsung 870 EVO 1TB SATA", type: "SATA", price: 349, score: 2500 },
  { id: "ssd3", name: "WD Black SN850X 2TB NVMe", type: "NVMe", price: 499, score: 4500 },
];

// Recomendaciones de upgrade (para CPU y GPU)
const CPU_UPGRADE_MAP: { [key: string]: string } = {
  "Intel Core i3-12100": "Intel Core i5-12400F",
  "Intel Core i5-12400F": "Intel Core i7-13700K",
  "Intel Core i7-13700K": "Intel Core i9-14900K",
  "Intel Core i9-14900K": "Intel Core i9-14900K",
  "AMD Ryzen 5 5600X": "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 7 5700X": "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 7 7800X3D": "AMD Ryzen 9 7950X",
  "AMD Ryzen 9 7950X": "AMD Ryzen 9 7950X",
};

const GPU_UPGRADE_MAP: { [key: string]: string } = {
  "NVIDIA GeForce RTX 3060": "NVIDIA GeForce RTX 4070 SUPER",
  "NVIDIA GeForce RTX 4060": "NVIDIA GeForce RTX 4080 SUPER",
  "NVIDIA GeForce RTX 4070 SUPER": "NVIDIA GeForce RTX 4090",
  "NVIDIA GeForce RTX 4090": "NVIDIA GeForce RTX 4090",
  "AMD Radeon RX 6600": "AMD Radeon RX 7800 XT",
  "AMD Radeon RX 7600": "AMD Radeon RX 7900 XTX",
  "AMD Radeon RX 7800 XT": "AMD Radeon RX 7900 XTX",
  "AMD Radeon RX 7900 XTX": "AMD Radeon RX 7900 XTX",
};

export default function SimulatorConsole() {
  // Marcas seleccionadas
  const [cpuBrand, setCpuBrand] = useState<"intel" | "amd">("amd");
  const [gpuBrand, setGpuBrand] = useState<"nvidia" | "amd">("nvidia");

  // Componentes actuales (PC actual)
  const [currentCpu, setCurrentCpu] = useState(CPUs.amd[0]);
  const [currentGpu, setCurrentGpu] = useState(GPUs.nvidia[0]);
  const [currentMobo, setCurrentMobo] = useState(Motherboards.AM4[0]);
  const [currentRam, setCurrentRam] = useState(RAMs.DDR4[0]);
  const [currentStorage, setCurrentStorage] = useState(Storages[0]);

  // Componentes objetivo (Target)
  const [targetCpu, setTargetCpu] = useState(CPUs.amd[2]); // 7800X3D
  const [targetGpu, setTargetGpu] = useState(GPUs.nvidia[2]); // 4070 SUPER
  const [targetMobo, setTargetMobo] = useState(Motherboards.AM5[0]);
  const [targetRam, setTargetRam] = useState(RAMs.DDR5[1]);
  const [targetStorage, setTargetStorage] = useState(Storages[2]);

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  // Obtener listas filtradas por marca
  const cpuList = CPUs[cpuBrand];
  const gpuList = GPUs[gpuBrand];

  // Cuando cambia la CPU actual, actualizar target CPU con recomendación
  useEffect(() => {
    const recommendedName = CPU_UPGRADE_MAP[currentCpu.name];
    if (recommendedName) {
      const recommended = Object.values(CPUs).flat().find(c => c.name === recommendedName);
      if (recommended) setTargetCpu(recommended);
    }
  }, [currentCpu]);

  // Cuando cambia la GPU actual, actualizar target GPU
  useEffect(() => {
    const recommendedName = GPU_UPGRADE_MAP[currentGpu.name];
    if (recommendedName) {
      const recommended = Object.values(GPUs).flat().find(g => g.name === recommendedName);
      if (recommended) setTargetGpu(recommended);
    }
  }, [currentGpu]);

  // Cuando cambia la marca de CPU, seleccionar el primer CPU de esa marca
  useEffect(() => {
    setCurrentCpu(cpuList[0]);
  }, [cpuBrand]);

  // Cuando cambia la marca de GPU, seleccionar la primera GPU de esa marca
  useEffect(() => {
    setCurrentGpu(gpuList[0]);
  }, [gpuBrand]);

  // Simular automáticamente al cambiar cualquier componente
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSimulate();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentCpu, currentGpu, currentMobo, currentRam, currentStorage, targetCpu, targetGpu, targetMobo, targetRam, targetStorage]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      // Cálculo simulado basado en scores
      const currentTotalScore = currentCpu.score + currentGpu.score + currentMobo.score + currentRam.score + currentStorage.score;
      const targetTotalScore = targetCpu.score + targetGpu.score + targetMobo.score + targetRam.score + targetStorage.score;
      const performanceLift = Math.round(((targetTotalScore - currentTotalScore) / currentTotalScore) * 100);

      // Simular FPS para juegos populares
      const baseLow = Math.floor(currentTotalScore / 200);
      const baseUltra = Math.floor(currentTotalScore / 400);
      const targetLow = Math.floor(targetTotalScore / 180);
      const targetUltra = Math.floor(targetTotalScore / 350);

      const simulationData: SimulationResult = {
        currentCpuScore: currentCpu.score,
        currentGpuScore: currentGpu.score,
        targetCpuScore: targetCpu.score,
        targetGpuScore: targetGpu.score,
        currentFps: {
          "Fortnite": { low: baseLow + 60, ultra: baseUltra + 30 },
          "Valorant": { low: baseLow + 120, ultra: baseUltra + 80 },
          "Cyberpunk 2077": { low: baseLow + 30, ultra: baseUltra + 15 },
          "Call of Duty": { low: baseLow + 70, ultra: baseUltra + 40 },
        },
        targetFps: {
          "Fortnite": { low: targetLow + 120, ultra: targetUltra + 80 },
          "Valorant": { low: targetLow + 220, ultra: targetUltra + 160 },
          "Cyberpunk 2077": { low: targetLow + 60, ultra: targetUltra + 40 },
          "Call of Duty": { low: targetLow + 140, ultra: targetUltra + 90 },
        },
        performanceLiftPercent: performanceLift,
        bottleneckAnalysis: performanceLift > 30 ? "Mejora significativa, cuello de botella reducido." : "Mejora moderada, revisa compatibilidad de RAM y almacenamiento.",
        powerRequirementWatts: Math.round(targetTotalScore / 100) + 250,
      };
      setSimulation(simulationData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGenerateAiDiagnostic = async () => {
    if (!simulation) return;
    setIsGeneratingAi(true);
    setAiError("");
    setAiReport("");
    try {
      // Simular respuesta de IA (mock)
      await new Promise(r => setTimeout(r, 1500));
      setAiReport(`✅ **Análisis de mejora**\n\nCon tu nueva configuración (${targetCpu.name} + ${targetGpu.name}) obtendrás un +${simulation.performanceLiftPercent}% de rendimiento general.\n\n🔧 **Recomendaciones:**\n- La placa madre ${targetMobo.name} es compatible con tu nuevo procesador.\n- La memoria RAM ${targetRam.name} mejora la velocidad de carga.\n- Considera una fuente de ${Math.ceil((simulation.powerRequirementWatts + 100) / 100) * 100}W 80 Plus Gold para mayor estabilidad.\n\n🎮 **Juegos recomendados para exprimir tu hardware:** Cyberpunk 2077 (ultra), Fortnite (competitivo), y Call of Duty (alto refresh).`);
    } catch (e) {
      setAiError("Error generando el diagnóstico.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 text-white space-y-8 select-none" id="simulator-console">
      {/* Banner superior */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold uppercase text-red-400 font-mono">
          <Sparkles size={12} className="animate-spin text-red-400" />
          SIMULADOR DE MEJORA COMPLETO
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white">
          Simula tu PC ideal
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto font-medium">
          Compara componentes: CPU, GPU, placa madre, RAM y almacenamiento. Proyectamos el rendimiento y FPS en juegos.
        </p>
      </div>

      <div className="space-y-8">
        {/* Panel de configuración */}
        <div className="w-full bg-[#0F0F12] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="text-red-500" size={20} />
              <span className="font-bold text-sm tracking-wider uppercase">Configuración completa</span>
            </div>
            <div className="flex gap-2">
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold">Recomendación Activa</span>
            </div>
          </div>

          {/* Grid de dos columnas: PC Actual vs Objetivo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PC ACTUAL */}
            <div className="space-y-4">
              <div className="bg-[#0A0A0B] border border-white/5 rounded-xl p-3">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">🖥️ TU PC ACTUAL</h3>
              </div>

              {/* Marca CPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Marca de CPU</label>
                <div className="flex gap-2">
                  <button onClick={() => setCpuBrand("intel")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${cpuBrand === "intel" ? "bg-red-600 text-white" : "bg-black/40 border border-white/10 hover:border-red-500"}`}>Intel</button>
                  <button onClick={() => setCpuBrand("amd")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${cpuBrand === "amd" ? "bg-red-600 text-white" : "bg-black/40 border border-white/10 hover:border-red-500"}`}>AMD</button>
                </div>
              </div>

              {/* CPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Procesador</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={currentCpu.id} onChange={(e) => setCurrentCpu(cpuList.find(c => c.id === e.target.value)!)}>
                  {cpuList.map(cpu => <option key={cpu.id} value={cpu.id}>{cpu.name} - S/. {cpu.price}</option>)}
                </select>
              </div>

              {/* Marca GPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Marca de GPU</label>
                <div className="flex gap-2">
                  <button onClick={() => setGpuBrand("nvidia")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${gpuBrand === "nvidia" ? "bg-red-600 text-white" : "bg-black/40 border border-white/10 hover:border-red-500"}`}>NVIDIA</button>
                  <button onClick={() => setGpuBrand("amd")} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${gpuBrand === "amd" ? "bg-red-600 text-white" : "bg-black/40 border border-white/10 hover:border-red-500"}`}>AMD</button>
                </div>
              </div>

              {/* GPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Tarjeta Gráfica</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={currentGpu.id} onChange={(e) => setCurrentGpu(gpuList.find(g => g.id === e.target.value)!)}>
                  {gpuList.map(gpu => <option key={gpu.id} value={gpu.id}>{gpu.name} - S/. {gpu.price}</option>)}
                </select>
              </div>

              {/* Placa Madre */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Placa Madre</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={currentMobo.id} onChange={(e) => setCurrentMobo(Object.values(Motherboards).flat().find(m => m.id === e.target.value)!)}>
                  {Object.values(Motherboards).flat().map(mb => <option key={mb.id} value={mb.id}>{mb.name} - S/. {mb.price}</option>)}
                </select>
              </div>

              {/* RAM */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Memoria RAM</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={currentRam.id} onChange={(e) => setCurrentRam(Object.values(RAMs).flat().find(r => r.id === e.target.value)!)}>
                  {Object.values(RAMs).flat().map(ram => <option key={ram.id} value={ram.id}>{ram.name} - S/. {ram.price}</option>)}
                </select>
              </div>

              {/* Almacenamiento */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Almacenamiento</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={currentStorage.id} onChange={(e) => setCurrentStorage(Storages.find(s => s.id === e.target.value)!)}>
                  {Storages.map(ssd => <option key={ssd.id} value={ssd.id}>{ssd.name} - S/. {ssd.price}</option>)}
                </select>
              </div>
            </div>

            {/* PC OBJETIVO (UPGRADE) */}
            <div className="space-y-4">
              <div className="bg-[#0A0A0B] border border-white/5 rounded-xl p-3">
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">🎯 PC OBJETIVO (Upgrade recomendado)</h3>
              </div>

              {/* CPU Target */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Procesador objetivo</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={targetCpu.id} onChange={(e) => setTargetCpu(Object.values(CPUs).flat().find(c => c.id === e.target.value)!)}>
                  {Object.values(CPUs).flat().map(cpu => <option key={cpu.id} value={cpu.id}>{cpu.name} - S/. {cpu.price}</option>)}
                </select>
              </div>

              {/* GPU Target */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Tarjeta Gráfica objetivo</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={targetGpu.id} onChange={(e) => setTargetGpu(Object.values(GPUs).flat().find(g => g.id === e.target.value)!)}>
                  {Object.values(GPUs).flat().map(gpu => <option key={gpu.id} value={gpu.id}>{gpu.name} - S/. {gpu.price}</option>)}
                </select>
              </div>

              {/* Placa Madre Target */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Placa Madre objetivo</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={targetMobo.id} onChange={(e) => setTargetMobo(Object.values(Motherboards).flat().find(m => m.id === e.target.value)!)}>
                  {Object.values(Motherboards).flat().map(mb => <option key={mb.id} value={mb.id}>{mb.name} - S/. {mb.price}</option>)}
                </select>
              </div>

              {/* RAM Target */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Memoria RAM objetivo</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={targetRam.id} onChange={(e) => setTargetRam(Object.values(RAMs).flat().find(r => r.id === e.target.value)!)}>
                  {Object.values(RAMs).flat().map(ram => <option key={ram.id} value={ram.id}>{ram.name} - S/. {ram.price}</option>)}
                </select>
              </div>

              {/* Almacenamiento Target */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Almacenamiento objetivo</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-sm" value={targetStorage.id} onChange={(e) => setTargetStorage(Storages.find(s => s.id === e.target.value)!)}>
                  {Storages.map(ssd => <option key={ssd.id} value={ssd.id}>{ssd.name} - S/. {ssd.price}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Botón simular manual */}
          <div className="flex justify-end pt-4">
            <button onClick={handleSimulate} disabled={isSimulating} className="h-11 px-6 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white font-bold uppercase rounded-xl flex items-center gap-2">
              {isSimulating ? <><Loader2 className="animate-spin" size={16} /> Simulando...</> : <><Gauge size={16} /> Simular ahora</>}
            </button>
          </div>
        </div>

        {/* Resultados de simulación */}
        {simulation && (
          <div className="bg-[#0F0F12] border border-white/10 rounded-3xl p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-xs text-red-400 font-bold uppercase">LIFT DE RENDIMIENTO</span>
                <p className="text-xs text-gray-400">Puntaje combinado (todos los componentes)</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#0A0A0B] px-4 py-2 rounded-xl text-center">
                  <span className="block text-[9px] text-gray-500">Actual</span>
                  <span className="font-bold text-white">{(simulation.currentCpuScore + simulation.currentGpuScore + 5000).toLocaleString()} pts</span>
                </div>
                <span className="text-red-500">➔</span>
                <div className="bg-red-500/10 px-4 py-2 rounded-xl text-center">
                  <span className="block text-[9px] text-red-400">Objetivo</span>
                  <span className="font-bold text-white">{(simulation.targetCpuScore + simulation.targetGpuScore + 8000).toLocaleString()} pts</span>
                </div>
                <div className="bg-yellow-600 text-black font-bold px-3 py-2 rounded-xl">+{simulation.performanceLiftPercent}%</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs">
                <Gamepad2 size={16} /> FPS estimados en juegos (1080p)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(simulation.currentFps).map(game => {
                  const cur = simulation.currentFps[game];
                  const tar = simulation.targetFps[game];
                  return (
                    <div key={game} className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-3">
                      <div className="font-bold text-white text-sm mb-2">{game}</div>
                      <div className="text-[11px] text-gray-400 flex justify-between">Bajo: {cur.low} → <span className="text-yellow-400 font-bold">{tar.low}</span></div>
                      <div className="text-[11px] text-gray-400 flex justify-between">Ultra: {cur.ultra} → <span className="text-yellow-400 font-bold">{tar.ultra}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="text-orange-400" size={20} />
                <div>
                  <span className="font-bold text-orange-400 text-xs">Cuello de botella</span>
                  <p className="text-xs text-gray-300">{simulation.bottleneckAnalysis}</p>
                </div>
              </div>
              <div className="bg-black/30 p-4 rounded-xl flex gap-3">
                <Zap className="text-red-400" size={20} />
                <div>
                  <span className="font-bold text-red-400 text-xs">Requerimiento energético</span>
                  <p className="text-xs text-gray-300">Fuente recomendada: {Math.ceil((simulation.powerRequirementWatts + 100) / 100) * 100}W 80 Plus Gold</p>
                </div>
              </div>
            </div>

            {/* IA */}
            <div className="border-t pt-4">
              <button onClick={handleGenerateAiDiagnostic} disabled={isGeneratingAi} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <Sparkles size={14} /> {isGeneratingAi ? "Generando..." : "Consultar a la IA"}
              </button>
              {aiError && <div className="text-red-400 text-xs mt-2">{aiError}</div>}
              {aiReport && <div className="bg-[#0A0A0B] p-4 rounded-xl mt-3 text-sm whitespace-pre-wrap">{aiReport}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}