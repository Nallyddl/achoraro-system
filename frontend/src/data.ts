/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CPU, GPU, Motherboard, RAM, Storage } from 'C:/Users/PAMELA/Desktop/achorao-system/frontend/src/types.js';

export const cpudb: Record<string, CPU> = {
  'i9-14900K': { id: 'i9-14900K', name: 'Intel Core i9-14900K', brand: 'Intel', tier: 'green', level: 1, price: 3299, socket: 'LGA1700', cores: '24 Cores / 32 Threads', power: 125 },
  'i7-14700K': { id: 'i7-14700K', name: 'Intel Core i7-14700K', brand: 'Intel', tier: 'green', level: 1, price: 2499, socket: 'LGA1700', cores: '20 Cores / 28 Threads', power: 125 },
  'i9-13900K': { id: 'i9-13900K', name: 'Intel Core i9-13900K', brand: 'Intel', tier: 'green', level: 1, price: 2999, socket: 'LGA1700', cores: '24 Cores / 32 Threads', power: 125 },
  'i7-13700K': { id: 'i7-13700K', name: 'Intel Core i7-13700K', brand: 'Intel', tier: 'green', level: 1, price: 2199, socket: 'LGA1700', cores: '16 Cores / 24 Threads', power: 125 },
  'i5-13600K': { id: 'i5-13600K', name: 'Intel Core i5-13600K', brand: 'Intel', tier: 'green', level: 2, price: 1599, socket: 'LGA1700', cores: '14 Cores / 20 Threads', power: 125 },
  'i9-12900K': { id: 'i9-12900K', name: 'Intel Core i9-12900K', brand: 'Intel', tier: 'green', level: 1, price: 2699, socket: 'LGA1700', cores: '16 Cores / 24 Threads', power: 125 },
  'i7-12700K': { id: 'i7-12700K', name: 'Intel Core i7-12700K', brand: 'Intel', tier: 'green', level: 2, price: 1899, socket: 'LGA1700', cores: '12 Cores / 20 Threads', power: 125 },
  'i5-12600K': { id: 'i5-12600K', name: 'Intel Core i5-12600K', brand: 'Intel', tier: 'yellow', level: 2, price: 1299, socket: 'LGA1700', cores: '10 Cores / 16 Threads', power: 125 },
  'i9-11900K': { id: 'i9-11900K', name: 'Intel Core i9-11900K', brand: 'Intel', tier: 'yellow', level: 2, price: 2299, socket: 'LGA1200', cores: '8 Cores / 16 Threads', power: 125 },
  'i7-11700K': { id: 'i7-11700K', name: 'Intel Core i7-11700K', brand: 'Intel', tier: 'yellow', level: 2, price: 1699, socket: 'LGA1200', cores: '8 Cores / 16 Threads', power: 125 },
  'i9-10900K': { id: 'i9-10900K', name: 'Intel Core i9-10900K', brand: 'Intel', tier: 'yellow', level: 2, price: 1999, socket: 'LGA1200', cores: '10 Cores / 20 Threads', power: 125 },
  'i7-10700K': { id: 'i7-10700K', name: 'Intel Core i7-10700K', brand: 'Intel', tier: 'yellow', level: 3, price: 1499, socket: 'LGA1200', cores: '8 Cores / 16 Threads', power: 125 },
  'i5-10600K': { id: 'i5-10600K', name: 'Intel Core i5-10600K', brand: 'Intel', tier: 'yellow', level: 3, price: 999, socket: 'LGA1200', cores: '6 Cores / 12 Threads', power: 125 },
  'i9-9900K': { id: 'i9-9900K', name: 'Intel Core i9-9900K', brand: 'Intel', tier: 'orange', level: 3, price: 1799, socket: 'LGA1151', cores: '8 Cores / 16 Threads', power: 95 },
  'i7-9700K': { id: 'i7-9700K', name: 'Intel Core i7-9700K', brand: 'Intel', tier: 'orange', level: 3, price: 1299, socket: 'LGA1151', cores: '8 Cores / 8 Threads', power: 95 },
  'i5-9600K': { id: 'i5-9600K', name: 'Intel Core i5-9600K', brand: 'Intel', tier: 'orange', level: 4, price: 899, socket: 'LGA1151', cores: '6 Cores / 6 Threads', power: 95 },
  'i7-8700K': { id: 'i7-8700K', name: 'Intel Core i7-8700K', brand: 'Intel', tier: 'orange', level: 4, price: 1099, socket: 'LGA1151', cores: '6 Cores / 12 Threads', power: 95 },
  'i5-8600K': { id: 'i5-8600K', name: 'Intel Core i5-8600K', brand: 'Intel', tier: 'orange', level: 4, price: 799, socket: 'LGA1151', cores: '6 Cores / 6 Threads', power: 95 },
  'Ryzen-9-7950X3D': { id: 'Ryzen-9-7950X3D', name: 'AMD Ryzen 9 7950X3D', brand: 'AMD', tier: 'green', level: 1, price: 3199, socket: 'AM5', cores: '16 Cores / 32 Threads', power: 120 },
  'Ryzen-9-7950X': { id: 'Ryzen-9-7950X', name: 'AMD Ryzen 9 7950X', brand: 'AMD', tier: 'green', level: 1, price: 2899, socket: 'AM5', cores: '16 Cores / 32 Threads', power: 170 },
  'Ryzen-7-7800X3D': { id: 'Ryzen-7-7800X3D', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', tier: 'green', level: 1, price: 2199, socket: 'AM5', cores: '8 Cores / 16 Threads', power: 120 },
  'Ryzen-7-7700X': { id: 'Ryzen-7-7700X', name: 'AMD Ryzen 7 7700X', brand: 'AMD', tier: 'green', level: 2, price: 1899, socket: 'AM5', cores: '8 Cores / 16 Threads', power: 105 },
  'Ryzen-5-7600X': { id: 'Ryzen-5-7600X', name: 'AMD Ryzen 5 7600X', brand: 'AMD', tier: 'green', level: 2, price: 1399, socket: 'AM5', cores: '6 Cores / 12 Threads', power: 105 },
  'Ryzen-9-5950X': { id: 'Ryzen-9-5950X', name: 'AMD Ryzen 9 5950X', brand: 'AMD', tier: 'yellow', level: 2, price: 2799, socket: 'AM4', cores: '16 Cores / 32 Threads', power: 105 },
  'Ryzen-9-5900X': { id: 'Ryzen-9-5900X', name: 'AMD Ryzen 9 5900X', brand: 'AMD', tier: 'yellow', level: 2, price: 2399, socket: 'AM4', cores: '12 Cores / 24 Threads', power: 105 },
  'Ryzen-7-5800X3D': { id: 'Ryzen-7-5800X3D', name: 'AMD Ryzen 7 5800X3D', brand: 'AMD', tier: 'green', level: 2, price: 1999, socket: 'AM4', cores: '8 Cores / 16 Threads', power: 105 },
  'Ryzen-7-5800X': { id: 'Ryzen-7-5800X', name: 'AMD Ryzen 7 5800X', brand: 'AMD', tier: 'yellow', level: 3, price: 1699, socket: 'AM4', cores: '8 Cores / 16 Threads', power: 105 },
  'Ryzen-5-5600X': { id: 'Ryzen-5-5600X', name: 'AMD Ryzen 5 5600X', brand: 'AMD', tier: 'yellow', level: 3, price: 999, socket: 'AM4', cores: '6 Cores / 12 Threads', power: 65 },
  'Ryzen-7-5700X': { id: 'Ryzen-7-5700X', name: 'AMD Ryzen 7 5700X', brand: 'AMD', tier: 'yellow', level: 3, price: 1499, socket: 'AM4', cores: '8 Cores / 16 Threads', power: 65 },
  'Ryzen-5-5500': { id: 'Ryzen-5-5500', name: 'AMD Ryzen 5 5500', brand: 'AMD', tier: 'yellow', level: 3, price: 799, socket: 'AM4', cores: '6 Cores / 12 Threads', power: 65 },
  'Ryzen-7-3800X': { id: 'Ryzen-7-3800X', name: 'AMD Ryzen 7 3800X', brand: 'AMD', tier: 'orange', level: 4, price: 1299, socket: 'AM4', cores: '8 Cores / 16 Threads', power: 105 },
  'Ryzen-5-3600': { id: 'Ryzen-5-3600', name: 'AMD Ryzen 5 3600', brand: 'AMD', tier: 'orange', level: 4, price: 699, socket: 'AM4', cores: '6 Cores / 12 Threads', power: 65 },
  'Ryzen-7-2700X': { id: 'Ryzen-7-2700X', name: 'AMD Ryzen 7 2700X', brand: 'AMD', tier: 'orange', level: 4, price: 899, socket: 'AM4', cores: '8 Cores / 16 Threads', power: 105 },
  'Ryzen-5-2600': { id: 'Ryzen-5-2600', name: 'AMD Ryzen 5 2600', brand: 'AMD', tier: 'orange', level: 4, price: 599, socket: 'AM4', cores: '6 Cores / 12 Threads', power: 65 },
  'i3-12100': { id: 'i3-12100', name: 'Intel Core i3-12100', brand: 'Intel', tier: 'orange', level: 4, price: 499, socket: 'LGA1700', cores: '4 Cores / 8 Threads', power: 60 },
  'i3-10100': { id: 'i3-10100', name: 'Intel Core i3-10100', brand: 'Intel', tier: 'orange', level: 4, price: 399, socket: 'LGA1200', cores: '4 Cores / 8 Threads', power: 65 },
  'i3-9100': { id: 'i3-9100', name: 'Intel Core i3-9100', brand: 'Intel', tier: 'red', level: 5, price: 299, socket: 'LGA1151', cores: '4 Cores / 4 Threads', power: 65 },
  'i3-8100': { id: 'i3-8100', name: 'Intel Core i3-8100', brand: 'Intel', tier: 'red', level: 5, price: 249, socket: 'LGA1151', cores: '4 Cores / 4 Threads', power: 65 }
};

export const gpudb: Record<string, GPU> = {
  'RTX-4090': { id: 'RTX-4090', name: 'NVIDIA RTX 4090', brand: 'NVIDIA', tier: 'green', level: 1, price: 5999, power: 450, vram: '24GB GDDR6X' },
  'RTX-4080-SUPER': { id: 'RTX-4080-SUPER', name: 'NVIDIA RTX 4080 SUPER', brand: 'NVIDIA', tier: 'green', level: 1, price: 4599, power: 320, vram: '16GB GDDR6X' },
  'RTX-4080': { id: 'RTX-4080', name: 'NVIDIA RTX 4080', brand: 'NVIDIA', tier: 'green', level: 1, price: 4199, power: 320, vram: '16GB GDDR6X' },
  'RTX-4070-Ti-SUPER': { id: 'RTX-4070-Ti-SUPER', name: 'NVIDIA RTX 4070 Ti SUPER', brand: 'NVIDIA', tier: 'green', level: 2, price: 3499, power: 285, vram: '16GB GDDR6X' },
  'RTX-4070-Ti': { id: 'RTX-4070-Ti', name: 'NVIDIA RTX 4070 Ti', brand: 'NVIDIA', tier: 'green', level: 2, price: 3199, power: 285, vram: '12GB GDDR6X' },
  'RTX-4070': { id: 'RTX-4070', name: 'NVIDIA RTX 4070', brand: 'NVIDIA', tier: 'green', level: 2, price: 2499, power: 200, vram: '12GB GDDR6X' },
  'RTX-4060-Ti': { id: 'RTX-4060-Ti', name: 'NVIDIA RTX 4060 Ti', brand: 'NVIDIA', tier: 'yellow', level: 3, price: 1899, power: 160, vram: '8GB GDDR6' },
  'RTX-4060': { id: 'RTX-4060', name: 'NVIDIA RTX 4060', brand: 'NVIDIA', tier: 'yellow', level: 3, price: 1499, power: 115, vram: '8GB GDDR6' },
  'RTX-3090-Ti': { id: 'RTX-3090-Ti', name: 'NVIDIA RTX 3090 Ti', brand: 'NVIDIA', tier: 'yellow', level: 2, price: 3999, power: 450, vram: '24GB GDDR6X' },
  'RTX-3090': { id: 'RTX-3090', name: 'NVIDIA RTX 3090', brand: 'NVIDIA', tier: 'yellow', level: 2, price: 3599, power: 350, vram: '24GB GDDR6X' },
  'RTX-3080-Ti': { id: 'RTX-3080-Ti', name: 'NVIDIA RTX 3080 Ti', brand: 'NVIDIA', tier: 'yellow', level: 2, price: 3299, power: 350, vram: '12GB GDDR6X' },
  'RTX-3080': { id: 'RTX-3080', name: 'NVIDIA RTX 3080', brand: 'NVIDIA', tier: 'yellow', level: 2, price: 2899, power: 320, vram: '10GB GDDR6X' },
  'RTX-3070-Ti': { id: 'RTX-3070-Ti', name: 'NVIDIA RTX 3070 Ti', brand: 'NVIDIA', tier: 'yellow', level: 3, price: 2299, power: 290, vram: '8GB GDDR6X' },
  'RTX-3070': { id: 'RTX-3070', name: 'NVIDIA RTX 3070', brand: 'NVIDIA', tier: 'yellow', level: 3, price: 1999, power: 220, vram: '8GB GDDR6' },
  'RTX-3060-Ti': { id: 'RTX-3060-Ti', name: 'NVIDIA RTX 3060 Ti', brand: 'NVIDIA', tier: 'orange', level: 3, price: 1599, power: 200, vram: '8GB GDDR6' },
  'RTX-3060': { id: 'RTX-3060', name: 'NVIDIA RTX 3060', brand: 'NVIDIA', tier: 'orange', level: 4, price: 1299, power: 170, vram: '12GB GDDR6' },
  'RTX-3050': { id: 'RTX-3050', name: 'NVIDIA RTX 3050', brand: 'NVIDIA', tier: 'orange', level: 4, price: 999, power: 130, vram: '8GB GDDR6' },
  'GTX-1660-SUPER': { id: 'GTX-1660-SUPER', name: 'NVIDIA GTX 1660 SUPER', brand: 'NVIDIA', tier: 'orange', level: 4, price: 799, power: 125, vram: '6GB GDDR6' },
  'GTX-1660': { id: 'GTX-1660', name: 'NVIDIA GTX 1660', brand: 'NVIDIA', tier: 'orange', level: 4, price: 699, power: 120, vram: '6GB GDDR5' },
  'GTX-1650': { id: 'GTX-1650', name: 'NVIDIA GTX 1650', brand: 'NVIDIA', tier: 'red', level: 5, price: 499, power: 75, vram: '4GB GDDR5' },
  'GTX-1050-Ti': { id: 'GTX-1050-Ti', name: 'NVIDIA GTX 1050 Ti', brand: 'NVIDIA', tier: 'red', level: 5, price: 399, power: 75, vram: '4GB GDDR5' },
  'RX-7900-XTX': { id: 'RX-7900-XTX', name: 'AMD RX 7900 XTX', brand: 'AMD', tier: 'green', level: 1, price: 3999, power: 355, vram: '24GB GDDR6' },
  'RX-7900-XT': { id: 'RX-7900-XT', name: 'AMD RX 7900 XT', brand: 'AMD', tier: 'green', level: 2, price: 3499, power: 300, vram: '20GB GDDR6' },
  'RX-7800-XT': { id: 'RX-7800-XT', name: 'AMD RX 7800 XT', brand: 'AMD', tier: 'green', level: 2, price: 2799, power: 263, vram: '16GB GDDR6' },
  'RX-7700-XT': { id: 'RX-7700-XT', name: 'AMD RX 7700 XT', brand: 'AMD', tier: 'yellow', level: 3, price: 2299, power: 245, vram: '12GB GDDR6' },
  'RX-7600-XT': { id: 'RX-7600-XT', name: 'AMD RX 7600 XT', brand: 'AMD', tier: 'yellow', level: 3, price: 1699, power: 190, vram: '16GB GDDR6' },
  'RX-6950-XT': { id: 'RX-6950-XT', name: 'AMD RX 6950 XT', brand: 'AMD', tier: 'yellow', level: 2, price: 2999, power: 335, vram: '16GB GDDR6' },
  'RX-6900-XT': { id: 'RX-6900-XT', name: 'AMD RX 6900 XT', brand: 'AMD', tier: 'yellow', level: 2, price: 2799, power: 300, vram: '16GB GDDR6' },
  'RX-6800-XT': { id: 'RX-6800-XT', name: 'AMD RX 6800 XT', brand: 'AMD', tier: 'yellow', level: 3, price: 2499, power: 300, vram: '16GB GDDR6' },
  'RX-6800': { id: 'RX-6800', name: 'AMD RX 6800', brand: 'AMD', tier: 'yellow', level: 3, price: 2199, power: 250, vram: '16GB GDDR6' },
  'RX-6700-XT': { id: 'RX-6700-XT', name: 'AMD RX 6700 XT', brand: 'AMD', tier: 'orange', level: 4, price: 1599, power: 230, vram: '12GB GDDR6' },
  'RX-6600-XT': { id: 'RX-6600-XT', name: 'AMD RX 6600 XT', brand: 'AMD', tier: 'orange', level: 4, price: 1299, power: 160, vram: '8GB GDDR6' },
  'RX-6600': { id: 'RX-6600', name: 'AMD RX 6600', brand: 'AMD', tier: 'orange', level: 4, price: 999, power: 132, vram: '8GB GDDR6' },
  'RX-6500-XT': { id: 'RX-6500-XT', name: 'AMD RX 6500 XT', brand: 'AMD', tier: 'red', level: 5, price: 699, power: 107, vram: '4GB GDDR6' }
};

export const mobodb: Record<string, Motherboard> = {
  'Z790': { id: 'Z790', name: 'ASUS ROG Maximus Z790 DDR5', brand: 'Intel', price: 1899, socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5' },
  'Z690': { id: 'Z690', name: 'MSI MPG Z690 Carbon DDR5', brand: 'Intel', price: 1599, socket: 'LGA1700', chipset: 'Z690', ramType: 'DDR5' },
  'B760': { id: 'B760', name: 'Gigabyte B760 Aorus Elite DDR4', brand: 'Intel', price: 899, socket: 'LGA1700', chipset: 'B760', ramType: 'DDR4' },
  'B660': { id: 'B660', name: 'ASUS TUF Gaming B660-Plus DDR4', brand: 'Intel', price: 749, socket: 'LGA1700', chipset: 'B660', ramType: 'DDR4' },
  'H610': { id: 'H610', name: 'MSI PRO H610M-G DDR4', brand: 'Intel', price: 499, socket: 'LGA1700', chipset: 'H610', ramType: 'DDR4' },
  'X670E': { id: 'X670E', name: 'ASUS ROG Strix X670E-F Gaming WiFi', brand: 'AMD', price: 2199, socket: 'AM5', chipset: 'X670E', ramType: 'DDR5' },
  'X670': { id: 'X670', name: 'MSI PRO X670-P WiFi DDR5', brand: 'AMD', price: 1799, socket: 'AM5', chipset: 'X670', ramType: 'DDR5' },
  'B650E': { id: 'B650E', name: 'ASUS ROG Strix B650E-F Gaming WiFi', brand: 'AMD', price: 1299, socket: 'AM5', chipset: 'B650E', ramType: 'DDR5' },
  'B650': { id: 'B650', name: 'Gigabyte B650 Aorus Elite AX DDR5', brand: 'AMD', price: 999, socket: 'AM5', chipset: 'B650', ramType: 'DDR5' },
  'X570': { id: 'X570', name: 'ASUS ROG Strix X570-E Gaming DDR4', brand: 'AMD', price: 1399, socket: 'AM4', chipset: 'X570', ramType: 'DDR4' },
  'B550': { id: 'B550', name: 'MSI MAG B550 Tomahawk DDR4', brand: 'AMD', price: 799, socket: 'AM4', chipset: 'B550', ramType: 'DDR4' },
  'B450': { id: 'B450', name: 'ASUS TUF Gaming B450-Plus II DDR4', brand: 'AMD', price: 599, socket: 'AM4', chipset: 'B450', ramType: 'DDR4' },
  'Z590': { id: 'Z590', name: 'ASUS Prime Z590-A DDR4', brand: 'Intel', price: 1199, socket: 'LGA1200', chipset: 'Z590', ramType: 'DDR4' },
  'Z490': { id: 'Z490', name: 'MSI MPG Z490 Gaming Edge WiFi', brand: 'Intel', price: 999, socket: 'LGA1200', chipset: 'Z490', ramType: 'DDR4' },
  'B560': { id: 'B560', name: 'Gigabyte B560 Aorus Elite DDR4', brand: 'Intel', price: 699, socket: 'LGA1200', chipset: 'B560', ramType: 'DDR4' },
  'B460': { id: 'B460', name: 'ASUS TUF Gaming B460-Plus DDR4', brand: 'Intel', price: 549, socket: 'LGA1200', chipset: 'B460', ramType: 'DDR4' }
};

export const ramdb: Record<string, RAM> = {
  '64GB-DDR5-6400': { id: '64GB-DDR5-6400', name: 'Corsair Vengeance 64GB (2x32GB) DDR5 6400MHz', price: 1399, type: 'DDR5', speed: '6400MHz', capacity: '64GB' },
  '64GB-DDR5-6000': { id: '64GB-DDR5-6000', name: 'G.Skill Trident Z5 Neo 64GB (2x32GB) DDR5 6000MHz', price: 1199, type: 'DDR5', speed: '6000MHz', capacity: '64GB' },
  '32GB-DDR5-6400': { id: '32GB-DDR5-6400', name: 'Corsair Dominator Titanium 32GB (2x16GB) DDR5 6400MHz', price: 799, type: 'DDR5', speed: '6400MHz', capacity: '32GB' },
  '32GB-DDR5-6000': { id: '32GB-DDR5-6000', name: 'Kingston FURY Beast 32GB (2x16GB) DDR5 6000MHz', price: 699, type: 'DDR5', speed: '6000MHz', capacity: '32GB' },
  '32GB-DDR5-5600': { id: '32GB-DDR5-5600', name: 'Crucial Pro 32GB (2x16GB) DDR5 5600MHz', price: 599, type: 'DDR5', speed: '5600MHz', capacity: '32GB' },
  '32GB-DDR5-5200': { id: '32GB-DDR5-5200', name: 'TeamGroup Elite 32GB (2x16GB) DDR5 5200MHz', price: 549, type: 'DDR5', speed: '5200MHz', capacity: '32GB' },
  '16GB-DDR5-6000': { id: '16GB-DDR5-6000', name: 'G.Skill Flare X5 16GB (2x8GB) DDR5 6000MHz', price: 449, type: 'DDR5', speed: '6000MHz', capacity: '16GB' },
  '16GB-DDR5-5600': { id: '16GB-DDR5-5600', name: 'Corsair Vengeance 16GB (2x8GB) DDR5 5600MHz', price: 399, type: 'DDR5', speed: '5600MHz', capacity: '16GB' },
  '64GB-DDR4-3600': { id: '64GB-DDR4-3600', name: 'G.Skill Ripjaws V 64GB (2x32GB) DDR4 3600MHz', price: 899, type: 'DDR4', speed: '3600MHz', capacity: '64GB' },
  '32GB-DDR4-3600': { id: '32GB-DDR4-3600', name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 3600MHz', price: 549, type: 'DDR4', speed: '3600MHz', capacity: '32GB' },
  '32GB-DDR4-3200': { id: '32GB-DDR4-3200', name: 'Kingston FURY Renegade 32GB (2x16GB) DDR4 3200MHz', price: 499, type: 'DDR4', speed: '3200MHz', capacity: '32GB' },
  '16GB-DDR4-3600': { id: '16GB-DDR4-3600', name: 'G.Skill Trident Z RGB 16GB (2x8GB) DDR4 3600MHz', price: 349, type: 'DDR4', speed: '3600MHz', capacity: '16GB' },
  '16GB-DDR4-3200': { id: '16GB-DDR4-3200', name: 'TeamGroup T-Force Vulcan Z 16GB (2x8GB) DDR4 3200MHz', price: 299, type: 'DDR4', speed: '3200MHz', capacity: '16GB' },
  '16GB-DDR4-3000': { id: '16GB-DDR4-3000', name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3000MHz', price: 269, type: 'DDR4', speed: '3000MHz', capacity: '16GB' },
  '8GB-DDR4-3200': { id: '8GB-DDR4-3200', name: 'Crucial 8GB DDR4 3200MHz CL22 Desktop RAM', price: 179, type: 'DDR4', speed: '3200MHz', capacity: '8GB' },
  '8GB-DDR4-2666': { id: '8GB-DDR4-2666', name: 'Kingston ValueRAM 8GB DDR4 2666MHz CL19', price: 149, type: 'DDR4', speed: '2666MHz', capacity: '8GB' }
};

export const storagedb: Record<string, Storage> = {
  'SSD-4TB-NVMe': { id: 'SSD-4TB-NVMe', name: 'Crucial T700 4TB NVMe PCIe Gen5 M.2 SSD', price: 1299, type: 'SSD NVMe', capacity: '4TB' },
  'SSD-2TB-NVMe': { id: 'SSD-2TB-NVMe', name: 'Samsung 990 PRO 2TB NVMe M.2 SSD', price: 699, type: 'SSD NVMe', capacity: '2TB' },
  'SSD-1TB-NVMe': { id: 'SSD-1TB-NVMe', name: 'Kingston KC3000 1TB NVMe M.2 SSD', price: 399, type: 'SSD NVMe', capacity: '1TB' },
  'SSD-500GB-NVMe': { id: 'SSD-500GB-NVMe', name: 'Western Digital Blue SN580 500GB NVMe', price: 249, type: 'SSD NVMe', capacity: '500GB' },
  'SSD-1TB-SATA': { id: 'SSD-1TB-SATA', name: 'Crucial MX500 1TB SATA III 2.5 Inch SSD', price: 299, type: 'SSD SATA', capacity: '1TB' },
  'HDD-2TB': { id: 'HDD-2TB', name: 'Seagate BarraCuda 2TB 7200RPM 3.5 Inch SATA HDD', price: 249, type: 'HDD', capacity: '2TB' },
  'HDD-1TB': { id: 'HDD-1TB', name: 'Western Digital Caviar Blue 1TB 7200RPM SATA HDD', price: 149, type: 'HDD', capacity: '1TB' }
};

// Games performance multipliers / configs based on tiers and levels
export const testGames = [
  { name: 'Cyberpunk 2077 (Ray Tracing)', baseFps: 45 },
  { name: 'Valorant (Competitive)', baseFps: 280 },
  { name: 'Fortnite (Performance Mode)', baseFps: 220 },
  { name: 'Red Dead Redemption 2 (Ultra)', baseFps: 55 },
  { name: 'Forza Horizon 5 (Extreme)', baseFps: 70 }
];
