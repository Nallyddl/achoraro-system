/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CPU {
  id: string;
  name: string;
  brand: 'Intel' | 'AMD';
  tier: 'green' | 'yellow' | 'orange' | 'red';
  level: number; // 1 = highest, 5 = lowest
  price: number;
  socket: string;
  cores: string;
  power: number; // in Watts
}

export interface GPU {
  id: string;
  name: string;
  brand: 'NVIDIA' | 'AMD';
  tier: 'green' | 'yellow' | 'orange' | 'red';
  level: number; // 1 = highest, 5 = lowest
  price: number;
  power: number; // in Watts
  vram: string;
}

export interface Motherboard {
  id: string;
  name: string;
  brand: 'Intel' | 'AMD';
  price: number;
  socket: string;
  chipset: string;
  ramType: 'DDR4' | 'DDR5';
}

export interface RAM {
  id: string;
  name: string;
  price: number;
  type: 'DDR4' | 'DDR5';
  speed: string;
  capacity: string;
}

export interface Storage {
  id: string;
  name: string;
  price: number;
  type: 'SSD NVMe' | 'SSD SATA' | 'HDD';
  capacity: string;
}

export interface CartItem {
  id: string;
  name: string;
  type: 'CPU' | 'GPU' | 'Placa Madre' | 'RAM' | 'Almacenamiento';
  price: number;
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  total: number;
  date: string;
  customerName: string;
}

export interface GamePerformance {
  name: string;
  fps1080p: number;
  fps1440p: number;
  fps4k: number;
}
