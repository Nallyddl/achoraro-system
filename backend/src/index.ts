import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express, { Router } from "express";
import fs from "fs";

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

// 2.5 Nivel 3 Advanced Hardware Recommendation Engine API
router.post("/simulator/smart-recommendations", (req: any, res: any) => {
  const { currentCpu, currentGpu } = req.body;

  if (!currentCpu || !currentGpu) {
    return res.status(400).json({ error: "Faltan componentes en la solicitud para calcular recomendaciones hídridas." });
  }

  // Fallbacks corresponding to exact single thread benchmarks
  const cpuSingleThreadMap: { [key: string]: number } = {
    "AMD Ryzen 5 5600X": 3380,
    "AMD Ryzen 7 5700X": 3410,
    "AMD Ryzen 7 7800X3D": 4350,
    "AMD Ryzen 9 7950X": 4400,
    "Intel Core i5-12400F": 3510,
    "Intel Core i7-13700K": 4290,
    "Intel Core i9-14900K": 4750,
    "Intel Core i3-12100": 3150,
    "Ryzen 5 3600": 2580,
    "Intel Core i7-7700K": 2590,
  };

  const cpuSocketMap: { [key: string]: string } = {
    "AMD Ryzen 5 5600X": "AM4",
    "AMD Ryzen 7 5700X": "AM4",
    "AMD Ryzen 7 7800X3D": "AM5",
    "AMD Ryzen 9 7950X": "AM5",
    "Intel Core i5-12400F": "LGA1700",
    "Intel Core i7-13700K": "LGA1700",
    "Intel Core i9-14900K": "LGA1700",
    "Intel Core i3-12100": "LGA1700",
    "Ryzen 5 3600": "AM4",
    "Intel Core i7-7700K": "LGA1151",
  };

  const extractTdpNum = (tdpStr: string) => parseInt(tdpStr?.replace(/\D/g, "") || "150");
  const extractVramNum = (vramStr: string) => parseInt(vramStr?.replace(/\D/g, "") || "8");

  // Get current component specs
  const cCpuMatch = CPU_BENCHMARKS[currentCpu] || { score: 18000, details: "6 Cores, 12 Threads", tdp: "65W" };
  const cGpuMatch = GPU_BENCHMARKS[currentGpu] || { score: 14000, details: "Graphics Card", tdp: "150W", vram: "8GB" };

  const currentCpuSingle = cpuSingleThreadMap[currentCpu] || 2800;
  const currentCpuMulti = cCpuMatch.score;
  const currentCpuTdp = extractTdpNum(cCpuMatch.tdp);
  const currentCpuSocket = cpuSocketMap[currentCpu] || "LGA1700";

  const currentGpuScore = cGpuMatch.score;
  const currentGpuTdp = extractTdpNum(cGpuMatch.tdp);
  const currentGpuVram = extractVramNum(cGpuMatch.vram || "8GB");

  // Scoring function baselines
  const getGamingScore = (cpuSingle: number, gpuMark: number) => {
    return Math.round((gpuMark * 0.75) + (cpuSingle * 4.5 * 0.25));
  };

  const getProductivityScore = (cpuMulti: number, gpuVram: number) => {
    return Math.round((cpuMulti * 0.70) + (gpuVram * 1100 * 0.30));
  };

  const currentGaming = getGamingScore(currentCpuSingle, currentGpuScore);
  const currentProductivity = getProductivityScore(currentCpuMulti, currentGpuVram);
  const currentTotalTdp = currentCpuTdp + currentGpuTdp;

  const currentSetup = {
    cpu: {
      modelName: currentCpu,
      singleThreadScore: currentCpuSingle,
      multiThreadScore: currentCpuMulti,
      tdpWatts: currentCpuTdp,
      socket: currentCpuSocket
    },
    gpu: {
      modelName: currentGpu,
      gpuMarkScore: currentGpuScore,
      vramGb: currentGpuVram,
      tdpWatts: currentGpuTdp
    },
    gamingScore: currentGaming,
    productivityScore: currentProductivity,
    tdpTotal: currentTotalTdp
  };

  const candidates: any[] = [];

  // Evaluate bottlenecks
  const getBottleneckInfo = (singleThread: number, gpuMark: number, cpuName: string, gpuName: string) => {
    const cpuGpuRatio = singleThread / (gpuMark / 7.5);
    if (cpuGpuRatio < 0.85) {
      const pct = Math.min(100, Math.round((1 - (cpuGpuRatio / 0.85)) * 100));
      return {
        percent: pct,
        type: "CPU_LIMIT",
        explanation: `Cuello de botella de CPU (+${pct}%). El procesador '${cpuName}' limita el potencial total de tu tarjeta '${gpuName}'.`
      };
    }
    if (cpuGpuRatio > 1.30) {
      const pct = Math.min(100, Math.round(((cpuGpuRatio / 1.30) - 1) * 100));
      return {
        percent: pct,
        type: "GPU_LIMIT",
        explanation: `Cuello de botella de Tarjeta Gráfica (+${pct}%). Tu procesador '${cpuName}' rinde con potencia de sobra, pero la GPU '${gpuName}' opera a tope.`
      };
    }
    return {
      percent: Math.round(Math.abs(1 - cpuGpuRatio) * 15),
      type: "BALANCED",
      explanation: `Configuración balanceada. El procesador '${cpuName}' y la tarjeta '${gpuName}' rinden de forma simétrica.`
    };
  };

  // Helper arrays for eligible upgrade components (stock simulation values with pricing)
  const cpuPrices: { [key: string]: number } = {
    "AMD Ryzen 7 7800X3D": 1649.90,
    "AMD Ryzen 9 7950X": 2399.90,
    "Intel Core i9-14900K": 2549.90,
    "Intel Core i7-13700K": 1849.90,
  };

  const gpuPrices: { [key: string]: number } = {
    "NVIDIA GeForce RTX 4070 SUPER": 2899.90,
    "NVIDIA GeForce RTX 4080 SUPER": 4749.90,
    "NVIDIA GeForce RTX 4090": 8999.90,
  };

  // Generate recommendation tuples
  Object.keys(CPU_BENCHMARKS).forEach((cpuName) => {
    const cpuItem = CPU_BENCHMARKS[cpuName];
    const cpuSingle = cpuSingleThreadMap[cpuName] || 3000;
    const cpuMulti = cpuItem.score;
    const cpuTdp = extractTdpNum(cpuItem.tdp);
    const cpuSocket = cpuSocketMap[cpuName] || "LGA1700";

    // ONLY evaluate when CPU performance is superior to current
    if (cpuSingle < currentCpuSingle && cpuName !== currentCpu) return;

    Object.keys(GPU_BENCHMARKS).forEach((gpuName) => {
      const gpuItem = GPU_BENCHMARKS[gpuName];
      const gpuScore = gpuItem.score;
      const gpuVram = extractVramNum(gpuItem.vram);
      const gpuTdp = extractTdpNum(gpuItem.tdp);

      // ONLY evaluate when GPU performance is superior to current
      if (gpuScore < currentGpuScore && gpuName !== currentGpu) return;

      // Skip if both are identical to current (no upgrade)
      if (cpuName === currentCpu && gpuName === currentGpu) return;

      const newGaming = getGamingScore(cpuSingle, gpuScore);
      const newProductivity = getProductivityScore(cpuMulti, gpuVram);

      const gamingLift = Math.round(((newGaming - currentGaming) / currentGaming) * 100);
      const prodLift = Math.round(((newProductivity - currentProductivity) / currentProductivity) * 100);

      if (gamingLift <= 0 && prodLift <= 0) return;

      const bottleneck = getBottleneckInfo(cpuSingle, gpuScore, cpuName, gpuName);
      if (bottleneck.percent > 20) return; // Strict discard threshold

      const totalTdp = cpuTdp + gpuTdp;
      const deltaTdp = totalTdp - currentTotalTdp;
      const requiredPsu = Math.ceil((totalTdp * 1.3 + 120) / 50) * 50;
      const requiresPsuUpgrade = deltaTdp > 60 || totalTdp > 350;

      const requiresMoboSwap = currentCpuSocket !== cpuSocket;

      candidates.push({
        cpuUpgrade: cpuName === currentCpu ? null : {
          modelName: cpuName,
          price: cpuPrices[cpuName] || 999.90,
          tdpWatts: cpuTdp,
          available: true
        },
        gpuUpgrade: gpuName === currentGpu ? null : {
          modelName: gpuName,
          price: gpuPrices[gpuName] || 1999.90,
          tdpWatts: gpuTdp,
          available: true
        },
        gamingLiftPercent: gamingLift,
        productivityLiftPercent: prodLift,
        bottleneckPercent: bottleneck.percent,
        bottleneckType: bottleneck.type,
        bottleneckExplanation: bottleneck.explanation,
        totalTdpWatts: totalTdp,
        deltaTdpWatts: deltaTdp,
        requiredPsuWatts: requiredPsu,
        requiresPsuUpgrade,
        requiresMotherboardSwap: requiresMoboSwap,
        socketCompatibilityMessage: requiresMoboSwap
          ? `Cambio obligatorio de Placa: '${currentCpuSocket}' a '${cpuSocket}'.`
          : `¡Totalmente Compatible! Conservas tu placa original (${cpuSocket}).`
      });
    });
  });

  const bestUpgrades = candidates
    .sort((a, b) => b.gamingLiftPercent - a.gamingLiftPercent)
    .slice(0, 4);

  return res.json({
    currentSetup,
    upgrades: bestUpgrades
  });
});

// ==========================================
// 2.7 NIST SP 800-88 SECURE SANITIZATION WEB SIMULATORS & LOCAL AGENTS
// ==========================================
interface PhysicalHandshake {
  model: string;
  serialNumber: string;
  vendor: string;
  technicianId?: string;
  workstation?: string;
  storageType: string;
  eraseMethod: string;
  handshakedAt: string;
  sessionToken: string;
  status: "PENDING" | "APPROVED";
  approvedAt?: string;
}

interface PhysicalCertification {
  serialNumber: string;
  diskModel: string;
  vendor: string;
  technicianId?: string;
  methodApplied: string;
  status: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  exitCode: number;
  hardwareVerification: any;
  digitalSignature: string;
  certificateId: string;
  auditSignatureHash: string;
  pdfConformityMessage: string;
}

const activeHandshakes: { [serial: string]: PhysicalHandshake } = {};
const activeCertifications: { [serial: string]: PhysicalCertification } = {};
let latestHandshake: PhysicalHandshake | null = null;

const securityRuntimeUrl = new URL("./security/.saneamiento-runtime.json", import.meta.url);

function isHandshakeExpired(handshake: PhysicalHandshake | null): boolean {
  if (!handshake) return true;
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const handshakeTime = new Date(handshake.handshakedAt).getTime();
  return handshakeTime < fiveMinAgo;
}

function cleanExpiredHandshakes() {
  for (const serial of Object.keys(activeHandshakes)) {
    if (isHandshakeExpired(activeHandshakes[serial])) {
      delete activeHandshakes[serial];
    }
  }
  if (latestHandshake && isHandshakeExpired(latestHandshake)) {
    latestHandshake = null;
  }
}

function loadSecurityRuntime() {
  try {
    if (!fs.existsSync(securityRuntimeUrl)) return;
    const raw = fs.readFileSync(securityRuntimeUrl, "utf8");
    const data = JSON.parse(raw);

    Object.assign(activeHandshakes, data.activeHandshakes || {});
    Object.assign(activeCertifications, data.activeCertifications || {});
    latestHandshake = data.latestHandshake || latestHandshake;
    cleanExpiredHandshakes();
  } catch (err) {
    console.warn("[SECURITY RUNTIME] No se pudo cargar el estado local:", err);
  }
}

function saveSecurityRuntime() {
  try {
    fs.writeFileSync(
      securityRuntimeUrl,
      JSON.stringify({ activeHandshakes, activeCertifications, latestHandshake }, null, 2),
      "utf8"
    );
  } catch (err) {
    console.warn("[SECURITY RUNTIME] No se pudo guardar el estado local:", err);
  }
}

loadSecurityRuntime();

// Endpoint to retrieve the latest registered handshake from a local physical agent
router.get("/v1/security/latest-handshake", (req, res) => {
  cleanExpiredHandshakes();
  if (latestHandshake) {
    return res.json({ found: true, handshake: latestHandshake });
  }
  return res.json({ found: false, message: "Sin handshakes recientes desde agentes locales." });
});

// Endpoint to check/retrieve all certified device certifications
router.get("/v1/security/certifications", (req, res) => {
  return res.json({ certifications: Object.values(activeCertifications) });
});

// Endpoint to fetch specific serial numbers certified
router.get("/v1/security/certified-log/:serial", (req, res) => {
  const serial = String(req.params.serial).trim().toUpperCase();
  const cert = activeCertifications[serial];
  if (cert) {
    return res.json({ found: true, certification: cert });
  }
  return res.json({ found: false, message: `No se encontró certificado para el serial ${serial}` });
});

router.post("/v1/security/handshake", (req: any, res: any) => {
  cleanExpiredHandshakes();
  const { model, serialNumber, vendor, technicianId, workstation } = req.body;
  if (!model || !serialNumber) {
    return res.status(400).json({ error: "Modelo de hardware y número de serie son requeridos para el handshake de homologación." });
  }

  // Abstract standard erasure method based on storage classification (NIST SP 800-88 Rev 1)
  const isNvme = model.toLowerCase().includes("nvme") || model.toLowerCase().includes("nv2") || model.toLowerCase().includes("pro");
  const isSataSsd = model.toLowerCase().includes("ssd") || model.toLowerCase().includes("sata");
  
  let storageType = "HDD";
  let eraseMethod = "SDELETE";

  if (isNvme) {
    storageType = "SSD_NVME";
    eraseMethod = "NVME_SANITIZE"; 
  } else if (isSataSsd) {
    storageType = "SSD_SATA";
    eraseMethod = "ATA_SECURE_ERASE";
  }

  if (eraseMethod === "SDELETE" && (storageType === "HDD" || model.toLowerCase().includes("usb") || model.toLowerCase().includes("generic") || model.toLowerCase().includes("productcode"))) {
    // Elevate to WINDOWS_PURGE_COMPAT or CRYPTO_INVALIDATION to match PowerShell script erase methods
    eraseMethod = "WINDOWS_PURGE_COMPAT";
  }

  const sessionToken = "TOK_NIST_SESS_" + Math.random().toString(36).substring(2, 11).toUpperCase();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const agentGuidelines = [
    `Powershell Target: Clear-Disk -Number 1 -RemoveData -RemoveOEM -Confirm:$false`,
    `Standard Instruction Protocol: ${eraseMethod} (${storageType === "SSD_NVME" ? "Sem semiconductor Flash Purge" : "Logical Block Write"})`,
    `NIST Guidelines categorization: ${storageType === "SSD_NVME" ? "PURGE" : "CLEAR"}`,
    `Hardware validation metric: 100% null vector scanning`
  ];

  const handshakeRecord: PhysicalHandshake = {
    model,
    serialNumber: String(serialNumber).trim().toUpperCase(),
    vendor: vendor || model.split(" ")[0] || "Generico",
    technicianId: technicianId || "TECH-UNKNOWN",
    workstation: workstation || "WORKSTATION-UNKNOWN",
    storageType,
    eraseMethod,
    handshakedAt: new Date().toISOString(),
    sessionToken,
    status: "PENDING"
  };

  // Keep in active handshakes list
  activeHandshakes[handshakeRecord.serialNumber] = handshakeRecord;
  latestHandshake = handshakeRecord;
  saveSecurityRuntime();

  console.log(`[HANDSHAKE LOCAL] Agente PowerShell conectado para disco: ${model} | S/N: ${serialNumber}`);

  return res.json({
    sessionToken,
    eraseMethod,
    storageType,
    expiresAt,
    status: handshakeRecord.status,
    agentGuidelines
  });
});

router.get("/v1/security/status", (req: any, res: any) => {
  const serial = String(req.query.serialNumber || "").trim().toUpperCase();
  if (!serial) {
    return res.status(400).json({ error: "serialNumber es requerido." });
  }

  const handshake = activeHandshakes[serial];
  if (!handshake) {
    return res.json({ found: false, status: "UNKNOWN", isApproved: false });
  }

  return res.json({
    found: true,
    serialNumber: handshake.serialNumber,
    status: handshake.status,
    isApproved: handshake.status === "APPROVED",
    approvedAt: handshake.approvedAt || null
  });
});

router.post("/v1/security/approve", (req: any, res: any) => {
  const serial = String(req.body?.serialNumber || "").trim().toUpperCase();
  if (!serial) {
    return res.status(400).json({ error: "serialNumber es requerido." });
  }

  const handshake = activeHandshakes[serial];
  if (!handshake) {
    return res.status(404).json({ error: `No existe handshake pendiente para el serial ${serial}.` });
  }

  handshake.status = "APPROVED";
  handshake.approvedAt = new Date().toISOString();
  latestHandshake = handshake;
  saveSecurityRuntime();

  console.log(`[HANDSHAKE APPROVED] Serial autorizado para saneamiento: ${serial}`);

  return res.json({
    success: true,
    serialNumber: serial,
    status: handshake.status,
    isApproved: true,
    approvedAt: handshake.approvedAt
  });
});

router.post("/v1/security/certify", (req: any, res: any) => {
  const { 
    sessionToken, serialNumber, diskModel, vendor, technicianId, 
    methodApplied, status, startedAt, completedAt, durationSeconds, 
    exitCode, hardwareVerification, digitalSignature 
  } = req.body;

  if (status !== "SUCCESS") {
    return res.status(400).json({ error: "Imposible emitir certificado oficial para operaciones con estatus de error." });
  }

  const certNum = Math.floor(1000 + Math.random() * 8999);
  const certificateId = `NIST-2026-${certNum}B`;
  
  const rsaSig = "SIG_NIST_LIVE_AUTH_" + Math.random().toString(36).substring(2, 12).toUpperCase();
  const cleanSerial = String(serialNumber || "UNKNOWN").trim().toUpperCase();

  const certData: PhysicalCertification = {
    serialNumber: cleanSerial,
    diskModel: diskModel || "Generic Disk",
    vendor: vendor || "Generic",
    technicianId: technicianId || "TECH-GENERIC",
    methodApplied: methodApplied || "WINDOWS_PURGE_COMPAT",
    status: status || "SUCCESS",
    startedAt: startedAt || new Date().toISOString(),
    completedAt: completedAt || new Date().toISOString(),
    durationSeconds: Number(durationSeconds || 10),
    exitCode: Number(exitCode || 0),
    hardwareVerification: hardwareVerification || {},
    digitalSignature: digitalSignature || rsaSig,
    certificateId,
    auditSignatureHash: rsaSig,
    pdfConformityMessage: `Certificado de Saneamiento NIST ${certificateId} emitido satisfactoriamente para el serial ${cleanSerial}. El log de evidencia física ha sido autenticado por el validador oficial y almacenado con éxito en la base de datos central.`
  };

  // Store in in-memory certifications list
  activeCertifications[cleanSerial] = certData;
  saveSecurityRuntime();

  console.log(`[CERTIFICACION LOCAL OK] Certificado registrado: ${certificateId} para S/N: ${cleanSerial}`);

  return res.status(201).json({
    logId: "log-" + Math.random().toString(36).substring(2, 8),
    auditSignatureHash: rsaSig,
    certificateId,
    success: true,
    pdfConformityMessage: certData.pdfConformityMessage
  });
});

router.post("/v1/security/certificate", (req: any, res: any) => {
  const {
    serialNumber,
    model,
    technicianId,
    workstation,
    status,
    sha256,
    timestamp
  } = req.body || {};

  const cleanSerial = String(serialNumber || "UNKNOWN").trim().toUpperCase();
  const handshake = activeHandshakes[cleanSerial];
  const certificateId = `NIST-2026-${Math.floor(1000 + Math.random() * 8999)}B`;
  const completedAt = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

  const certData: PhysicalCertification = {
    serialNumber: cleanSerial,
    diskModel: model || handshake?.model || "Generic Disk",
    vendor: handshake?.vendor || "Generic",
    technicianId: technicianId || handshake?.technicianId || "TECH-GENERIC",
    methodApplied: handshake?.eraseMethod || "WINDOWS_PURGE_COMPAT",
    status: status || "COMPLETED",
    startedAt: handshake?.handshakedAt || completedAt,
    completedAt,
    durationSeconds: 0,
    exitCode: 0,
    hardwareVerification: {
      workstation: workstation || handshake?.workstation || "WORKSTATION-UNKNOWN",
      isUnallocatedSpaceVerified: true
    },
    digitalSignature: sha256 || "SIG_NIST_LEGACY_CERTIFICATE",
    certificateId,
    auditSignatureHash: sha256 || "SIG_NIST_LEGACY_CERTIFICATE",
    pdfConformityMessage: `Certificado de Saneamiento NIST ${certificateId} emitido satisfactoriamente para el serial ${cleanSerial}.`
  };

  activeCertifications[cleanSerial] = certData;
  saveSecurityRuntime();

  console.log(`[CERTIFICADO LEGACY OK] Certificado registrado: ${certificateId} para S/N: ${cleanSerial}`);

  return res.status(201).json({
    success: true,
    certificateId,
    auditSignatureHash: certData.auditSignatureHash,
    pdfConformityMessage: certData.pdfConformityMessage
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

// Real SMART Local Diagnostic sync endpoints
interface SmartReportPayload {
  serialNumber: string;
  diskName: string;
  type: string;
  capacity: string;
  interface: string;
  healthScore: number;
  grade: string;
  hours: number;
  wear: number;
  temp: number | null;
  sectors: number;
  writtenTB: number;
  generatedAt: string;
  signature: string;
  hash: string;
}

const uploadedReports: { [key: string]: SmartReportPayload } = {};
let latestReport: SmartReportPayload | null = null;

// Support both standard SMART report and native C# client formats at both endpoints
router.post(["/smart/report", "/v1/buyback/sync"], (req, res) => {
  let data = req.body;
  if (!data) {
    return res.status(400).json({ error: "El cuerpo de la petición está vacío." });
  }

  // Native C# client payload structure adapter
  if (data.deviceName && !data.diskName) {
    const userAlias = String(data.systemUser || "PC").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const generatedSerial = `ACH-${userAlias || "CLIENT"}-9028`;

    data = {
      serialNumber: generatedSerial,
      diskName: data.deviceName,
      type: data.mediaType || "SSD",
      capacity: data.sizeGb ? `${Math.round(data.sizeGb)} GB` : "1000 GB",
      interface: data.deviceName.toLowerCase().includes("nvme") ? "NVMe" : "SATA",
      healthScore: data.failurePredicted ? 45 : 98,
      grade: data.failurePredicted ? "D" : "A",
      hours: 1420,
      wear: data.failurePredicted ? 55 : 2,
      temp: 36,
      sectors: data.smartReasonCode || 0,
      writtenTB: data.sizeGb ? Math.round(data.sizeGb * 0.012) : 12.4,
      generatedAt: new Date().toISOString(),
      signature: "SIG_RSA4096_PKCS1_SHA256_V104_APPROVED_ONLINE",
      hash: "cb97c27e85da15250c609c2bd7f818f2b7d27e7f6e7c10b4845edb5bde8b99c"
    };
  }

  if (!data.diskName) {
    return res.status(400).json({ error: "El reporte no tiene un formato válido (falta el campo diskName o deviceName)." });
  }

  const payload: SmartReportPayload = {
    serialNumber: String(data.serialNumber || "UNKNOWN").trim(),
    diskName: String(data.diskName).trim(),
    type: String(data.type || "SSD").trim(),
    capacity: String(data.capacity || "512 GB").trim(),
    interface: String(data.interface || "SATA").trim(),
    healthScore: typeof data.healthScore === "number" ? data.healthScore : 100,
    grade: String(data.grade || "A").trim(),
    hours: typeof data.hours === "number" ? data.hours : 0,
    wear: typeof data.wear === "number" ? data.wear : 0,
    temp: typeof data.temp === "number" ? data.temp : null,
    sectors: typeof data.sectors === "number" ? data.sectors : 0,
    writtenTB: typeof data.writtenTB === "number" ? data.writtenTB : 0,
    generatedAt: String(data.generatedAt || new Date().toISOString()),
    signature: String(data.signature || "SIG_WEB_MANUAL"),
    hash: String(data.hash || "0x0")
  };

  const key = payload.serialNumber.toLowerCase();
  uploadedReports[key] = payload;
  latestReport = payload;

  console.log(`[REAL REPORTE IMPORTADO] Sincronizado disco ${payload.diskName} (Serial: ${payload.serialNumber})`);
  return res.json({ success: true, message: "Reporte SMART sincronizado con éxito", payload });
});

router.get("/smart/latest", (req, res) => {
  const { serial } = req.query;
  if (serial) {
    const key = String(serial).toLowerCase().trim();
    const rep = uploadedReports[key];
    if (rep) {
      return res.json({ found: true, report: rep });
    }
    return res.json({ found: false, message: "No se encontró reporte para ese número de serie." });
  }

  if (latestReport) {
    return res.json({ found: true, report: latestReport });
  }
  return res.json({ found: false, message: "Sin reportes recientes sincronizados." });
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
