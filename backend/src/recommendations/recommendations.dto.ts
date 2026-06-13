/**
 * NestJS / TypeScript Data Transfer Objects (DTO) and Interfaces
 * for the Nivel 3 Hardware Recommendation Engine.
 */

export class GetRecommendationsQueryDto {
  /**
   * The database ID or exact model name of the user's current CPU
   */
  currentCpuId!: string;

  /**
   * The database ID or exact model name of the user's current GPU
   */
  currentGpuId!: string;
}

export interface CurrentSetupDto {
  cpu: {
    id: string;
    modelName: string;
    singleThreadScore: number;
    multiThreadScore: number;
    tdpWatts: number;
    socket: string;
  };
  gpu: {
    id: string;
    modelName: string;
    gpuMarkScore: number;
    vramGb: number;
    tdpWatts: number;
  };
  gamingScore: number;
  productivityScore: number;
  tdpTotal: number;
}

export interface UpgradeDetailDto {
  id: string;
  modelName: string;
  price: number;
  imageUrl: string;
  tdpWatts: number;
  shopifyProductId: string;
  available: boolean;
  score: number;
}

export interface RecommendationUpgradeResultDto {
  /**
   * Recommended upgrades
   */
  cpuUpgrade: UpgradeDetailDto | null; // null if keeping current CPU is best/matched
  gpuUpgrade: UpgradeDetailDto | null; // null if keeping current GPU is best/matched

  /**
   * Scaled FPS and productivity performance lifts
   */
  gamingLiftPercent: number;        // e.g. +45% FPS
  productivityLiftPercent: number;  // e.g. +65% rendering speed

  /**
   * Bottleneck Diagnostics
   */
  bottleneckPercent: number;        // e.g. 8%
  bottleneckType: "CPU_LIMIT" | "GPU_LIMIT" | "BALANCED";
  bottleneckExplanation: string;

  /**
   * Power Supply requirements
   */
  totalTdpWatts: number;
  deltaTdpWatts: number;
  requiredPsuWatts: number;
  requiresPsuUpgrade: boolean;

  /**
   * Structural motherboard compatibility
   */
  requiresMotherboardSwap: boolean; // true if socket of upgraded CPU is different than current CPU
  socketCompatibilityMessage: string;
}

export interface HardwareRecommendationResponseDto {
  currentSetup: CurrentSetupDto;
  upgrades: RecommendationUpgradeResultDto[];
}
