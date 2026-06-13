import { Injectable, NotFoundException } from "@nestjs/common";
import {
    CurrentSetupDto,
    HardwareRecommendationResponseDto,
    RecommendationUpgradeResultDto,
    UpgradeDetailDto
} from "./recommendations.dto";

/**
 * Custom Prisma Mock or Import Definition for clean architectural execution
 * In production, this imports the active Prisma dependency.
 */
class PrismaService {
  product: any = {};
  cpu: any = {};
  gpu: any = {};
}

@Injectable()
export class RecommendationService {
  // Injecting PrismaService or custom SQL driver
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Main service function: Receives current components and predicts optimal upgrades
   */
  async getSmartRecommendations(
    currentCpuId: string,
    currentGpuId: string
  ): Promise<HardwareRecommendationResponseDto> {
    
    // 1. Fetch current components with Shopify product connectivity
    const currentCpu = await this.findCpuByIdOrName(currentCpuId);
    const currentGpu = await this.findGpuByIdOrName(currentGpuId);

    if (!currentCpu) throw new NotFoundException(`CPU con identificador '${currentCpuId}' no fue encontrada.`);
    if (!currentGpu) throw new NotFoundException(`GPU con identificador '${currentGpuId}' no fue encontrada.`);

    // 2. Compute current performance baseline
    const currentGaming = this.calculateGamingBaseline(currentCpu.singleThreadScore, currentGpu.gpuMarkScore);
    const currentProductivity = this.calculateProductivityBaseline(currentCpu.multiThreadScore, currentGpu.vramGb);
    const currentTdp = currentCpu.tdpWatts + currentGpu.tdpWatts;

    const currentSetup: CurrentSetupDto = {
      cpu: {
        id: currentCpu.id,
        modelName: currentCpu.modelName,
        singleThreadScore: currentCpu.singleThreadScore,
        multiThreadScore: currentCpu.multiThreadScore,
        tdpWatts: currentCpu.tdpWatts,
        socket: currentCpu.socket,
      },
      gpu: {
        id: currentGpu.id,
        modelName: currentGpu.modelName,
        gpuMarkScore: currentGpu.gpuMarkScore,
        vramGb: currentGpu.vramGb,
        tdpWatts: currentGpu.tdpWatts,
      },
      gamingScore: currentGaming,
      productivityScore: currentProductivity,
      tdpTotal: currentTdp,
    };

    // 3. OPTIMIZED PRISMA QUERY (Stock & Performance focused)
    // Fetch higher performance components that are currently in stock
    const dbCpuUpgrades = await this.fetchAvailableCpuUpgradesFromDb(currentCpu.singleThreadScore);
    const dbGpuUpgrades = await this.fetchAvailableGpuUpgradesFromDb(currentGpu.gpuMarkScore);

    const candidates: RecommendationUpgradeResultDto[] = [];

    // 4. GENERATE CRUCIAL COMPONENT COMBINATION STRATEGIES
    // Option Strategy A: Upgrade GPU, Keep CPU
    for (const gpu of dbGpuUpgrades) {
      const upgrade = this.evaluateCombination(currentCpu, gpu, currentSetup);
      if (upgrade) candidates.push(upgrade);
    }

    // Option Strategy B: Upgrade CPU, Keep GPU
    for (const cpu of dbCpuUpgrades) {
      const upgrade = this.evaluateCombination(cpu, currentGpu, currentSetup);
      if (upgrade) candidates.push(upgrade);
    }

    // Option Strategy C: Upgrade BOTH Components (Maximum Potential)
    for (const cpu of dbCpuUpgrades) {
      for (const gpu of dbGpuUpgrades) {
        const upgrade = this.evaluateCombination(cpu, gpu, currentSetup);
        if (upgrade) candidates.push(upgrade);
      }
    }

    // 5. SORT BY MAXIMIZED PERFORMANCE LIFT & LIMIT TO TOP 5 UPGRADES
    const bestUpgrades = candidates
      .sort((a, b) => b.gamingLiftPercent - a.gamingLiftPercent)
      .slice(0, 5);

    return {
      currentSetup,
      upgrades: bestUpgrades,
    };
  }

  /**
   * Core Matrix Evaluation for a given component combination
   */
  private evaluateCombination(
    cpuCandidate: any,
    gpuCandidate: any,
    currentSetup: CurrentSetupDto
  ): RecommendationUpgradeResultDto | null {
    // A. Calculations of scores for candidate combination
    const newGaming = this.calculateGamingBaseline(cpuCandidate.singleThreadScore, gpuCandidate.gpuMarkScore);
    const newProductivity = this.calculateProductivityBaseline(cpuCandidate.multiThreadScore, gpuCandidate.vramGb);

    // Gaming Lift Percent (+X% FPS estimation)
    const gamingLiftPercent = Math.round(((newGaming - currentSetup.gamingScore) / currentSetup.gamingScore) * 100);
    // Productivity Lift Percent
    const productivityLiftPercent = Math.round(((newProductivity - currentSetup.productivityScore) / currentSetup.productivityScore) * 100);

    // If there is no real performance gain, skip this combination
    if (gamingLiftPercent <= 0 && productivityLiftPercent <= 0) {
      return null;
    }

    // B. Call Predictive Bottleneck Calculations
    const bottleneckInfo = this.calculateBottleneckMetrics(
      cpuCandidate.singleThreadScore,
      gpuCandidate.gpuMarkScore,
      cpuCandidate.modelName,
      gpuCandidate.modelName
    );

    // Strictly discard options with a bottleneck higher than 20% to avoid poor builds
    if (bottleneckInfo.percent > 20) {
      return null;
    }

    // C. Energy & PSU metrics
    const newCpuTdp = cpuCandidate.tdpWatts;
    const newGpuTdp = gpuCandidate.tdpWatts;
    const totalTdpWatts = newCpuTdp + newGpuTdp;
    const deltaTdpWatts = totalTdpWatts - currentSetup.tdpTotal;

    // Power supply scale: (System TDP * 1.3 buffer factor + 100W overhead) rounded up to a commercial size (e.g., 650W, 750W)
    const recommendedPsuWatts = Math.ceil((totalTdpWatts * 1.3 + 120) / 50) * 50;
    const requiresPsuUpgrade = deltaTdpWatts > 60 || totalTdpWatts > 350;

    // D. Motherboard compatibility (Socket alignment check)
    const requiresMotherboardSwap = currentSetup.cpu.socket !== cpuCandidate.socket;
    const socketCompatibilityMessage = requiresMotherboardSwap
      ? `Cambio obligatorio de Placa: Tu placa actual usa socket '${currentSetup.cpu.socket}', pero el procesador '${cpuCandidate.modelName}' exige '${cpuCandidate.socket}'.`
      : `¡Compatible al 100%! Ambos procesadores operan sobre la misma placa madre (${cpuCandidate.socket}).`;

    // E. Assemble candidate DTO format
    const cpuUpgrade: UpgradeDetailDto | null = cpuCandidate.id === currentSetup.cpu.id ? null : {
      id: cpuCandidate.id,
      modelName: cpuCandidate.modelName,
      price: Number(cpuCandidate.product.price),
      imageUrl: cpuCandidate.product.imageUrl,
      tdpWatts: cpuCandidate.tdpWatts,
      shopifyProductId: cpuCandidate.product.id,
      available: cpuCandidate.product.available && cpuCandidate.product.inventoryCount > 0,
      score: cpuCandidate.singleThreadScore,
    };

    const gpuUpgrade: UpgradeDetailDto | null = gpuCandidate.id === currentSetup.gpu.id ? null : {
      id: gpuCandidate.id,
      modelName: gpuCandidate.modelName,
      price: Number(gpuCandidate.product.price),
      imageUrl: gpuCandidate.product.imageUrl,
      tdpWatts: gpuCandidate.tdpWatts,
      shopifyProductId: gpuCandidate.product.id,
      available: gpuCandidate.product.available && gpuCandidate.product.inventoryCount > 0,
      score: gpuCandidate.gpuMarkScore,
    };

    return {
      cpuUpgrade,
      gpuUpgrade,
      gamingLiftPercent,
      productivityLiftPercent,
      bottleneckPercent: bottleneckInfo.percent,
      bottleneckType: bottleneckInfo.type,
      bottleneckExplanation: bottleneckInfo.explanation,
      totalTdpWatts,
      deltaTdpWatts,
      requiredPsuWatts: recommendedPsuWatts,
      requiresPsuUpgrade,
      requiresMotherboardSwap,
      socketCompatibilityMessage,
    };
  }

  // ==========================================
  // MATHEMATICAL AND ARCHITECTURAL FORMULAS
  // ==========================================

  /**
   * FORMULA: Gaming Performance Baseline Score
   * Gaming frame generation depends heavily on raw 3D GPU performance and Fast CPU single-thread dispatching.
   * Weight Distribution:
   *  - 75% GPU capability (the primary pixel-pusher)
   *  - 25% CPU dispatch speed (single-thread latency controller scaled to normalize index magnitude)
   */
  private calculateGamingBaseline(singleThreadScore: number, gpuMarkScore: number): number {
    const scaledCpu = singleThreadScore * 4.5; // Normalizes ~3,000pts CPU single-thread up to ~13,500
    return Math.round((gpuMarkScore * 0.75) + (scaledCpu * 0.25));
  }

  /**
   * FORMULA: Productivity / Rendering Performance Baseline Score
   * Heavy workloads require parallel core-processing power (CPU Multi-thread score) and large buffers (GPU VRAM).
   * Weight Distribution:
   *  - 70% CPU Multi-thread score
   *  - 30% GPU VRAM capacity scaled to normalized density points (e.g. 16GB * 1,100 = 17,600 pts)
   */
  private calculateProductivityBaseline(multiThreadScore: number, vramGb: number): number {
    const scaledVram = vramGb * 1100;
    return Math.round((multiThreadScore * 0.70) + (scaledVram * 0.30));
  }

  /**
   * FORMULA: Predictive Mismatch / Bottleneck Analysis
   * Compares normalized CPU dispatch rate against GPU raster capacity.
   * Sweet spot is 1.0 (perfect alignment).
   * Ratio calculation:
   *   Ratio = CPU_SingleThread / (GPU_Mark / 7.5)
   */
  private calculateBottleneckMetrics(
    singleThread: number,
    gpuMark: number,
    cpuModel: string,
    gpuModel: string
  ): { percent: number; type: "CPU_LIMIT" | "GPU_LIMIT" | "BALANCED"; explanation: string } {
    
    const cpuGpuRatio = singleThread / (gpuMark / 7.5);

    // CPU Bottleneck Case (CPU is too weak for the card - Ratio < 0.85)
    if (cpuGpuRatio < 0.85) {
      const percentageDiff = Math.min(100, Math.round((1 - (cpuGpuRatio / 0.85)) * 100));
      return {
        percent: percentageDiff,
        type: "CPU_LIMIT",
        explanation: `Cuello de botella de CPU (+${percentageDiff}%). El procesador '${cpuModel}' no puede procesar la cola de renderizado lo suficientemente rápido para la GPU '${gpuModel}', limitando tus fotogramas por segundo absolutos.`,
      };
    }

    // GPU Bottleneck Case (GPU is underpowered relative to CPU - Ratio > 1.30)
    if (cpuGpuRatio > 1.30) {
      const percentageDiff = Math.min(100, Math.round(((cpuGpuRatio / 1.30) - 1) * 100));
      return {
        percent: percentageDiff,
        type: "GPU_LIMIT",
        explanation: `Cuello de botella de Tarjeta Gráfica (+${percentageDiff}%). El procesador '${cpuModel}' tiene una capacidad extrema de sobra, pero la tarjeta de video '${gpuModel}' está operando a su límite absoluto (99% de carga constante).`,
      };
    }

    // Ideal Balanced Hardware Setup
    return {
      percent: Math.round(Math.abs(1 - cpuGpuRatio) * 15),
      type: "BALANCED",
      explanation: `Sin cuellos de botella significativos. El procesador '${cpuModel}' y la tarjeta '${gpuModel}' operan de manera simétrica, logrando un balance energético y operacional ideal.`,
    };
  }

  // ==========================================
  // OPTIMIZED DATABASE QUERY SIMULATORS (Prisma Equivalent)
  // ==========================================

  private async fetchAvailableCpuUpgradesFromDb(currentCpuSingleThread: number): Promise<any[]> {
    /**
     * OPTIMIZED PRISMA QUERY (Equivalent Code):
     * return this.prisma.cpu.findMany({
     *   where: {
     *     singleThreadScore: { gt: currentCpuSingleThread },
     *     product: {
     *       available: true,
     *       inventoryCount: { gt: 0 } // Real-time Stock optimization constraint!
     *     }
     *   },
     *   include: { product: true },
     *   orderBy: { singleThreadScore: 'asc' }
     * });
     */
    const cpuUpgradesMock = [
      {
        id: "cpu-ryzen77800x3d",
        modelName: "AMD Ryzen 7 7800X3D",
        singleThreadScore: 4350,
        multiThreadScore: 34300,
        tdpWatts: 120,
        socket: "AM5",
        cores: 8,
        threads: 16,
        product: { id: "p-cpu-1", title: "Procesador Ryzen 7 7800X3D", price: 1649.90, imageUrl: "https://www.achorao.com/cdn/shop/files/7800x3d.png", available: true, inventoryCount: 8 }
      },
      {
        id: "cpu-ryzen97950x",
        modelName: "AMD Ryzen 9 7950X",
        singleThreadScore: 4400,
        multiThreadScore: 63200,
        tdpWatts: 170,
        socket: "AM5",
        cores: 16,
        threads: 32,
        product: { id: "p-cpu-2", title: "Procesador AMD Ryzen 9 7950X", price: 2399.90, imageUrl: "https://www.achorao.com/cdn/shop/files/7950x.png", available: true, inventoryCount: 3 }
      },
      {
        id: "cpu-intel14900k",
        modelName: "Intel Core i9-14900K",
        singleThreadScore: 4750,
        multiThreadScore: 60800,
        tdpWatts: 125,
        socket: "LGA1700",
        cores: 24,
        threads: 32,
        product: { id: "p-cpu-3", title: "Procesador Intel i9 14900K", price: 2549.90, imageUrl: "https://www.achorao.com/cdn/shop/files/14900k.png", available: true, inventoryCount: 5 }
      }
    ];

    return cpuUpgradesMock.filter(c => c.singleThreadScore > currentCpuSingleThread);
  }

  private async fetchAvailableGpuUpgradesFromDb(currentGpuMark: number): Promise<any[]> {
    /**
     * OPTIMIZED PRISMA QUERY (Equivalent Code):
     * return this.prisma.gpu.findMany({
     *   where: {
     *     gpuMarkScore: { gt: currentGpuMark },
     *     product: {
     *       available: true,
     *       inventoryCount: { gt: 0 } // Real-time Stock optimization constraint!
     *     }
     *   },
     *   include: { product: true },
     *   orderBy: { gpuMarkScore: 'asc' }
     * });
     */
    const gpuUpgradesMock = [
      {
        id: "gpu-rtx4070super",
        modelName: "NVIDIA GeForce RTX 4070 SUPER",
        gpuMarkScore: 31800,
        vramGb: 12,
        tdpWatts: 220,
        architecture: "Ada Lovelace",
        product: { id: "p-gpu-1", title: "Tarjeta Gráfica ASUS RTX 4070 SUPER Dual", price: 2899.90, imageUrl: "https://www.achorao.com/cdn/shop/files/4070super.png", available: true, inventoryCount: 4 }
      },
      {
        id: "gpu-rtx4080super",
        modelName: "NVIDIA GeForce RTX 4080 SUPER",
        gpuMarkScore: 35400,
        vramGb: 16,
        tdpWatts: 320,
        architecture: "Ada Lovelace",
        product: { id: "p-gpu-2", title: "Tarjeta Gráfica MSI RTX 4080 SUPER Ventus", price: 4749.90, imageUrl: "https://www.achorao.com/cdn/shop/files/4080super.png", available: true, inventoryCount: 2 }
      },
      {
        id: "gpu-rtx4090",
        modelName: "NVIDIA GeForce RTX 4090",
        gpuMarkScore: 39200,
        vramGb: 24,
        tdpWatts: 450,
        architecture: "Ada Lovelace",
        product: { id: "p-gpu-3", title: "Tarjeta Gráfica ASUS ROG Strix RTX 4090 v2", price: 8999.90, imageUrl: "https://www.achorao.com/cdn/shop/files/4090.png", available: true, inventoryCount: 1 }
      }
    ];

    return gpuUpgradesMock.filter(g => g.gpuMarkScore > currentGpuMark);
  }

  private async findCpuByIdOrName(idOrName: string): Promise<any> {
    const cpus = [
      { id: "cpu-ryzen5600x", modelName: "AMD Ryzen 5 5600X", singleThreadScore: 3380, multiThreadScore: 21900, tdpWatts: 65, socket: "AM4" },
      { id: "cpu-ryzen3600", modelName: "Ryzen 5 3600", singleThreadScore: 2580, multiThreadScore: 17800, tdpWatts: 65, socket: "AM4" },
      { id: "cpu-intel12400f", modelName: "Intel Core i5-12400F", singleThreadScore: 3510, multiThreadScore: 19500, tdpWatts: 65, socket: "LGA1700" },
      { id: "cpu-intel7700k", modelName: "Intel Core i7-7700K", singleThreadScore: 2590, multiThreadScore: 9700, tdpWatts: 91, socket: "LGA1151" }
    ];
    return cpus.find(c => c.id === idOrName || c.modelName.toLowerCase().includes(idOrName.toLowerCase()));
  }

  private async findGpuByIdOrName(idOrName: string): Promise<any> {
    const gpus = [
      { id: "gpu-rtx3060", modelName: "NVIDIA GeForce RTX 3060", gpuMarkScore: 17200, vramGb: 12, tdpWatts: 170 },
      { id: "gpu-gtx1650", modelName: "NVIDIA GTX 1650", gpuMarkScore: 7800, vramGb: 4, tdpWatts: 75 },
      { id: "gpu-rx6600", modelName: "AMD Radeon RX 6600", gpuMarkScore: 14500, vramGb: 8, tdpWatts: 132 },
      { id: "gpu-gtx1060", modelName: "NVIDIA GTX 1060", gpuMarkScore: 10200, vramGb: 6, tdpWatts: 120 }
    ];
    return gpus.find(g => g.id === idOrName || g.modelName.toLowerCase().includes(idOrName.toLowerCase()));
  }
}
