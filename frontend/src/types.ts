export interface Product {
  id: string;
  title: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  secondaryImage?: string;
  tag?: string;
  available: boolean;
  score?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface HardwareComponent {
  name: string;
  benchmarkScore: number;
  type: "cpu" | "gpu";
  coresThreads?: string; // For CPUs
  tdp?: string;
  vram?: string; // For GPUs
}

export interface SimulationResult {
  currentCpuScore: number;
  currentGpuScore: number;
  targetCpuScore: number;
  targetGpuScore: number;
  currentFps: { [game: string]: { low: number; ultra: number } };
  targetFps: { [game: string]: { low: number; ultra: number } };
  performanceLiftPercent: number;
  bottleneckAnalysis: string;
  powerRequirementWatts: number;
}

export interface DistrictInfo {
  name: string;
  deliveryCost: number;
  days: string;
  methods: string[];
}
