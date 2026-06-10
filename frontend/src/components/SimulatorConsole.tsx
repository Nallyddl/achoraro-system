import { AlertTriangle, ChevronDown, Cpu, Gamepad2, Gauge, Loader2, Send, ShoppingCart, Sparkles, User, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Product, SimulationResult } from "../types";

// Pricing lookup mapping for standard simulator products
const COMPONENT_PRICES: { [key: string]: number } = {
  "AMD Ryzen 5 5600X": 720.0,
  "AMD Ryzen 7 5700X": 950.0,
  "AMD Ryzen 7 7800X3D": 1790.0,
  "AMD Ryzen 9 7950X": 2790.0,
  "Intel Core i5-12400F": 680.0,
  "Intel Core i7-13700K": 1690.0,
  "Intel Core i9-14900K": 2590.0,
  "Intel Core i3-12100": 450.0,
  "Ryzen 5 3600": 390.0,
  "Intel Core i7-7700K": 590.0,
  "NVIDIA GeForce RTX 3060": 1390.0,
  "NVIDIA GeForce RTX 4060": 1590.0,
  "NVIDIA GeForce RTX 4070 SUPER": 2990.0,
  "NVIDIA GeForce RTX 4090": 8990.0,
  "AMD Radeon RX 6600": 990.0,
  "AMD Radeon RX 7800 XT": 2590.0,
  "NVIDIA GTX 1650": 650.0,
  "NVIDIA GeForce RTX 4080 SUPER": 4890.0,
  "NVIDIA GTX 1060": 550.0,
  // Placas
  "ASUS Prime H610M DDR4": 340.0,
  "ASUS Prime B760M-A WiFi DDR5": 620.0,
  "MSI PRO Z790-A WiFi DDR5": 1190.0,
  "MSI B550M PRO-VDH WiFi": 490.0,
  "ASUS TUF Gaming A620M-PLUS (AM5)": 590.0,
  "ASUS ROG STRIX X670E-F Gaming AM5": 1650.0,
  // RAMs
  "8GB (1x8GB) DDR4 2666MHz": 110.0,
  "16GB (2x8GB) DDR4 3200MHz": 230.0,
  "16GB (1x16GB) DDR5 5200MHz": 290.0,
  "32GB (2x16GB) DDR5 6000MHz": 590.0,
  "64GB (2x32GB) DDR5 6400MHz": 1190.0,
  // Storages
  "HDD Toshiba 1TB SATA 7200 RPM": 190.0,
  "SSD Kingston A400 480GB SATA": 180.0,
  "SSD Kingston NV2 1TB NVMe PCIe 4.0": 290.0,
  "Corsair MP600 Pro 2TB NVMe PCIe 4.0": 790.0,
};

const COMPONENT_IMAGES: { [key: string]: string } = {
  cpu: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
  gpu: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
  placa: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=85",
  ram: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=400&q=85",
  storage: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
};

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

const PLACA_RECOMMENDATIONS: { [key: string]: string } = {
  "ASUS Prime H610M DDR4": "ASUS Prime B760M-A WiFi DDR5",
  "ASUS Prime B760M-A WiFi DDR5": "MSI PRO Z790-A WiFi DDR5",
  "MSI PRO Z790-A WiFi DDR5": "MSI PRO Z790-A WiFi DDR5",
  "MSI B550M PRO-VDH WiFi": "ASUS TUF Gaming A620M-PLUS (AM5)",
  "ASUS TUF Gaming A620M-PLUS (AM5)": "ASUS ROG STRIX X670E-F Gaming AM5",
  "ASUS ROG STRIX X670E-F Gaming AM5": "ASUS ROG STRIX X670E-F Gaming AM5"
};

const RAM_RECOMMENDATIONS: { [key: string]: string } = {
  "8GB (1x8GB) DDR4 2666MHz": "16GB (2x8GB) DDR4 3200MHz",
  "16GB (2x8GB) DDR4 3200MHz": "32GB (2x16GB) DDR5 6000MHz",
  "16GB (1x16GB) DDR5 5200MHz": "32GB (2x16GB) DDR5 6000MHz",
  "32GB (2x16GB) DDR5 6000MHz": "64GB (2x32GB) DDR5 6400MHz",
  "64GB (2x32GB) DDR5 6400MHz": "64GB (2x32GB) DDR5 6400MHz"
};

const STORAGE_RECOMMENDATIONS: { [key: string]: string } = {
  "HDD Toshiba 1TB SATA 7200 RPM": "SSD Kingston A400 480GB SATA",
  "SSD Kingston A400 480GB SATA": "SSD Kingston NV2 1TB NVMe PCIe 4.0",
  "SSD Kingston NV2 1TB NVMe PCIe 4.0": "Corsair MP600 Pro 2TB NVMe PCIe 4.0",
  "Corsair MP600 Pro 2TB NVMe PCIe 4.0": "Corsair MP600 Pro 2TB NVMe PCIe 4.0"
};

// Map CPU to Traffic Light status matching user's transcription
export const getCpuStatus = (cpuName: string) => {
  if (!cpuName) {
    return {
      color: "gray",
      label: "Por evaluar",
      recomendacion: "Selecciona tu procesador actual para visualizar el estado en el semáforo.",
      bg: "bg-white/5",
      border: "border-white/10",
      text: "text-gray-400",
      dot: "bg-gray-500",
    };
  }

  const name = cpuName.toLowerCase();

  // Rojo: Core 2, Pentium, Celeron antiguos
  if (
    name.includes("core 2") ||
    name.includes("pentium") ||
    name.includes("celeron") ||
    name.includes("antiguo") ||
    name.includes("antigua") ||
    name.includes("duo") ||
    name.includes("quad") ||
    name.includes("athlon") ||
    name.includes("phenom")
  ) {
    return {
      color: "red",
      label: "Es hora de cambiar",
      recomendacion: "Recomendada plataforma nueva entera (placa madre + memoria RAM + procesador CPU).",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      dot: "bg-red-500",
    };
  }

  // Verde: Intel Core i7/i9 10ª–14ª gen · Ryzen 7/9 5000X3D/7000
  if (
    ((name.includes("i7") || name.includes("i9")) &&
     (name.includes("10ª") || name.includes("11ª") || name.includes("12ª") || name.includes("13ª") || name.includes("14ª") ||
      name.includes("10th") || name.includes("11th") || name.includes("12th") || name.includes("13th") || name.includes("14th") ||
      /-1[01234]\d/.test(name) || /-2\d/.test(name))) ||
    (name.includes("ryzen 7") && (name.includes("x3d") || name.includes("7800") || name.includes("7700") || name.includes("9700"))) ||
    (name.includes("ryzen 9") && (name.includes("7900") || name.includes("7950") || name.includes("5000x3d") || name.includes("9900") || name.includes("9950")))
  ) {
    return {
      color: "green",
      label: "No hace falta",
      recomendacion: "Mantén tu procesador y prioriza mejorar la tarjeta de video (GPU) o la memoria RAM.",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      dot: "bg-emerald-500",
    };
  }

  // Naranja: Intel Core i3/i5 6ª–9ª · Ryzen 1ª–2ª
  if (
    (name.includes("i3") && (name.includes("6ª") || name.includes("7ª") || name.includes("8ª") || name.includes("9ª") ||
                             name.includes("6th") || name.includes("7th") || name.includes("8th") || name.includes("9th") ||
                             /-[6789]\d{3}/.test(name))) ||
    (name.includes("i5") && (name.includes("6ª") || name.includes("7ª") || name.includes("8ª") || name.includes("9ª") ||
                             name.includes("6th") || name.includes("7th") || name.includes("8th") || name.includes("9th") ||
                             /-[6789]\d{3}/.test(name))) ||
    (name.includes("i7") && (name.includes("6ª") || name.includes("7ª") || name.includes("6th") || name.includes("7th") ||
                             /-[234567]\d{3}/.test(name))) ||
    (name.includes("ryzen") && (name.includes("1000") || name.includes("2000") || /ryzen\s+[357]\s+[12]\d{3}/.test(name)))
  ) {
    return {
      color: "orange",
      label: "Cámbialo si puedes",
      recomendacion: "Notarás un notable cuello de botella si colocas tarjetas de video más modernas.",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-400",
      dot: "bg-orange-500",
    };
  }

  // Amarillo: Intel Core i5 10ª–13ª · Ryzen 5/7 3000–5000
  return {
    color: "yellow",
    label: "Mantener 1–3 años",
    recomendacion: "Aún rinde de forma regular; considera upgrade principalmente si trabajas en render o edición pesada.",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-500",
  };
};

// Map GPU to Traffic Light status matching user's transcription
export const getGpuStatus = (gpuName: string) => {
  if (!gpuName) {
    return {
      color: "gray",
      label: "Por evaluar",
      recomendacion: "Selecciona tu tarjeta gráfica actual para visualizar el estado en el semáforo.",
      bg: "bg-white/5",
      border: "border-white/10",
      text: "text-gray-400",
      dot: "bg-gray-500",
    };
  }

  const name = gpuName.toLowerCase();

  // Rojo: GTX 1050 Ti o menores · RX 570 o anteriores
  if (
    name.includes("1050") ||
    name.includes("570") ||
    name.includes("580") ||
    name.includes("560") ||
    name.includes("550") ||
    name.includes("470") ||
    name.includes("480") ||
    name.includes("1030") ||
    name.includes("750") ||
    name.includes("960") ||
    name.includes("970") ||
    name.includes("950") ||
    name.includes("gtx 9") ||
    name.includes("gtx 7") ||
    name.includes("gtx 6") ||
    name.includes("gtx 1060") ||
    name.includes("r7") ||
    name.includes("r9") ||
    name.includes("hd ") ||
    name.includes("anterior") ||
    name.includes("anteriores") ||
    name.includes("integrada") ||
    name.includes("graphics") ||
    name.includes("igpu")
  ) {
    return {
      color: "red",
      label: "Actualízala cuanto antes",
      recomendacion: "Recomendado actualizar a serie actual para tener tecnologías vigentes (DLSS/FSR, RT).",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      dot: "bg-red-500",
    };
  }

  // Verde: RTX 4070/4080/4090 · RX 7900XT/XTX (plus SUPER / Ti variants)
  if (
    name.includes("4070") ||
    name.includes("4080") ||
    name.includes("4090") ||
    name.includes("7900") ||
    name.includes("xtx") ||
    name.includes("3090") ||
    name.includes("3085") ||
    name.includes("7800 xt")
  ) {
    return {
      color: "green",
      label: "No hace falta",
      recomendacion: "Lista para disfrutar gaming fluido en 1440p o 4K; primero mejora el monitor o la CPU si lo necesitas.",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      dot: "bg-emerald-500",
    };
  }

  // Amarillo: RTX 3080/3070 · RX 6800/6700XT
  if (
    name.includes("3080") ||
    name.includes("3070") ||
    name.includes("6800") ||
    name.includes("6700") ||
    name.includes("3060 ti") ||
    name.includes("4060 ti") ||
    name.includes("7700")
  ) {
    return {
      color: "yellow",
      label: "Conserva 1–2 años",
      recomendacion: "Aún rinden de forma sólida en 1080p y 1440p; evalúa el cambio solo si buscas Ray Tracing ultra.",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      dot: "bg-amber-500",
    };
  }

  // Naranja: RTX 3060/3050 · GTX 1660/1650 · RX 6600/6500XT
  return {
    color: "orange",
    label: "Conserva 2–4 años",
    recomendacion: "Excelente para calidad competitiva media (1080p); upgrade sugerido si buscas trazado de rayos activo.",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    dot: "bg-orange-500",
  };
};

interface SimulatorConsoleProps {
  onAddToCart: (product: Product) => void;
}

interface Message {
  sender: "user" | "assistant";
  text: string;
}

export default function SimulatorConsole({ onAddToCart }: SimulatorConsoleProps) {
  const [currentCpu, setCurrentCpu] = useState("");
  const [currentGpu, setCurrentGpu] = useState("");
  const [currentPlaca, setCurrentPlaca] = useState("");
  const [currentRam, setCurrentRam] = useState("");
  const [currentStorage, setCurrentStorage] = useState("");

  const [targetCpu, setTargetCpu] = useState("");
  const [targetGpu, setTargetGpu] = useState("");
  const [targetPlaca, setTargetPlaca] = useState("");
  const [targetRam, setTargetRam] = useState("");
  const [targetStorage, setTargetStorage] = useState("");

  const [validationError, setValidationError] = useState("");

  // Sync state to localStorage when values change
  useEffect(() => {
    try {
      localStorage.setItem("ach_currentCpu", currentCpu);
      localStorage.setItem("ach_currentGpu", currentGpu);
      localStorage.setItem("ach_currentPlaca", currentPlaca);
      localStorage.setItem("ach_currentRam", currentRam);
      localStorage.setItem("ach_currentStorage", currentStorage);
    } catch (e) {
      console.error(e);
    }
  }, [currentCpu, currentGpu, currentPlaca, currentRam, currentStorage]);

  useEffect(() => {
    try {
      localStorage.setItem("ach_targetCpu", targetCpu);
      localStorage.setItem("ach_targetGpu", targetGpu);
      localStorage.setItem("ach_targetPlaca", targetPlaca);
      localStorage.setItem("ach_targetRam", targetRam);
      localStorage.setItem("ach_targetStorage", targetStorage);
    } catch (e) {
      console.error(e);
    }
  }, [targetCpu, targetGpu, targetPlaca, targetRam, targetStorage]);

  // Custom components details
  const [customCpu, setCustomCpu] = useState("");
  const [customGpu, setCustomGpu] = useState("");
  const [useCustomCpu, setUseCustomCpu] = useState(false);
  const [useCustomGpu, setUseCustomGpu] = useState(false);
  const [showTrafficGuide, setShowTrafficGuide] = useState(false);

  // Auto-set upgrade recommendations when current selections change
  const handleCurrentCpuChange = (val: string) => {
    setCurrentCpu(val);
    if (!val) {
      setTargetCpu("");
      return;
    }
    const recommended = CPU_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetCpu(recommended);
    }
  };

  const handleCurrentGpuChange = (val: string) => {
    setCurrentGpu(val);
    if (!val) {
      setTargetGpu("");
      return;
    }
    const recommended = GPU_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetGpu(recommended);
    }
  };

  const handleCurrentPlacaChange = (val: string) => {
    setCurrentPlaca(val);
    if (!val) {
      setTargetPlaca("");
      return;
    }
    const recommended = PLACA_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetPlaca(recommended);
    } else {
      setTargetPlaca(val);
    }
  };

  const handleCurrentRamChange = (val: string) => {
    setCurrentRam(val);
    if (!val) {
      setTargetRam("");
      return;
    }
    const recommended = RAM_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetRam(recommended);
    } else {
      setTargetRam(val);
    }
  };

  const handleCurrentStorageChange = (val: string) => {
    setCurrentStorage(val);
    if (!val) {
      setTargetStorage("");
      return;
    }
    const recommended = STORAGE_RECOMMENDATIONS[val];
    if (recommended) {
      setTargetStorage(recommended);
    } else {
      setTargetStorage(val);
    }
  };

  // States
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Conversational AI Assistant state
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  // Populate first time calculation on mount
  useEffect(() => {
    // Welcome message showing current setup details
    setChatHistory([
      {
        sender: "assistant",
        text: `### ¡Hola Gamer! Soy tu Asistente Técnico Achorao IA. 
        
He analizado el simulador de hardware. Me encuentro listo para darte las mejores sugerencias sobre refrigeración, fuentes de poder o si este upgrade tiene cuello de botella. 

¿De qué te gustaría hablar hoy? Selecciona una consulta popular abajo o escríbeme directamente.`,
      },
    ]);
  }, []);

  // Sync handler to match Target PC with current PC components
  const handleCloneCurrentToTarget = () => {
    const activeCpu = useCustomCpu ? customCpu || "AMD Ryzen 5 5600X" : currentCpu;
    const activeGpu = useCustomGpu ? customGpu || "NVIDIA GeForce RTX 3060" : currentGpu;
    setTargetCpu(activeCpu);
    setTargetGpu(activeGpu);
    setTargetPlaca(currentPlaca);
    setTargetRam(currentRam);
    setTargetStorage(currentStorage);
  };

  const handleSimulate = async () => {
    const activeCpu = useCustomCpu ? customCpu : currentCpu;
    const activeGpu = useCustomGpu ? customGpu : currentGpu;

    if (!activeCpu || !activeGpu || !currentPlaca || !currentRam || !currentStorage ||
        !targetCpu || !targetGpu || !targetPlaca || !targetRam || !targetStorage) {
      setValidationError("Por favor, completa la selección de todos los componentes antes de iniciar la simulación.");
      return;
    }

    setValidationError("");
    setIsSimulating(true);
    setAiError("");

    try {
      const resCalc = await fetch("/api/simulator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCpu: activeCpu,
          currentGpu: activeGpu,
          currentPlaca,
          currentRam,
          currentStorage,
          targetCpu: targetCpu,
          targetGpu: targetGpu,
          targetPlaca,
          targetRam,
          targetStorage,
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

  // Submit dynamic question to Gemini AI
  const handleSendAiMessage = async (textToSend?: string) => {
    const query = textToSend || currentQuestion;
    if (!query.trim() || !simulation) return;

    // Add user question to history
    const userMsg: Message = { sender: "user", text: query };
    setChatHistory((prev) => [...prev, userMsg]);
    setCurrentQuestion("");
    setIsGeneratingAi(true);
    setAiError("");

    const activeCpu = useCustomCpu ? customCpu || "AMD Ryzen 5 5600X" : currentCpu;
    const activeGpu = useCustomGpu ? customGpu || "NVIDIA GeForce RTX 3060" : currentGpu;

    try {
      const res = await fetch("/api/simulator/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCpu: activeCpu,
          currentGpu: activeGpu,
          currentPlaca,
          currentRam,
          currentStorage,
          targetCpu,
          targetGpu,
          targetPlaca,
          targetRam,
          targetStorage,
          scores: simulation,
          lift: simulation.performanceLiftPercent,
          customQuery: query,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setChatHistory((prev) => [...prev, { sender: "assistant", text: data.report }]);
      }
    } catch (e) {
      setAiError("Ocurrió un error al contactar al servidor de inteligencia soporte.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Quick preset pills handler
  const handleQuickQuestionClick = (q: string) => {
    handleSendAiMessage(q);
  };

  // Add Target CPU/GPU/Placa/RAM/Storage parts respectively to shopping cart
  const handleAddTargetToCart = (type: "cpu" | "gpu" | "placa" | "ram" | "storage" | "all") => {
    if ((type === "cpu" || type === "all") && targetCpu) {
      const price = COMPONENT_PRICES[targetCpu] || 890.0;
      onAddToCart({
        id: `upgrade-cpu-${targetCpu.replace(/\s+/g, "-").toLowerCase()}`,
        title: `Componente Upgrade: CPU ${targetCpu}`,
        vendor: "Procesador",
        price,
        image: COMPONENT_IMAGES.cpu,
        available: true,
      });
    }

    if ((type === "gpu" || type === "all") && targetGpu) {
      const price = COMPONENT_PRICES[targetGpu] || 1990.0;
      onAddToCart({
        id: `upgrade-gpu-${targetGpu.replace(/\s+/g, "-").toLowerCase()}`,
        title: `Componente Upgrade: GPU ${targetGpu}`,
        vendor: "Tarjeta de Video",
        price,
        image: COMPONENT_IMAGES.gpu,
        available: true,
      });
    }

    if ((type === "placa" || type === "all") && targetPlaca) {
      const price = COMPONENT_PRICES[targetPlaca] || 590.0;
      onAddToCart({
        id: `upgrade-placa-${targetPlaca.replace(/\s+/g, "-").toLowerCase()}`,
        title: `Componente Upgrade: Placa Madre ${targetPlaca}`,
        vendor: "Placa Madre",
        price,
        image: COMPONENT_IMAGES.placa,
        available: true,
      });
    }

    if ((type === "ram" || type === "all") && targetRam) {
      const price = COMPONENT_PRICES[targetRam] || 290.0;
      onAddToCart({
        id: `upgrade-ram-${targetRam.replace(/\s+/g, "-").toLowerCase()}`,
        title: `Componente Upgrade: Memoria RAM ${targetRam}`,
        vendor: "Memoria RAM",
        price,
        image: COMPONENT_IMAGES.ram,
        available: true,
      });
    }

    if ((type === "storage" || type === "all") && targetStorage) {
      const price = COMPONENT_PRICES[targetStorage] || 290.0;
      onAddToCart({
        id: `upgrade-storage-${targetStorage.replace(/\s+/g, "-").toLowerCase()}`,
        title: `Componente Upgrade: Almacenamiento ${targetStorage}`,
        vendor: "Almacenamiento",
        price,
        image: COMPONENT_IMAGES.storage,
        available: true,
      });
    }
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-white font-extrabold bg-blue-500/10 px-1 rounded-sm">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const renderMarkdownMessage = (text: string) => {
    return text.split("\n").map((line, blockIdx) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith("###")) {
        return (
          <h4 key={blockIdx} className="text-sm font-black text-blue-400 mt-4 mb-2 uppercase tracking-wide">
            {cleanLine.replace("###", "")}
          </h4>
        );
      }
      if (cleanLine.startsWith("##")) {
        return (
          <h3 key={blockIdx} className="text-base font-extrabold text-blue-500 mt-5 mb-2 uppercase tracking-wide">
            {cleanLine.replace("##", "")}
          </h3>
        );
      }
      if (cleanLine.startsWith("#")) {
        return (
          <h2 key={blockIdx} className="text-lg font-black text-white mt-5 mb-3 uppercase">
            {cleanLine.replace("#", "")}
          </h2>
        );
      }
      if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        return (
          <li key={blockIdx} className="ml-4 list-disc text-xs text-gray-300 my-1 leading-relaxed">
            {parseBoldText(cleanLine.substring(1).trim())}
          </li>
        );
      }
      return (
        <p key={blockIdx} className="text-xs text-gray-300 leading-relaxed my-1.5 break">
          {parseBoldText(cleanLine)}
        </p>
      );
    });
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

  const popularPlacas = [
    "MSI B550M PRO-VDH WiFi",
    "ASUS Prime H610M DDR4",
    "ASUS Prime B760M-A WiFi DDR5",
    "MSI PRO Z790-A WiFi DDR5",
    "ASUS TUF Gaming A620M-PLUS (AM5)",
    "ASUS ROG STRIX X670E-F Gaming AM5",
  ];

  const popularRams = [
    "16GB (2x8GB) DDR4 3200MHz",
    "8GB (1x8GB) DDR4 2666MHz",
    "16GB (1x16GB) DDR5 5200MHz",
    "32GB (2x16GB) DDR5 6000MHz",
    "64GB (2x32GB) DDR5 6400MHz",
  ];

  const popularStorages = [
    "SSD Kingston A400 480GB SATA",
    "HDD Toshiba 1TB SATA 7200 RPM",
    "SSD Kingston NV2 1TB NVMe PCIe 4.0",
    "Corsair MP600 Pro 2TB NVMe PCIe 4.0",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 text-white space-y-8 select-none" id="simulator-console">
      {/* Introduction Banner header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase text-blue-400 font-mono">
          <Sparkles size={12} className="animate-spin text-blue-400" />
          SIMULA Y COMPARA
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white">
          Simular Setup / Upgrade de Computadora
        </h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto font-medium">
          Compara tus especificaciones y encuentra las mermas potenciales de rendimiento FPS. Haz clic en "Simular Ahora" para actualizar el Lift de rendimiento y añadir piezas a tu compra.
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
            
            <button
              onClick={handleCloneCurrentToTarget}
              className="text-[10px] bg-white/5 border border-white/10 hover:border-blue-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-full font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <Zap size={11} className="text-yellow-400" />
              Clonar PC Actual a Objetivo
            </button>
          </div>

          {/* GUÍA RÁPIDA PARA DECIDIR TU UPGRADE (Semaforo Accordion) */}
          <div className="bg-[#050506] border border-white/5 rounded-2xl overflow-hidden transition-all duration-350">
            <button
              type="button"
              onClick={() => setShowTrafficGuide(!showTrafficGuide)}
              className="w-full flex items-center justify-between p-4 bg-[#0A0A0B]/60 hover:bg-white/5 transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="text-xl animate-pulse">🚦</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono block">RECURSIVO DE APOYO</span>
                  <h4 className="text-xs font-black text-gray-200">Guía Rápida para Decidir tu Upgrade (Semáforo)</h4>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-[9px] font-bold uppercase hidden sm:inline">
                  {showTrafficGuide ? "Ocultar Guía" : "Ver Guía Completa"}
                </span>
                <div className={`p-1 bg-white/5 rounded border border-white/10 transition-transform duration-300 ${showTrafficGuide ? "rotate-180" : ""}`}>
                  <ChevronDown size={12} />
                </div>
              </div>
            </button>

            {showTrafficGuide && (
              <div className="p-5 border-t border-white/5 space-y-6 text-xs text-gray-300 animate-in slide-in-from-top-4 duration-300">
                
                {/* Intro status list */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0 shadow-sm shadow-emerald-500/50"></span>
                    <span className="font-bold text-[11px] text-gray-205">🟢 No hace falta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0 shadow-sm shadow-amber-500/50"></span>
                    <span className="font-bold text-[11px] text-gray-205">🟡 Mantener 1–3 años</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0 shadow-sm shadow-orange-500/50"></span>
                    <span className="font-bold text-[11px] text-gray-205">🟠 Cámbialo si puedes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 shadow-sm shadow-red-500/50"></span>
                    <span className="font-bold text-[11px] text-gray-205">🔴 Es hora de cambiar</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CPU Upgrade Guide Table */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <span className="text-sm">💻</span>
                      <h4 className="font-black text-gray-100 uppercase tracking-wider text-xs">¿Debo mejorar mi procesador?</h4>
                    </div>

                    <div className="space-y-2.5">
                      {/* Verde row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-emerald-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-sm shadow-emerald-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-emerald-400">Verde (No hace falta)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          Intel Core i7/i9 10ª–14ª gen · Ryzen 7/9 5000X3D/7000
                        </p>
                        <p className="text-[10px] text-gray-400 italic font-semibold">
                          ➔ Recomendación: Mantén y prioriza GPU/RAM.
                        </p>
                      </div>

                      {/* Amarillo row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-amber-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-sm shadow-amber-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-amber-400">Amarillo (Mantener 1–3 años)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          Intel Core i5 10ª–13ª · Ryzen 5/7 3000–5000
                        </p>
                        <p className="text-[10px] text-gray-400 italic font-semibold">
                          ➔ Recomendación: Aún rinde; considera upgrade si haces edición/render.
                        </p>
                      </div>

                      {/* Naranja row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-orange-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-orange-400">Naranja (Cámbialo si puedes)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          Intel Core i3/i5 6ª–9ª · Ryzen 1ª–2ª
                        </p>
                        <p className="text-[10px] text-gray-400 italic font-semibold">
                          ➔ Recomendación: Notarás cuello de botella con GPUs nuevas.
                        </p>
                      </div>

                      {/* Rojo row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-red-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-sm shadow-red-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-red-400">Rojo (Es hora de cambiar)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          Core 2 / Pentium / Celeron antiguos
                        </p>
                        <p className="text-[10px] text-gray-400 italic font-semibold">
                          ➔ Recomendación: Recomendada plataforma nueva (placa + RAM + CPU).
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                      <span className="text-xs mt-0.5 text-blue-400"><i className="bi bi-lightbulb-fill"></i></span>
                      <p className="text-[10.5px] text-blue-300 font-semibold leading-relaxed">
                        <strong className="text-white">Tip Achorao:</strong> para ofimática y navegación pesada, prioriza pasar de 8 a 16 GB RAM y un SSD NVMe PCIe fast.
                      </p>
                    </div>
                  </div>

                  {/* GPU Upgrade Guide Table */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <span className="text-sm text-emerald-450"><i className="bi bi-controller"></i></span>
                      <h4 className="font-black text-gray-100 uppercase tracking-wider text-xs">¿Debo mejorar mi tarjeta gráfica?</h4>
                    </div>

                    <div className="space-y-2.5">
                      {/* Verde row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-emerald-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-sm shadow-emerald-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-emerald-400">Verde (No hace falta)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          RTX 4070/4080/4090 · RX 7900XT/XTX
                        </p>
                        <p className="text-[10px] text-gray-440 italic font-semibold">
                          ➔ Recomendación: Listas para 1440p–4K; primero mejora monitor/CPU si hace falta.
                        </p>
                      </div>

                      {/* Amarillo row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-amber-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-sm shadow-amber-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-amber-400">Amarillo (Conserva 1–2 años)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          RTX 3080/3070 · RX 6800/6700XT
                        </p>
                        <p className="text-[10px] text-gray-440 italic font-semibold">
                          ➔ Recomendación: Aún sólidos en 1080p/1440p; evalúa salto si quieres RT/4K.
                        </p>
                      </div>

                      {/* Naranja row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-orange-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#F97316] shadow-sm shadow-orange-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-orange-400">Naranja (Conserva 2–4 años)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          RTX 3060/3050 · GTX 1660/1650 · RX 6600/6500XT
                        </p>
                        <p className="text-[10px] text-gray-440 italic font-semibold">
                          ➔ Recomendación: Bien para 1080p medio; upgrade si buscas alto/RT.
                        </p>
                      </div>

                      {/* Rojo row */}
                      <div className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-red-500/10 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-sm shadow-red-500/50"></span>
                          <span className="text-[10px] font-black uppercase text-red-400">Rojo (Actualízala cuanto antes)</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-gray-200 mb-1 leading-snug">
                          GTX 1050 Ti o menores · RX 570 o anteriores
                        </p>
                        <p className="text-[10px] text-gray-440 italic font-semibold">
                          ➔ Recomendación: Recomendado actualizar a serie actual (DLSS/FSR, RT).
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#10B981]/5 border border-[#10B981]/15 rounded-xl flex items-start gap-2">
                      <span className="text-xs mt-0.5 text-emerald-400"><i className="bi bi-lightbulb-fill"></i></span>
                      <p className="text-[10.5px] text-emerald-400 font-semibold leading-relaxed">
                        <strong className="text-white">Tip Achorao:</strong> para 1080p competitivo, prioriza &ge; 120 FPS; para RT/creación, busca 12-16 GB VRAM.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footnote matching user's transcription completely */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-gray-500 font-medium leading-relaxed">
                  <p className="flex-1">
                    * Referencial y orientativo. Tu caso real puede variar por juegos, drivers, resoluciones y estado de tu equipo.
                  </p>
                  <p className="text-emerald-400 font-bold shrink-0 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-lg">
                    Para una recomendación exacta usa el Simulador Achorao y la pestaña de productividad.
                  </p>
                </div>
              </div>
            )}
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
                    <option value="">-- Seleccionar CPU (Actual) --</option>
                    {popularCpus.map((cpu) => (
                      <option key={cpu} value={cpu}>
                        {cpu}
                      </option>
                    ))}
                  </select>
                )}

                {/* Real-time CPU status traffic-light indicator */}
                {(() => {
                  const cpuVal = useCustomCpu ? customCpu : currentCpu;
                  const cpuStatus = getCpuStatus(cpuVal);
                  if (!cpuVal) return null;
                  return (
                    <div className={`mt-2 p-2.5 rounded-xl border ${cpuStatus.bg} ${cpuStatus.border} flex items-start gap-2.5 transition-all animate-in fade-in duration-350`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${cpuStatus.dot} mt-1 shrink-0 shadow-lg shadow-${cpuStatus.color}-500/50 animate-pulse`} />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${cpuStatus.text}`}>
                            {cpuStatus.label}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold">• Semáforo CPU</span>
                        </div>
                        <p className="text-[10px] text-gray-300 leading-normal font-semibold">
                          {cpuStatus.recomendacion}
                        </p>
                      </div>
                    </div>
                  );
                })()}
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
                    <option value="">-- Seleccionar GPU (Actual) --</option>
                    {popularGpus.map((gpu) => (
                      <option key={gpu} value={gpu}>
                        {gpu}
                      </option>
                    ))}
                  </select>
                )}

                {/* Real-time GPU status traffic-light indicator */}
                {(() => {
                  const gpuVal = useCustomGpu ? customGpu : currentGpu;
                  const gpuStatus = getGpuStatus(gpuVal);
                  if (!gpuVal) return null;
                  return (
                    <div className={`mt-2 p-2.5 rounded-xl border ${gpuStatus.bg} ${gpuStatus.border} flex items-start gap-2.5 transition-all animate-in fade-in duration-350`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${gpuStatus.dot} mt-1 shrink-0 shadow-lg shadow-${gpuStatus.color}-500/50 animate-pulse`} />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${gpuStatus.text}`}>
                            {gpuStatus.label}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold">• Semáforo GPU</span>
                        </div>
                        <p className="text-[10px] text-gray-300 leading-normal font-semibold">
                          {gpuStatus.recomendacion}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Placa Madre selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Placa Madre</label>
                <select
                  value={currentPlaca}
                  onChange={(e) => handleCurrentPlacaChange(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  id="current-placa-select"
                >
                  <option value="">-- Seleccionar Placa (Actual) --</option>
                  {popularPlacas.map((placa) => (
                    <option key={placa} value={placa}>
                      {placa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Memoria RAM selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Memoria RAM</label>
                <select
                  value={currentRam}
                  onChange={(e) => handleCurrentRamChange(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  id="current-ram-select"
                >
                  <option value="">-- Seleccionar RAM (Actual) --</option>
                  {popularRams.map((ram) => (
                    <option key={ram} value={ram}>
                      {ram}
                    </option>
                  ))}
                </select>
              </div>

              {/* Almacenamiento selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Almacenamiento</label>
                <select
                  value={currentStorage}
                  onChange={(e) => handleCurrentStorageChange(e.target.value)}
                  className="w-full h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  id="current-storage-select"
                >
                  <option value="">-- Seleccionar Disco (Actual) --</option>
                  {popularStorages.map((storage) => (
                    <option key={storage} value={storage}>
                      {storage}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upgrade target / Recommended details (Right side) */}
            <div className="space-y-4">
              <div className="p-1 px-3 bg-[#0A0A0B] border border-white/5 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-bold uppercase font-mono">Objetivo de Upgrade / PC Destino</span>
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded px-1.5 font-mono">SELECCIONADO</span>
              </div>

              {/* Target CPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Procesador Destino</label>
                <div className="flex gap-2">
                  <select
                    value={targetCpu}
                    onChange={(e) => setTargetCpu(e.target.value)}
                    className="flex-1 h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="target-cpu-select"
                  >
                    <option value="">-- Seleccionar CPU (Destino) --</option>
                    {popularCpus.map((cpu) => (
                      <option key={cpu} value={cpu}>
                        {cpu}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddTargetToCart("cpu")}
                    disabled={!targetCpu}
                    className="px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Agregar CPU al Carrito"
                  >
                    <ShoppingCart size={13} />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              </div>

              {/* Target GPU */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Gráfica Destina</label>
                <div className="flex gap-2">
                  <select
                    value={targetGpu}
                    onChange={(e) => setTargetGpu(e.target.value)}
                    className="flex-1 h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="target-gpu-select"
                  >
                    <option value="">-- Seleccionar GPU (Destino) --</option>
                    {popularGpus.map((gpu) => (
                      <option key={gpu} value={gpu}>
                        {gpu}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddTargetToCart("gpu")}
                    disabled={!targetGpu}
                    className="px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Agregar GPU al Carrito"
                  >
                    <ShoppingCart size={13} />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              </div>

              {/* Target Placa Madre */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Placa Madre Destino</label>
                <div className="flex gap-2">
                  <select
                    value={targetPlaca}
                    onChange={(e) => setTargetPlaca(e.target.value)}
                    className="flex-1 h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="target-placa-select"
                  >
                    <option value="">-- Seleccionar Placa (Destino) --</option>
                    {popularPlacas.map((placa) => (
                      <option key={placa} value={placa}>
                        {placa}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddTargetToCart("placa")}
                    disabled={!targetPlaca}
                    className="px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Agregar Placa al Carrito"
                  >
                    <ShoppingCart size={13} />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              </div>

              {/* Target Memoria RAM */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">RAM Destino</label>
                <div className="flex gap-2">
                  <select
                    value={targetRam}
                    onChange={(e) => setTargetRam(e.target.value)}
                    className="flex-1 h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="target-ram-select"
                  >
                    <option value="">-- Seleccionar RAM (Destino) --</option>
                    {popularRams.map((ram) => (
                      <option key={ram} value={ram}>
                        {ram}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddTargetToCart("ram")}
                    disabled={!targetRam}
                    className="px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Agregar RAM al Carrito"
                  >
                    <ShoppingCart size={13} />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              </div>

              {/* Target Almacenamiento */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Almacenamiento Destino</label>
                <div className="flex gap-2">
                  <select
                    value={targetStorage}
                    onChange={(e) => setTargetStorage(e.target.value)}
                    className="flex-1 h-10 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    id="target-storage-select"
                  >
                    <option value="">-- Seleccionar Disco (Destino) --</option>
                    {popularStorages.map((storage) => (
                      <option key={storage} value={storage}>
                        {storage}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAddTargetToCart("storage")}
                    disabled={!targetStorage}
                    className="px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Agregar Almacenamiento al Carrito"
                  >
                    <ShoppingCart size={13} />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              </div>

              {/* master Agregar Todos al Carrito button */}
              <div className="pt-2">
                <button
                  onClick={() => handleAddTargetToCart("all")}
                  disabled={!targetCpu && !targetGpu && !targetPlaca && !targetRam && !targetStorage}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-600 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart size={14} />
                  Agregar Componentes Seleccionados al Carrito
                </button>
              </div>
            </div>
          </div>

          {/* Validation Message display if any components unselected */}
          {validationError && (
            <div className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
              <AlertTriangle size={15} className="text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action and status footer containing manual trigger button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-400 text-left">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></div>
              <span>Cambia los procesadores o tarjetas de arriba y pulsa "Simular Ahora" para recalcular el lift de rendimiento.</span>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full sm:w-auto h-11 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-blue-500/10 hover:scale-[1.02]"
              id="btn-trigger-simulation"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="animate-spin text-white" size={16} />
                  Calculando Upgrades...
                </>
              ) : (
                <>
                  <Gauge size={16} />
                  Simular Ahora
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Simulator feedback results */}
        <div className="space-y-6">
          {simulation ? (
            <div className="bg-[#0F0F12] border border-white/10 rounded-3xl p-6 space-y-6 animate-in fade-in duration-300 font-sans">
              
              {/* Target PC Cart Integrations Panel */}
              <div className="bg-gradient-to-r from-blue-900/15 via-black/40 to-blue-900/5 border border-blue-500/15 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase font-mono">ADQUISICIÓN DE UPGRADE</span>
                  <h4 className="text-xs font-semibold text-white">¿Te gusta este rendimiento? Agrega las piezas seleccionadas a tu carrito</h4>
                  <p className="text-[10px] text-gray-500">Puedes agregarlos de forma individual con un clic.</p>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleAddTargetToCart("cpu")}
                    className="h-9 px-3 bg-[#0A0A0B] border border-white/10 hover:border-blue-500/50 text-[11px] text-white rounded-xl transition-all font-bold uppercase cursor-pointer"
                    title={`Agregar CPU ${targetCpu}`}
                  >
                    + CPU
                  </button>
                  <button
                    onClick={() => handleAddTargetToCart("gpu")}
                    className="h-9 px-3 bg-[#0A0A0B] border border-white/10 hover:border-blue-500/50 text-[11px] text-white rounded-xl transition-all font-bold uppercase cursor-pointer"
                    title={`Agregar GPU ${targetGpu}`}
                  >
                    + GPU
                  </button>
                  <button
                    onClick={() => handleAddTargetToCart("placa")}
                    className="h-9 px-3 bg-[#0A0A0B] border border-white/10 hover:border-blue-500/50 text-[11px] text-white rounded-xl transition-all font-bold uppercase cursor-pointer"
                    title={`Agregar Placa ${targetPlaca}`}
                  >
                    + Placa
                  </button>
                  <button
                    onClick={() => handleAddTargetToCart("ram")}
                    className="h-9 px-3 bg-[#0A0A0B] border border-white/10 hover:border-blue-500/50 text-[11px] text-white rounded-xl transition-all font-bold uppercase cursor-pointer"
                    title={`Agregar RAM ${targetRam}`}
                  >
                    + RAM
                  </button>
                  <button
                    onClick={() => handleAddTargetToCart("storage")}
                    className="h-9 px-3 bg-[#0A0A0B] border border-white/10 hover:border-blue-500/50 text-[11px] text-white rounded-xl transition-all font-bold uppercase cursor-pointer"
                    title={`Agregar Disco ${targetStorage}`}
                  >
                    + Disco
                  </button>
                  <button
                    onClick={() => handleAddTargetToCart("all")}
                    className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] transition-all font-black uppercase flex items-center gap-1 cursor-pointer"
                    title="Agregar todos los componentes destinos al carrito"
                  >
                    <ShoppingCart size={13} />
                    Agregar Todo
                  </button>
                </div>
              </div>

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
                          {/* Low settings progress comparison */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                              <span>Gráficos Bajo (Esports)</span>
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
                                style={{ width: `${Math.max(0, ((tf.low - cf.low) / 360) * 100)}%` }}
                                className="h-full bg-emerald-500 rounded-r-full"
                              ></div>
                            </div>
                          </div>

                          {/* Ultra settings progress comparison */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-400 font-medium font-sans">
                              <span>Gráficos Ultra (Calidad)</span>
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
                                style={{ width: `${Math.max(0, ((tf.ultra - cf.ultra) / 240) * 100)}%` }}
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
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="text-xs space-y-1 text-left">
                    <span className="font-bold uppercase tracking-wider text-orange-400 block font-mono">
                      Auditoría de Cuello de Botella
                    </span>
                    <p className="text-gray-300 leading-relaxed">{simulation.bottleneckAnalysis}</p>
                  </div>
                </div>

                <div className="sm:col-span-12 md:col-span-5 bg-black/30 border border-white/5 rounded-2xl p-4 flex gap-3 items-start">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 font-mono">
                    <Zap size={18} className="animate-pulse" />
                  </div>
                  <div className="text-xs space-y-1 text-left">
                    <span className="font-bold uppercase tracking-wider text-blue-400 block font-mono">
                      Uso de Energía Recomendado
                    </span>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      TDP Estimado total: <strong>{simulation.powerRequirementWatts}W</strong>. Se aconseja una fuente certificada <strong>80 Plus de {Math.ceil((simulation.powerRequirementWatts + 150) / 100) * 100}W</strong> para óptima seguridad de tu inversión.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highly interactive graphical AI Consultation chat messenger board */}
              <div className="border-t border-white/10 pt-6 space-y-4 font-sans text-left">
                <div className="flex gap-2 items-center">
                  <div className="p-1.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/10">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Consultor de Hardware Achorao AI</h5>
                    <p className="text-[11px] text-gray-500">¿Tienes dudas del ensamble? Puedes preguntarle sugerencias personalizadas de placas, latencias o marca de fuente</p>
                  </div>
                </div>

                {/* AI Chat History Box */}
                <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-4 max-h-[380px] overflow-y-auto space-y-4">
                  {chatHistory.map((m, idx) => (
                    <div key={idx} className={`flex items-start gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {m.sender === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow shadow-blue-500/20">
                          A
                        </div>
                      )}

                      <div className={`p-4.5 rounded-2xl max-w-[85%] text-xs ${
                        m.sender === "user" 
                          ? "bg-blue-600 text-white rounded-tr-none font-medium ml-12"
                          : "bg-white/[0.03] border border-white/5 text-gray-300 rounded-tl-none mr-12"
                      }`}>
                        {m.sender === "assistant" ? renderMarkdownMessage(m.text) : <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>}
                      </div>

                      {m.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-200 flex items-center justify-center shrink-0">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  ))}

                  {isGeneratingAi && (
                    <div className="flex items-center gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs animate-pulse">
                        A
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-blue-400 font-semibold font-mono">
                        <Loader2 className="animate-spin text-blue-400" size={14} />
                        El Técnico de soporte Achorao está respondiendo...
                      </div>
                    </div>
                  )}

                  {aiError && (
                    <div className="p-3 bg-red-900/15 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono">
                      {aiError}
                    </div>
                  )}
                </div>

                {/* Popular Pills Recommendations Tag Box */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-500 font-black tracking-widest font-mono uppercase block">Sugerencias recomendadas:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "¿Qué fuente de poder me recomiendas para este upgrade?",
                      "¿Este procesador limitará el rendimiento de mi gráfica?",
                      "¿Qué opciones de placas madre AM5/Intel recomendadas hay para este setup?",
                      "Dame consejos rápidos para refrigerar bien este setup.",
                    ].map((pill) => (
                      <button
                        key={pill}
                        onClick={() => handleQuickQuestionClick(pill)}
                        disabled={isGeneratingAi}
                        className="text-[10px] bg-white/[0.02] border border-white/10 hover:border-blue-500/50 hover:bg-blue-950/20 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium disabled:opacity-50"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Input Container */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe tu consulta sobre el upgrade..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isGeneratingAi) handleSendAiMessage();
                    }}
                    disabled={isGeneratingAi}
                    className="flex-1 h-11 bg-[#0A0A0B] border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-40"
                  />
                  <button
                    onClick={() => handleSendAiMessage()}
                    disabled={isGeneratingAi || !currentQuestion.trim()}
                    className="w-11 h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer select-none"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl space-y-4 bg-black/10 font-sans">
              <Gauge className="text-gray-700" size={48} />
              <div>
                <h4 className="text-base font-bold text-gray-300">Monitoreo de Upgrade Inactivo</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1 leading-normal">
                  Ingresa las combinaciones de procesadores y tarjetas de video de arriba y presiona "Simular Ahora" para proyectar tus FPS competitivos.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
