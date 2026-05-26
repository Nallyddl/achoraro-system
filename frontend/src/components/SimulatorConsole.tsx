import { useState, useEffect } from "react";
import { Cpu, Gamepad2, Zap, AlertTriangle, Sparkles, Loader2, Gauge } from "lucide-react";
import { SimulationResult } from "../types";

// Smart upgrade recommendations mapping
const CPU_RECOMMENDATIONS: { [key: string]: string } = {
  "AMD Ryzen 5 5600X": "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 7 5700X": "AMD Ryzen 9 7950X",
  "AMD Ryzen 7 7800X3D": "AMD Ryzen 9 7950X",
  "AMD Ryzen 9 7950X": "AMD Ryzen 9 7950X",
  "Intel Core i5-12400F": "Intel Core i7-13700K",
  "Intel Core i7-13700K": "Intel Core i9-14900K",
  "Intel Core i9-14900K": "Intel Core i9-14900K",
  "Intel Core i3-12100": "Intel Core i5-12400F",
  "Ryzen 5 3600": "AMD Ryzen 7 5700X",
  "Intel Core i7-7700K": "Intel Core i7-13700K"
};

const GPU_RECOMMENDATIONS: { [key: string]: string } = {
  "NVIDIA GeForce RTX 3060": "NVIDIA GeForce RTX 4070 SUPER",
  "NVIDIA GeForce RTX 4060": "NVIDIA GeForce RTX 4080 SUPER",
  "NVIDIA GeForce RTX 4070 SUPER": "NVIDIA GeForce RTX 4090",
  "NVIDIA GeForce RTX 4090": "NVIDIA GeForce RTX 4090",
  "AMD Radeon RX 6600": "AMD Radeon RX 7800 XT",
  "AMD Radeon RX 7800 XT": "NVIDIA GeForce RTX 4080 SUPER",
  "NVIDIA GTX 1650": "NVIDIA GeForce RTX 4060",
  "NVIDIA GeForce RTX 4080 SUPER": "NVIDIA GeForce RTX 4090",
  "NVIDIA GTX 1060": "NVIDIA GeForce RTX 4060"
};

export default function SimulatorConsole() {
  const [currentCpu, setCurrentCpu] = useState("AMD Ryzen 5 5600X");
  const [currentGpu, setCurrentGpu] = useState("NVIDIA GeForce RTX 3060");
  const [targetCpu, setTargetCpu] = useState("AMD Ryzen 7 7800X3D");
  const [targetGpu, setTargetGpu] = useState("NVIDIA GeForce RTX 4070 SUPER");

  // Custom Typed Components Support
  const [customCpu, setCustomCpu] = useState("");
  const [customGpu, setCustomGpu] = useState("");
  const [useCustomCpu, setUseCustomCpu] = useState(false);
  const [useCustomGpu, setUseCustomGpu] = useState(false);

  // Auto-upgrade recommendations handler
  const handleCurrentCpuChange = (val: string) => {
    setCurrentCpu(val);
    const recommended = CPU_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetCpu(recommended);
    }
  };

  const handleCurrentGpuChange = (val: string) => {
    setCurrentGpu(val);
    const recommended = GPU_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetGpu(recommended);
    }
  };

  // Real-time auto-simulation of FPS performance upgrades
  useEffect(() => {
    const activeCpu = useCustomCpu ? customCpu || "AMD Ryzen 5 5600X" : currentCpu;
    const activeGpu = useCustomGpu ? customGpu || "NVIDIA GeForce RTX 3060" : currentGpu;

    // Direct performance estimates trigger. Debounced if user is custom-typing
    const isCustomActive = (useCustomCpu && customCpu) || (useCustomGpu && customGpu);
    const delay = isCustomActive ? 500 : 50;

    const timer = setTimeout(async () => {
      setIsSimulating(true);
      try {
        const resCalc = await fetch("/api/simulator/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentCpu: activeCpu,
            currentGpu: activeGpu,
            targetCpu: targetCpu,
            targetGpu: targetGpu,
          }),
        });
        const calcData = await resCalc.json();
        setSimulation(calcData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSimulating(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentCpu, currentGpu, targetCpu, targetGpu, useCustomCpu, useCustomGpu, customCpu, customGpu]);

  // Scraped States
  //const [scrapedData, setScrapedData] = useState<{ [key: string]: any }>({});
  //const [isScraping, setIsScraping] = useState(false);

  // Simulation state
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // AI Diagnostic report state
  const [aiReport, setAiReport] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  /*const handleScrapeComponent = async (name: string, type: "cpu" | "gpu") => {
    setIsScraping(true);
    try {
      const res = await fetch(`/api/simulator/passmark?name=${encodeURIComponent(name)}&type=${type}`);
      const data = await res.json();
      setScrapedData((prev) => ({ ...prev, [type === "cpu" ? "cpu" : "gpu"]: data }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsScraping(false);
    }
  };*/

  const handleSimulate = async () => {
    setIsSimulating(true);
    setAiReport(""); // Clear past AI report
    setAiError("");

    const activeCpu = useCustomCpu ? customCpu || "AMD Ryzen 5 5600X" : currentCpu;
    const activeGpu = useCustomGpu ? customGpu || "NVIDIA GeForce RTX 3060" : currentGpu;

    try {
      // First scrape the components to make sure scores are up to date on client
     // const resCpu = await fetch(`/api/simulator/passmark?name=${encodeURIComponent(activeCpu)}&type=cpu`);
     // const resGpu = await fetch(`/api/simulator/passmark?name=${encodeURIComponent(activeGpu)}&type=gpu`);
      //const cpuData = await resCpu.json();
      //const gpuData = await resGpu.json();

      const resCalc = await fetch("/api/simulator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCpu: useCustomCpu ? activeCpu : currentCpu,
          currentGpu: useCustomGpu ? activeGpu : currentGpu,
          targetCpu: targetCpu,
          targetGpu: targetGpu,
        }),
      });
      const calcData = await resCalc.json();
      setSimulation(calcData);
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

    const activeCpu = useCustomCpu ? customCpu || "AMD Ryzen 5 5600X" : currentCpu;
    const activeGpu = useCustomGpu ? customGpu || "NVIDIA GeForce RTX 3060" : currentGpu;

    try {
      const res = await fetch("/api/simulator/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCpu: activeCpu,
          currentGpu: activeGpu,
          targetCpu,
          targetGpu,
          scores: simulation,
          lift: simulation.performanceLiftPercent,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiReport(data.report);
      }
    } catch (e) {
      setAiError("Ocurrió un error de red al procesar el reporte de la IA.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const popularCpus = [
    "AMD Ryzen 5 5600X",
    "AMD Ryzen 7 5700X",
    "AMD Ryzen 7 7800X3D",
    "AMD Ryzen 9 7950X",
    "Intel Core i5-12400F",
    "Intel Core i7-13700K",
    "Intel Core i9-14900K",
    "Intel Core i3-12100",
  ];

  const popularGpus = [
    "NVIDIA GeForce RTX 3060",
    "NVIDIA GeForce RTX 4060",
    "NVIDIA GeForce RTX 4070 SUPER",
    "NVIDIA GeForce RTX 4090",
    "AMD Radeon RX 6600",
    "AMD Radeon RX 7800 XT",
    "NVIDIA GTX 1650",
    "NVIDIA GeForce RTX 4080 SUPER",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 text-white space-y-8 select-none" id="simulator-console">
      {/* Introduction Banner header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase text-blue-400 font-mono">
          <Sparkles size={12} className="animate-spin text-blue-400" />
          NUEVO MÓDULO EXCLUSIVO
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white">
          Simulador de Upgrades & Performance FPS
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto font-medium">
          Compara las especificaciones técnicas reales extraídas de la API de **PassMark Scraper** para estimar el rendimiento global y tasas de FPS estimadas en tus setups favoritos.
        </p>
      </div>

      {/* Main configuration layout */}
      <div className="space-y-8">
        {/* Hardware setup inputs */}
        <div className="w-full bg-[#0F0F12] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="text-blue-500" size={20} />
              <span className="font-bold text-sm tracking-wider uppercase text-white">Configuración de Hardware</span>
            </div>
            <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase font-mono flex items-center gap-1">
              <Sparkles size={11} className="animate-pulse" />
              Recomendación Inteligente Activa
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current PC details (Left side) */}
            <div className="space-y-4">
              <div className="p-1 px-3 bg-[#0A0A0B] border border-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">Tu PC Actual</span>
              </div>

              {/* CPU selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-400">Procesador (CPU)</label>
                  <button
                    onClick={() => setUseCustomCpu(!useCustomCpu)}
                    className="text-[10px] text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    {useCustomCpu ? "Usar Prefijado" : "Escribir Personalizado"}
                  </button>
                </div>

                {useCustomCpu ? (
                  <input
                    type="text"
                    placeholder="Por ejemplo: Ryzen 5 3600"
                    value={customCpu}
                    onChange={(e) => setCustomCpu(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    id="custom-cpu-input"
                  />
                ) : (
                  <select
                    value={currentCpu}
                    onChange={(e) => handleCurrentCpuChange(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="current-cpu-select"
                  >
                    {popularCpus.map((cpu) => (
                      <option key={cpu} value={cpu}>
                        {cpu}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* GPU selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-400">Gráfica (GPU)</label>
                  <button
                    onClick={() => setUseCustomGpu(!useCustomGpu)}
                    className="text-[10px] text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    {useCustomGpu ? "Usar Prefijado" : "Escribir Personalizado"}
                  </button>
                </div>

                {useCustomGpu ? (
                  <input
                    type="text"
                    placeholder="Por ejemplo: NVIDIA GTX 1060"
                    value={customGpu}
                    onChange={(e) => setCustomGpu(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    id="custom-gpu-input"
                  />
                ) : (
                  <select
                    value={currentGpu}
                    onChange={(e) => handleCurrentGpuChange(e.target.value)}
                    className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="current-gpu-select"
                  >
                    {popularGpus.map((gpu) => (
                      <option key={gpu} value={gpu}>
                        {gpu}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Upgrade target / Recommended details (Right side) */}
            <div className="space-y-4">
              <div className="p-1 px-3 bg-[#0A0A0B] border border-white/5 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-bold uppercase font-mono">Objetivo de Upgrade (Recomendado)</span>
                <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded px-1.5 font-mono">AUTO-PICK</span>
              </div>

              {/* Target CPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Procesador de Upgrade</label>
                <select
                  value={targetCpu}
                  onChange={(e) => setTargetCpu(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  id="target-cpu-select"
                >
                  {popularCpus.map((cpu) => (
                    <option key={cpu} value={cpu}>
                      {cpu}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target GPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Gráfica de Upgrade</label>
                <select
                  value={targetGpu}
                  onChange={(e) => setTargetGpu(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  id="target-gpu-select"
                >
                  {popularGpus.map((gpu) => (
                    <option key={gpu} value={gpu}>
                      {gpu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action and status footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Simulación activa en tiempo real: Cualquier cambio de hardware recalcula tus FPS proyectados y lift síncrono al instante.</span>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full sm:w-auto h-11 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-[#FFF] font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-blue-500/10"
              id="btn-trigger-simulation"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="animate-spin text-white" size={16} />
                  Analizando...
                </>
              ) : (
                <>
                  <Gauge size={16} />
                  Simular Manualmente
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Simulator feedback */}
        <div className="space-y-6">
          {simulation ? (
            <div className="bg-[#0F0F12] border border-white/10 rounded-3xl p-6 space-y-6 animate-in fade-in duration-300 font-sans">
              {/* Dynamic performance lift score indicator */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4 font-sans">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider font-mono">LIFT DE DESEMPEÑO SINTÉTICO</span>
                  <p className="text-xs text-gray-400">Puntaje combinado (PassMark CPU & GPU Marks)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center bg-[#0A0A0B] border border-white/5 px-4 py-2 rounded-xl text-xs font-mono">
                    <span className="block text-gray-500 font-bold uppercase text-[9px]">Actual</span>
                    <span className="font-bold text-gray-200 text-sm">
                      {(simulation.currentCpuScore + simulation.currentGpuScore).toLocaleString()} pts
                    </span>
                  </div>
                  <div className="text-blue-500 font-bold">➔</div>
                  <div className="text-center bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl text-xs text-blue-400 font-mono">
                    <span className="block text-blue-500 font-bold uppercase text-[9px]">Upgrade</span>
                    <span className="font-bold text-sm">
                      {(simulation.targetCpuScore + simulation.targetGpuScore).toLocaleString()} pts
                    </span>
                  </div>
                  <div className="bg-emerald-600 text-white font-bold text-sm px-3 py-2 rounded-xl font-mono">
                    +{simulation.performanceLiftPercent}%
                  </div>
                </div>
              </div>

              {/* FPS projection in Games (Fortnite, Valorant, Cyberpunk 2077) */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                  <Gamepad2 size={16} />
                  Simulación de FPS Promedio en Juegos (1080p)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.keys(simulation.currentFps).map((gameName) => {
                    const cf = (simulation.currentFps as any)[gameName];
                    const tf = (simulation.targetFps as any)[gameName];

                    return (
                      <div key={gameName} className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-4 space-y-3">
                        <span className="text-xs font-bold text-white block truncate">{gameName}</span>

                        <div className="space-y-2">
                          {/* Low settings progress bar comparison */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                              <span>Gráficos Competitivos (Bajo)</span>
                              <span className="font-mono text-xs">
                                {cf.low} FPS <span className="text-emerald-400 font-bold">➔ {tf.low} FPS</span>
                              </span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${(cf.low / 360) * 100}%` }}
                                className="h-full bg-gray-700 rounded-l-full"
                              ></div>
                              <div
                                style={{ width: `${((tf.low - cf.low) / 360) * 100}%` }}
                                className="h-full bg-emerald-500 rounded-r-full"
                              ></div>
                            </div>
                          </div>

                          {/* Ultra settings progress bar comparison */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400 font-medium font-sans">
                              <span>Gráficos Ultra (Máximo)</span>
                              <span className="font-mono text-xs">
                                {cf.ultra} FPS <span className="text-emerald-400 font-bold">➔ {tf.ultra} FPS</span>
                              </span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${(cf.ultra / 240) * 100}%` }}
                                className="h-full bg-gray-700 rounded-l-full"
                              ></div>
                              <div
                                style={{ width: `${((tf.ultra - cf.ultra) / 240) * 100}%` }}
                                className="h-full bg-emerald-500 rounded-r-full"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Energy recommendation and power estimates */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-12 md:col-span-7 bg-black/30 border border-white/5 rounded-2xl p-4 flex gap-3 items-start">
                  <div className="p-2 rounded-xl bg-orange-650/10 border border-orange-500/20 text-orange-400">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="font-bold uppercase tracking-wider text-orange-400 block font-mono">
                      Auditoría de Cuello de Botella
                    </span>
                    <p className="text-gray-300 leading-relaxed">{simulation.bottleneckAnalysis}</p>
                  </div>
                </div>

                <div className="sm:col-span-12 md:col-span-5 bg-black/30 border border-white/5 rounded-2xl p-4 flex gap-3 items-start">
                  <div className="p-2 rounded-xl bg-blue-550/10 border border-blue-500/25 text-blue-400 font-mono">
                    <Zap size={18} className="animate-pulse" />
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="font-bold uppercase tracking-wider text-blue-400 block font-mono">
                      Uso de Energía Recomendado
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      TDP Estimado total: <strong>{simulation.powerRequirementWatts}W</strong>. Se aconseja una fuente certificada <strong>80 Plus de {Math.ceil((simulation.powerRequirementWatts + 150) / 100) * 100}W</strong> para óptima seguridad de tu inversión.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Expert Advisor support (Optionally invokes Gemini callback) */}
              <div className="border-t border-white/5 pt-5 space-y-4 font-sans">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-center sm:text-left">
                    <h5 className="font-bold text-sm flex items-center gap-1.5 justify-center sm:justify-start text-white">
                      <Sparkles className="text-amber-400 text-sm animate-pulse" size={16} />
                      Asistir sobre Upgrade con Gemini AI
                    </h5>
                    <p className="text-xs text-gray-500 font-medium">
                      Genera un plan de bottleneck y placa madre recomendados con IA
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateAiDiagnostic}
                    disabled={isGeneratingAi}
                    className="h-10 bg-amber-400 hover:bg-amber-300 disabled:bg-[#0F0F12] disabled:text-gray-600 text-black font-semibold rounded-xl px-4 text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
                    id="btn-ai-counsel"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 className="animate-spin text-black" size={14} />
                        Diagnosticando setup...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Consultar IA
                      </>
                    )}
                  </button>
                </div>

                {aiError && (
                  <div className="p-3 bg-red-900/15 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono">
                    {aiError}
                  </div>
                )}

                {aiReport && (
                  <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-5 text-sm leading-relaxed text-gray-300 space-y-2 animate-in fade-in duration-300 whitespace-pre-wrap font-sans">
                    {aiReport}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl space-y-4 bg-black/10 font-sans">
              <Gauge className="text-gray-700" size={48} />
              <div>
                <h4 className="text-base font-bold text-gray-300">Monitoreo de Upgrade Inactivo</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1 leading-normal">
                  Ingresa las combinaciones de procesadores y tarjetas de video de arriba para proyectar automáticamente tus FPS competitivos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
