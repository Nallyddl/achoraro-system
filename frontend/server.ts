import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Known benchmarks (PassMark database fallback) for Scraper Simulator
const CPU_BENCHMARKS: { [key: string]: { score: number; details: string; tdp: string } } = {
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

const GPU_BENCHMARKS: { [key: string]: { score: number; details: string; tdp: string; vram: string } } = {
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

// 1. PassMark Scraper API Simulator
app.get("/api/simulator/passmark", (req, res) => {
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
app.post("/api/simulator/calculate", (req, res) => {
  const { currentCpu, currentGpu, targetCpu, targetGpu, ramSizeGb } = req.body;

  // Retrieve scores
  const cCpuMatch = CPU_BENCHMARKS[currentCpu] || { score: 15000 };
  const cGpuMatch = GPU_BENCHMARKS[currentGpu] || { score: 12000 };
  const tCpuMatch = CPU_BENCHMARKS[targetCpu] || { score: 30000 };
  const tGpuMatch = GPU_BENCHMARKS[targetGpu] || { score: 25000 };

  const cCpuScore = cCpuMatch.score;
  const cGpuScore = cGpuMatch.score;
  const tCpuScore = tCpuMatch.score;
  const tGpuScore = tGpuMatch.score;

  // FPS formulas based on CPU/GPU Marks
  // Fortnite, Valorant, Cyberpunk 2077
  const calculateFps = (cpuScore: number, gpuScore: number, factor: number) => {
    // Basic projection formula
    const rawFpsLow = (cpuScore * 0.003) + (gpuScore * 0.005) * factor;
    const rawFpsUltra = (cpuScore * 0.001) + (gpuScore * 0.003) * factor * 0.6;
    return {
      low: Math.round(Math.max(45, Math.min(360, rawFpsLow))),
      ultra: Math.round(Math.max(15, Math.min(240, rawFpsUltra)))
    };
  };

  const currentFps = {
    "Fortnite Battle Royale": calculateFps(cCpuScore, cGpuScore, 1.2),
    "Valorant": calculateFps(cCpuScore, cGpuScore, 1.6), // Highly CPU bound
    "Cyberpunk 2077": calculateFps(cCpuScore, cGpuScore, 0.75), // Extremely GPU bound
    "Call of Duty: Warzone": calculateFps(cCpuScore, cGpuScore, 1.0)
  };

  const targetFps = {
    "Fortnite Battle Royale": calculateFps(tCpuScore, tGpuScore, 1.2),
    "Valorant": calculateFps(tCpuScore, tGpuScore, 1.6),
    "Cyberpunk 2077": calculateFps(tCpuScore, tGpuScore, 0.75),
    "Call of Duty: Warzone": calculateFps(tCpuScore, tGpuScore, 1.0)
  };

  // Bottleneck & Lift
  const currentTotal = cCpuScore + cGpuScore;
  const targetTotal = tCpuScore + tGpuScore;
  const liftPercentage = Math.round(((targetTotal - currentTotal) / currentTotal) * 100);

  // Simple Offline Bottleneck logic
  let bottleneck = "Configuración balanceada.";
  if (cCpuScore / cGpuScore > 1.8) {
    bottleneck = "Cuello de botella en Gráficos (GPU Bottleneck). Tu procesador es excelente pero la GPU limita los FPS en juegos exigentes.";
  } else if (cGpuScore / cCpuScore > 1.8) {
    bottleneck = "Cuello de botella en Procesador (CPU Bottleneck). Tu tarjeta gráfica no alcanzará su máximo potencial por las limitaciones del procesador.";
  }

  // TDP calculations
  const extractTdpNum = (tdpStr: string) => parseInt(tdpStr?.replace(/\D/g, "") || "150");
  const estimatedPowerUsage = extractTdpNum((tCpuMatch as any).tdp || "100W") + extractTdpNum((tGpuMatch as any).tdp || "200W") + 100; // +100 for other components

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

// 3. Offline Performance Report (without Gemini)
app.post("/api/simulator/ai-report", async (req, res) => {
  const { currentCpu, currentGpu, targetCpu, targetGpu, scores, lift } = req.body;

  // Deterministic Offline recommendation
  const report = `### Reporte de Desempeño y Bottleneck

Has simulado la transición de un sistema con **${currentCpu}** y **${currentGpu}** hacia una configuración repotenciada con **${targetCpu}** y **${targetGpu}**.

1. **Aumento Estimado de Desempeño:** Aproximadamente un **${lift}%** más rápido en benchmarks sintéticos de PassMark.
2. **Análisis de Balance (Cuello de Botella):**
   - El procesador ${targetCpu} (Score PassMark: ${scores.targetCpuScore}) se acopla bien con la tarjeta ${targetGpu} (Score PassMark: ${scores.targetGpuScore}).
   - El consumo de energía estimado para el nuevo hardware es de unos **${scores.powerRequirementWatts} Watts**. Se recomienda una fuente certificada 80 Plus de mínimo **${Math.ceil((scores.powerRequirementWatts + 150) / 50) * 50}W**.
3. **Recomendación Profesional:**
   - Si migras a un setup moderno, procura usar memorias DDR5 de alta frecuencia (e.g. 6000MHz CL30) si tu nueva placa madre lo requiere.
   - En títulos de eSports como *Valorant*, disfrutarás de tasas de actualización de 240Hz+ sin interrupciones.`;

  return res.json({ report });
});

// Configure Vite middleware or static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully at http://localhost:${PORT}`);
  });
}

startServer();