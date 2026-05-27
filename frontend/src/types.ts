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

// ========== NUEVOS TIPOS PARA EL ARMADO DE PC ==========

export interface CPU {
  id: string;
  name: string;
  brand: 'intel' | 'amd';
  socket: 'LGA1700' | 'AM5' | 'AM4' | 'LGA1200';
  cores: number;
  price: number;
  image: string;
}

export interface Motherboard {
  id: string;
  name: string;
  socket: string;
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
  ramType: 'DDR4' | 'DDR5';
  price: number;
  image: string;
}

export interface RAM {
  id: string;
  name: string;
  type: 'DDR4' | 'DDR5';
  capacity: 8 | 16 | 32 | 64;
  speed: number;
  price: number;
  image: string;
}

export interface Storage {
  id: string;
  name: string;
  type: 'NVMe' | 'SATA SSD' | 'HDD';
  capacity: string;
  price: number;
  image: string;
}

export interface GPU {
  id: string;
  name: string;
  brand: 'nvidia' | 'amd';
  vram: number;
  price: number;
  image: string;
}

// ========== DATOS MOCK (pueden ir en un archivo aparte) ==========
export const mockCPUs: CPU[] = [
  { id: 'cpu1', name: 'Intel Core i5-12400F', brand: 'intel', socket: 'LGA1700', cores: 6, price: 699.9, image: 'https://www.achorao.com/cdn/shop/files/intel-procesadores-default-title-procesador-intel-core-i5-12400f-2-50-4-40ghz-18mb-lga1700-735858503037-38391738532080.jpg?v=1754483583' },
  { id: 'cpu2', name: 'AMD Ryzen 5 5600X', brand: 'amd', socket: 'AM4', cores: 6, price: 759.0, image: 'https://www.achorao.com/cdn/shop/files/amd-ryzen-5-5600x-100-100000065box.jpg?v=1749143622' },
  { id: 'cpu3', name: 'Intel Core i7-13700K', brand: 'intel', socket: 'LGA1700', cores: 16, price: 1499.0, image: 'https://www.achorao.com/cdn/shop/files/intel-core-i7-13700k.jpg?v=1749143622' },
  { id: 'cpu4', name: 'AMD Ryzen 7 7800X3D', brand: 'amd', socket: 'AM5', cores: 8, price: 2199.0, image: 'https://www.achorao.com/cdn/shop/files/amd-ryzen-7-7800x3d.jpg?v=1749143622' },
];

export const mockMotherboards: Motherboard[] = [
  { id: 'mb1', name: 'MSI B760 Gaming Plus WiFi', socket: 'LGA1700', formFactor: 'ATX', ramType: 'DDR5', price: 619.9, image: 'https://www.achorao.com/cdn/shop/files/msi-b760-gaming-plus-wifi.jpg?v=1749143622' },
  { id: 'mb2', name: 'ASUS TUF Gaming B550-PLUS', socket: 'AM4', formFactor: 'ATX', ramType: 'DDR4', price: 549.0, image: 'https://www.achorao.com/cdn/shop/files/asus-tuf-b550-plus.jpg?v=1749143622' },
  { id: 'mb3', name: 'Gigabyte B650 AORUS Elite', socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5', price: 899.0, image: 'https://www.achorao.com/cdn/shop/files/gigabyte-b650-aorus-elite.jpg?v=1749143622' },
];

export const mockRAM: RAM[] = [
  { id: 'ram1', name: 'Kingston Fury Beast DDR5 16GB', type: 'DDR5', capacity: 16, speed: 5600, price: 299.9, image: 'https://www.achorao.com/cdn/shop/files/kingston-fury-beast-ddr5.jpg?v=1749143622' },
  { id: 'ram2', name: 'Corsair Vengeance DDR4 16GB', type: 'DDR4', capacity: 16, speed: 3200, price: 189.9, image: 'https://www.achorao.com/cdn/shop/files/corsair-vengeance-ddr4.jpg?v=1749143622' },
  { id: 'ram3', name: 'Kingston Fury Beast DDR5 32GB', type: 'DDR5', capacity: 32, speed: 5600, price: 549.9, image: 'https://www.achorao.com/cdn/shop/files/kingston-fury-beast-ddr5-32gb.jpg?v=1749143622' },
];

export const mockStorage: Storage[] = [
  { id: 'ssd1', name: 'Kingston NV3 1TB NVMe', type: 'NVMe', capacity: '1TB', price: 269.9, image: 'https://www.achorao.com/cdn/shop/files/kingston-nv3-1tb.jpg?v=1749143622' },
  { id: 'ssd2', name: 'Samsung 870 EVO 1TB SATA', type: 'SATA SSD', capacity: '1TB', price: 349.9, image: 'https://www.achorao.com/cdn/shop/files/samsung-870-evo.jpg?v=1749143622' },
  { id: 'hdd1', name: 'Seagate BarraCuda 2TB HDD', type: 'HDD', capacity: '2TB', price: 199.9, image: 'https://www.achorao.com/cdn/shop/files/seagate-barracuda-2tb.jpg?v=1749143622' },
];

export const mockGPUs: GPU[] = [
  { id: 'gpu1', name: 'ASUS Dual RTX 4060 8GB', brand: 'nvidia', vram: 8, price: 1199.9, image: 'https://www.achorao.com/cdn/shop/files/asus-rtx-4060.jpg?v=1749143622' },
  { id: 'gpu2', name: 'PowerColor RX 6600 8GB', brand: 'amd', vram: 8, price: 999.9, image: 'https://www.achorao.com/cdn/shop/files/powercolor-rx-6600.jpg?v=1749143622' },
  { id: 'gpu3', name: 'MSI RTX 4070 Ti 12GB', brand: 'nvidia', vram: 12, price: 2499.0, image: 'https://www.achorao.com/cdn/shop/files/msi-rtx-4070-ti.jpg?v=1749143622' },
];