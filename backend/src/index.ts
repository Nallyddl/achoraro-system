import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express, { Router } from "express";

dotenv.config();

export const router = Router();

// Known benchmarks (PassMark database fallback) for Scraper Simulator
export const CPU_BENCHMARKS: { [key: string]: { score: number; details: string; tdp: string } } = {
  "AMD Ryzen 5 5600X": { score: 21900, details: "6 Cores, 12 Threads @ 3.7GHz", tdp: "65W" },
  "AMD Ryzen 7 5700X": { score: 26700, details: "8 Cores, 16 Threads @ 3.4GHz", tdp: "65W" },
  "AMD Ryzen 7 7800X3D": { score: 34300, details: "8 Cores, 16 Threads @ 4.2GHz (3D V-Cache)", tdp: "120W" },
  "AMD Ryzen 9 7950X": { score: 63200, details: "16 Cores, 32 Threads @ 4.5GHz", tdp: "170W" },
  "Intel Core i5-12400F": { score: 19500, details: "6 Cores, 12 Threads @ 2.5GHz", tdp: "65W" },
  "Intel Core i7-13700K": { score: 46500, details: "16 Cores, 24 Threads @ 3.4GHz", tdp: "125W" },
  "Intel Core i9-14900K": { score: 60800, details: "24 Cores, 32 Threads @ 3.2GHz", tdp: "125W" },
  "Intel Core i3-12100": { score: 13800, details: "4 Cores, 8 Threads @ 3.3GHz", tdp: "60W" },
  "Ryzen 5 3600": { score: 17800, details: "6 Cores, 12 Threads @ 3.6GHz", tdp: "65W" },
  "Intel Core i7-7700K": { score: 9700, details: "4 Cores, 8 Threads @ 4.2GHz", tdp: "91W" }
};

export const GPU_BENCHMARKS: { [key: string]: { score: number; details: string; tdp: string; vram: string } } = {
  "NVIDIA GeForce RTX 3060": { score: 17200, details: "Ampere Architecture, 3584 CUDA Cores", tdp: "170W", vram: "12GB" },
  "NVIDIA GeForce RTX 4060": { score: 22800, details: "Ada Lovelace Architecture, DLSS 3.0", tdp: "115W", vram: "8GB" },
  "NVIDIA GeForce RTX 4070 SUPER": { score: 31800, details: "High fidelity ray tracing & Tensor cores", tdp: "220W", vram: "12GB" },
  "NVIDIA GeForce RTX 4090": { score: 39200, details: "Ultimate gaming performance GPU", tdp: "450W", vram: "24GB" },
  "AMD Radeon RX 6600": { score: 14500, details: "RDNA 2 Architecture, budget 1080p gaming", tdp: "132W", vram: "8GB" },
  "AMD Radeon RX 7800 XT": { score: 28100, details: "RDNA 3 gaming beast, great value", tdp: "263W", vram: "16GB" },
  "NVIDIA GTX 1650": { score: 7800, details: "Turing core, entry-level display card", tdp: "75W", vram: "4GB" },
  "NVIDIA GeForce RTX 4080 SUPER": { score: 35400, details: "High-tier Ray Tracing & DLSS 3", tdp: "320W", vram: "16GB" },
  "NVIDIA GTX 1060": { score: 10200, details: "Classic Pascal graphics card", tdp: "120W", vram: "6GB" }
};

// Lazy initialization of Gemini client to satisfy api-key safety
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Support endpoints
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Achorao Backend" });
});

// 1. PassMark Scraper API Simulator
router.get("/simulator/passmark", (req: any, res: any) => {
  const { name, type } = req.query;
  if (!name) {
    return res.status(400).json({ error: "No component name supplied." });
  }

  const queryStr = String(name).trim();
  const componentType = String(type).toLowerCase();

  // Perform Scraper Simulation (match name directly or find best match)
  if (componentType === "cpu") {
    const matchedKey = Object.keys(CPU_BENCHMARKS).find(
      (k) => k.toLowerCase().includes(queryStr.toLowerCase()) || queryStr.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey) {
      return res.json({
        found: true,
        source: "PassMark Scraper Database",
        name: matchedKey,
        score: CPU_BENCHMARKS[matchedKey].score,
        details: CPU_BENCHMARKS[matchedKey].details,
        tdp: CPU_BENCHMARKS[matchedKey].tdp,
        vram: "N/A"
      });
    }

    // Dynamic extraction logic for custom typed components (Scraper fallback)
    const randomScore = Math.floor(15000 + Math.random() * 25000);
    return res.json({
      found: true,
      source: "Live Scraper Estimate",
      name: queryStr,
      score: randomScore,
      details: "Simulated Custom CPU Core",
      tdp: "65W - 125W",
      vram: "N/A"
    });
  } else {
    const matchedKey = Object.keys(GPU_BENCHMARKS).find(
      (k) => k.toLowerCase().includes(queryStr.toLowerCase()) || queryStr.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey) {
      return res.json({
        found: true,
        source: "PassMark Scraper Database",
        name: matchedKey,
        score: GPU_BENCHMARKS[matchedKey].score,
        details: GPU_BENCHMARKS[matchedKey].details,
        tdp: GPU_BENCHMARKS[matchedKey].tdp,
        vram: GPU_BENCHMARKS[matchedKey].vram
      });
    }

    const randomScore = Math.floor(8000 + Math.random() * 22000);
    return res.json({
      found: true,
      source: "Live Scraper Estimate",
      name: queryStr,
      score: randomScore,
      details: "Simulated Custom Graphics Card",
      tdp: "150W - 300W",
      vram: "8GB"
    });
  }
});

// 2. Performance Analysis and FPS Calculation Simulator
router.post("/simulator/calculate", (req: any, res: any) => {
  const { 
    currentCpu, currentGpu, currentPlaca, currentRam, currentStorage,
    targetCpu, targetGpu, targetPlaca, targetRam, targetStorage 
  } = req.body;

  // Retrieve scores for core components
  const cCpuMatch = CPU_BENCHMARKS[currentCpu] || { score: 15000 };
  const cGpuMatch = GPU_BENCHMARKS[currentGpu] || { score: 12000 };
  const tCpuMatch = CPU_BENCHMARKS[targetCpu] || { score: 30000 };
  const tGpuMatch = GPU_BENCHMARKS[targetGpu] || { score: 25000 };

  const cCpuScore = cCpuMatch.score;
  const cGpuScore = cGpuMatch.score;
  const tCpuScore = tCpuMatch.score;
  const tGpuScore = tGpuMatch.score;

  // Helper values for Mobo, RAM and SSD (Peru customized pricing/ratings lookup)
  const RAM_SCORES: { [key: string]: number } = {
    "8GB (1x8GB) DDR4 2666MHz": 500,
    "16GB (2x8GB) DDR4 3200MHz": 1200,
    "16GB (1x16GB) DDR5 5200MHz": 1500,
    "32GB (2x16GB) DDR5 6000MHz": 2500,
    "64GB (2x32GB) DDR5 6400MHz": 3500,
  };

  const STORAGE_SCORES: { [key: string]: number } = {
    "HDD Toshiba 1TB SATA 7200 RPM": 150,
    "SSD Kingston A400 480GB SATA": 600,
    "SSD Kingston NV2 1TB NVMe PCIe 4.0": 1600,
    "Corsair MP600 Pro 2TB NVMe PCIe 4.0": 2800,
  };

  const MOBO_SCORES: { [key: string]: number } = {
    "ASUS Prime H610M DDR4": 400,
    "ASUS Prime B760M-A WiFi DDR5": 1000,
    "MSI PRO Z790-A WiFi DDR5": 1800,
    "MSI B550M PRO-VDH WiFi": 900,
    "ASUS TUF Gaming A620M-PLUS (AM5)": 1100,
    "ASUS ROG STRIX X670E-F Gaming AM5": 2200,
  };

  const cPlacaScore = MOBO_SCORES[currentPlaca] || 800;
  const tPlacaScore = MOBO_SCORES[targetPlaca] || 1200;
  const cRamScore = RAM_SCORES[currentRam] || 1200;
  const tRamScore = RAM_SCORES[targetRam] || 2500;
  const cStorageScore = STORAGE_SCORES[currentStorage] || 800;
  const tStorageScore = STORAGE_SCORES[targetStorage] || 1600;

  // FPS formulas based on CPU/GPU Marks with slight RAM/Storage speed multipliers
  const calculateFps = (cpuScore: number, gpuScore: number, ramScore: number, storageScore: number, factor: number) => {
    const ramMultiplier = 0.9 + (ramScore / 10000); // DDR5 dual channel provides 5-10% FPS boosts
    const storageMultiplier = 0.95 + (storageScore / 15000); // SSDs reduce asset streaming stutters
    const speedCoeff = ramMultiplier * storageMultiplier * factor;

    const rawFpsLow = ((cpuScore * 0.003) + (gpuScore * 0.005)) * speedCoeff;
    const rawFpsUltra = ((cpuScore * 0.001) + (gpuScore * 0.003)) * speedCoeff * 0.6;
    return {
      low: Math.round(Math.max(45, Math.min(360, rawFpsLow))),
      ultra: Math.round(Math.max(15, Math.min(240, rawFpsUltra)))
    };
  };

  const currentFps = {
    "Fortnite Battle Royale": calculateFps(cCpuScore, cGpuScore, cRamScore, cStorageScore, 1.2),
    "Valorant": calculateFps(cCpuScore, cGpuScore, cRamScore, cStorageScore, 1.6), // Highly CPU bound
    "Cyberpunk 2077": calculateFps(cCpuScore, cGpuScore, cRamScore, cStorageScore, 0.75), // Extremely GPU bound
    "Call of Duty: Warzone": calculateFps(cCpuScore, cGpuScore, cRamScore, cStorageScore, 1.0)
  };

  const targetFps = {
    "Fortnite Battle Royale": calculateFps(tCpuScore, tGpuScore, tRamScore, tStorageScore, 1.2),
    "Valorant": calculateFps(tCpuScore, tGpuScore, tRamScore, tStorageScore, 1.6),
    "Cyberpunk 2077": calculateFps(tCpuScore, tGpuScore, tRamScore, tStorageScore, 0.75),
    "Call of Duty: Warzone": calculateFps(tCpuScore, tGpuScore, tRamScore, tStorageScore, 1.0)
  };

  // Synthetic Combined Lift Calculation (CPU + GPU + Placa + RAM + SSD)
  const currentTotal = cCpuScore + cGpuScore + cPlacaScore + cRamScore + cStorageScore;
  const targetTotal = tCpuScore + tGpuScore + tPlacaScore + tRamScore + tStorageScore;
  const liftPercentage = Math.round(((targetTotal - currentTotal) / currentTotal) * 100);

  // Simple Offline Bottleneck logic enhanced with Mobo and RAM mismatch safety
  let bottleneck = "Configuración balanceada y fluida con repotenciación integral.";
  if (cCpuScore / cGpuScore > 1.8) {
    bottleneck = "Cuello de botella en Gráficos (GPU Bottleneck). Tu procesador es de altísimo nivel, pero la tarjeta de video actual limita drásticamente la tasa de FPS.";
  } else if (cGpuScore / cCpuScore > 1.8) {
    bottleneck = "Cuello de botella en Procesador (CPU Bottleneck). Tu tarjeta de video no rendirá al máximo porque el procesador tiene frecuencias o núcleos insuficientes.";
  } else if (targetRam.includes("8GB") && targetCpu.includes("Ryzen 9")) {
    bottleneck = "Advertencia: Tienes un Procesador Ryzen de Gama Alta emparejado con solo 8GB de RAM. Esto causará stutters y mermas graves de rendimiento general.";
  }

  // TDP calculations
  const extractTdpNum = (tdpStr: string) => parseInt(tdpStr?.replace(/\D/g, "") || "150");
  const estimatedPowerUsage = extractTdpNum((tCpuMatch as any).tdp || "100W") + extractTdpNum((tGpuMatch as any).tdp || "200W") + 120; // +120W buffer for other parts

  return res.json({
    currentCpuScore: cCpuScore,
    currentGpuScore: cGpuScore,
    targetCpuScore: tCpuScore,
    targetGpuScore: tGpuScore,
    currentFps,
    targetFps,
    performanceLiftPercent: Math.max(0, liftPercentage),
    bottleneckAnalysis: bottleneck,
    powerRequirementWatts: estimatedPowerUsage
  });
});

// 3. AI Bottleneck Counselor (Optional Gemini Intelligence support)
router.post("/simulator/ai-report", async (req: any, res: any) => {
  const { 
    currentCpu, currentGpu, currentPlaca, currentRam, currentStorage,
    targetCpu, targetGpu, targetPlaca, targetRam, targetStorage,
    scores, lift, customQuery 
  } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Deterministic Offline recommendation if No Key configured yet (short and concise)
      const report = `### ⚡ Reporte Rápido (Soporte Achorao Offline)

- **Mejora Estimada:** Aproximadamente **+${lift}%** más rápido globalmente.
- **Cuello de Botella:** El procesador **${targetCpu}** se acopla de manera balanceada y fluida con la tarjeta **${targetGpu}**.
- **Energía Proyectada:** Consumo aproximado de **${scores?.powerRequirementWatts || 450}W**. Se exige fuente certificada de mínimo **${Math.ceil(((scores?.powerRequirementWatts || 450) + 150) / 100) * 100}W** (80 Plus Bronze o Gold).
- **RAM Recomendada:** Se sugieren memorias DDR5 de alta frecuencia a 6000MHz.

*Sugerencia: Regístrate con tu clave Gemini en configuración para activar la IA en vivo.*`;
      return res.json({ report });
    }

    let prompt = "";
    if (customQuery) {
      prompt = `Actúa como el experto técnico de hardware de "Achorao" de Perú. Responde la duda: "${customQuery}"
Setup actual: CPU ${currentCpu}, GPU ${currentGpu}, Placa ${currentPlaca}, RAM ${currentRam}, Disco ${currentStorage}
Setup destino: CPU ${targetCpu}, GPU ${targetGpu}, Placa ${targetPlaca}, RAM ${targetRam}, Disco ${targetStorage}
Mejora: +${lift}% (Consumo: ${scores?.powerRequirementWatts || 400}W)

REGLAS CRÍTICAS DE RESPUESTA:
- Sé ultra puntual, conciso y directo ("cero floro"). La respuesta completa NO debe superar las 2 o 3 líneas (máximo 45 palabras).
- No saludes, no te presentes, no pongas introducciones ni conclusiones genéricas. Responde al grano de inmediato.
- Usa jerga gamer peruana corta ("al toque", "achorado", "fijo", "de ley").
- Reporta solo datos ultra específicos que ayuden de verdad al usuario.
- Jamás menciones "Gemini", "API", "modelo" o "IA".`;
    } else {
      prompt = `Actúa como el experto de hardware de "Achorao" de Perú. Analiza este upgrade ultra rápido de forma hiper puntual ("cero floro").
De: CPU ${currentCpu}, GPU ${currentGpu}, Placa ${currentPlaca}, RAM ${currentRam}, Disco ${currentStorage}
A: CPU ${targetCpu}, GPU ${targetGpu}, Placa ${targetPlaca}, RAM ${targetRam}, Disco ${targetStorage}
Mejora general estimada: +${lift}% (Consumo: ${scores?.powerRequirementWatts || 400}W)

REGLAS CRÍTICAS DE RESPUESTA:
- Responde de forma ultra puntual, resumida y directa (máximo 60 palabras totales). Sin introducciones ni saludos.
- Estructura únicamente con estas 4 viñetas ultra cortas (1 frase directa cada una de máximo 10 palabras):
  * 🚀 **Rendimiento:** (frase rápida del upgrade)
  * ⚠️ **Mermas:** (cuello de botella o desequilibrio)
  * 🔌 **Fuente:** (watts mínimos sugeridos)
  * ⚙️ **Tip:** (consejo preciso)
- Jamás menciones "Gemini", "API", "modelo" o "IA".`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const report = response.text || "No se pudo generar el reporte AI en este momento.";
    return res.json({ report });
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    return res.status(500).json({ error: "Fallo al generar el reporte del Upgrade con AI. Inténtalo de nuevo." });
  }
});

// Optional standalone listener if run directly (useful for local development)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const app = express();
  app.use(express.json());
  app.use("/api", router);
  const BACK_PORT = process.env.BACKEND_PORT || 4000;
  app.listen(Number(BACK_PORT), "0.0.0.0", () => {
    console.log(`Backend server running on port ${BACK_PORT}`);
  });
}
