/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, 
  Layers, 
  HardDrive, 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  Sparkles, 
  Moon, 
  Sun, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Info, 
  Save, 
  History, 
  BookmarkCheck, 
  Check, 
  Flame, 
  Coins, 
  Share2, 
  Database,
  Bolt,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cpudb, gpudb, mobodb, ramdb, storagedb, testGames } from 'C:/Users/PAMELA/Desktop/achorao-system/frontend/src/data.js';
import { CPU, GPU, Motherboard, RAM, Storage, CartItem, Order, GamePerformance } from 'C:/Users/PAMELA/Desktop/achorao-system/frontend/src/types.js';

export default function App() {
  // Theme State
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('achorao_theme');
    if (saved) return saved === 'dark';
    return true; // Deafult to professional dark theme
  });

  // Apply body classes for theme
  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('achorao_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('achorao_theme', 'light');
    }
  }, [darkTheme]);

  // --- PC Configurator States ---
  const [currentCpu, setCurrentCpu] = useState<string>('i9-10900K');
  const [currentGpu, setCurrentGpu] = useState<string>('RTX-3070-Ti');
  const [currentMobo, setCurrentMobo] = useState<string>('B560');
  const [currentRam, setCurrentRam] = useState<string>('16GB-DDR4-3200');
  const [currentStorage, setCurrentStorage] = useState<string>('SSD-1TB-NVMe');

  // Proposal upgrade states ('none' representing "keep current component")
  const [upgradeCpu, setUpgradeCpu] = useState<string>('none');
  const [upgradeGpu, setUpgradeGpu] = useState<string>('none');
  const [upgradeMobo, setUpgradeMobo] = useState<string>('none');
  const [upgradeRam, setUpgradeRam] = useState<string>('none');
  const [upgradeStorage, setUpgradeStorage] = useState<string>(''); // Default none

  // Simulator resolution: '1080p' | '1440p' | '4k'
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4k'>('1440p');

  // Filtering proposed list view
  const [upgradeFilter, setUpgradeFilter] = useState<'all' | 'nueva' | 'sin-cambio'>('all');

  // Component search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'cpu' | 'gpu' | 'mobo' | 'ram'>('all');

  // --- Commerce States ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // as percentage
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  // Builds and Orders Local History
  const [savedBuilds, setSavedBuilds] = useState<Array<{ id: string; name: string; date: string; setup: any }>>([]);
  const [buildName, setBuildName] = useState<string>('');
  const [showSavedToast, setShowSavedToast] = useState<string | null>(null);

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Performance simulation result state (when user clicks simulation)
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeSimulation, setActiveSimulation] = useState<boolean>(false);

  // PassMarkScraper API state
  const [apiBenchmarkScores, setApiBenchmarkScores] = useState<any>(null);

  // Fetch real-time PassMark scores from the Scraping API on component change
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const uCpu = upgradeCpu !== 'none' ? upgradeCpu : currentCpu;
        const uGpu = upgradeGpu !== 'none' ? upgradeGpu : currentGpu;
        const queryParams = new URLSearchParams({
          currentCpu,
          currentGpu,
          upgradeCpu: uCpu,
          upgradeGpu: uGpu
        });
        const res = await fetch(`/api/passmark?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setApiBenchmarkScores(data);
        }
      } catch (err) {
        console.error('Error fetching PassMark scores:', err);
      }
    };
    fetchScores();
  }, [currentCpu, currentGpu, upgradeCpu, upgradeGpu]);

  // Load Saved Builds and Orders from localStorage
  useEffect(() => {
    const builds = localStorage.getItem('achorao_builds');
    if (builds) setSavedBuilds(JSON.parse(builds));

    const orders = localStorage.getItem('achorao_orders');
    if (orders) setOrderHistory(JSON.parse(orders));
  }, []);

  // Set default smart recommendations safely without overwriting manual settings
  useEffect(() => {
    const currentCpuObj = cpudb[currentCpu];
    const currentGpuObj = gpudb[currentGpu];

    if (currentCpuObj && upgradeCpu === 'none') {
      // Find an excellent higher-level socket upgrade (excluding current cpu)
      const nextCpuOptions = Object.values(cpudb).filter(
        cpu => cpu.tier === 'green' && cpu.id !== currentCpu && (cpu.socket === currentCpuObj.socket || cpu.level < currentCpuObj.level)
      );
      if (nextCpuOptions.length > 0) {
        setUpgradeCpu(nextCpuOptions[0].id);
      }
    }

    if (currentGpuObj && upgradeGpu === 'none') {
      // Find an excellent higher-level graphic card upgrade (excluding current gpu)
      const nextGpuOptions = Object.values(gpudb).filter(
        gpu => gpu.tier === 'green' && gpu.id !== currentGpu && gpu.level < currentGpuObj.level
      );
      if (nextGpuOptions.length > 0) {
        setUpgradeGpu(nextGpuOptions[0].id);
      }
    }

    // Default Motherboard based on recommended CPU if board upgrade not yet set
    if (upgradeMobo === 'none') {
      const targetCpu = cpudb[upgradeCpu !== 'none' ? upgradeCpu : currentCpu];
      if (targetCpu) {
        const bestMobo = Object.values(mobodb).find(m => m.socket === targetCpu.socket && m.id !== currentMobo);
        if (bestMobo) {
          setUpgradeMobo(bestMobo.id);
        }
      }
    }
    
    setUpgradeRam('none');
    setUpgradeStorage('');
  }, [currentCpu, currentGpu]);

  // Automatically adjust core socket matching when upgraded CPU or Mobo is changed
  const handleUpgradeCpuChange = (val: string) => {
    setUpgradeCpu(val);
    if (val !== 'none') {
      const cpu = cpudb[val];
      const mobo = mobodb[upgradeMobo];
      
      // If upgraded mobo does not support it, select a compatible one automatically
      if (cpu && (!mobo || mobo.socket !== cpu.socket)) {
        const compatibleMobo = Object.values(mobodb).find(m => m.socket === cpu.socket);
        if (compatibleMobo) {
          setUpgradeMobo(compatibleMobo.id);
        }
      }
    }
  };

  const handleUpgradeMoboChange = (val: string) => {
    setUpgradeMobo(val);
    if (val !== 'none') {
      const mobo = mobodb[val];
      const cpuObj = cpudb[upgradeCpu !== 'none' ? upgradeCpu : currentCpu];
      
      // If selected cpu doesn't match new mobo, enforce match
      if (mobo && cpuObj && cpuObj.socket !== mobo.socket) {
        const matchingCpu = Object.values(cpudb).find(c => c.socket === mobo.socket);
        if (matchingCpu) {
          setUpgradeCpu(matchingCpu.id);
        }
      }
    }
  };

  // Switch to preset filters for upgraded components
  const componentsToUpgradeMatchesSearch = (cat: string) => {
    if (upgradeFilter === 'all') return true;
    if (upgradeFilter === 'nueva') return cat !== 'none' && cat !== '';
    if (upgradeFilter === 'sin-cambio') return cat === 'none' || cat === '';
    return true;
  };

  // Apply Coupon promo code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (coupon.trim().toUpperCase() === 'ACHORAO10') {
      setAppliedDiscount(10);
      setCouponSuccess('¡Cupón ACHORAO10 aplicado exitosamente! Obtuviste 10% de descuento.');
    } else if (coupon.trim().toUpperCase() === 'UPGRADE20') {
      setAppliedDiscount(20);
      setCouponSuccess('¡Cupón UPGRADE20 aplicado para hardware certificado! Obtuviste 20% de descuento.');
    } else {
      setCouponError('Cupón inválido. Intenta con ACHORAO10 o UPGRADE20');
    }
  };

  // Apply custom recommendation setup instantly
  const applyAllRecommendations = () => {
    // Green tier elite choices
    const eliteCpu = 'i9-14900K';
    const eliteGpu = 'RTX-4080-SUPER';
    const eliteMobo = 'Z790';
    const eliteRam = '32GB-DDR5-6000';
    const eliteStorage = 'SSD-2TB-NVMe';

    setUpgradeCpu(eliteCpu);
    setUpgradeGpu(eliteGpu);
    setUpgradeMobo(eliteMobo);
    setUpgradeRam(eliteRam);
    setUpgradeStorage(eliteStorage);

    showNotification('Configuración Gamer Élite cargada correctamente como propuesta.');
  };

  const showNotification = (msg: string) => {
    setShowSavedToast(msg);
    setTimeout(() => {
      setShowSavedToast(null);
    }, 4000);
  };

  // --- Compatibility Core Engine Calculations ---
  const compatibilityDiagnostics = useMemo(() => {
    const finalCpuStr = upgradeCpu !== 'none' ? upgradeCpu : currentCpu;
    const finalMoboStr = upgradeMobo !== 'none' ? upgradeMobo : currentMobo;
    const finalRamStr = upgradeRam !== 'none' ? upgradeRam : currentRam;
    const finalGpuStr = upgradeGpu !== 'none' ? upgradeGpu : currentGpu;

    const cpu = cpudb[finalCpuStr];
    const mobo = mobodb[finalMoboStr];
    const ram = ramdb[finalRamStr];
    const gpu = gpudb[finalGpuStr];

    const warnings: string[] = [];
    let severity: 'success' | 'warning' | 'orange' | 'error' = 'success';
    let psuRecommend = 500; // base minimum Watts

    // 1. Socket Compatibility
    if (cpu && mobo && cpu.socket !== mobo.socket) {
      warnings.push(`Incompatibilidad de Socket: El procesador (${cpu.name}) requiere socket ${cpu.socket}, pero la placa de destino (${mobo.name}) tiene socket ${mobo.socket}.`);
      severity = 'error';
    }

    // 2. RAM Memory Compatibility
    // Standard motherboard RAM types inferred
    if (ram && mobo) {
      const moboRamType = mobo.ramType;
      const selectedRamType = ram.type;
      if (moboRamType !== selectedRamType) {
        warnings.push(`Incompatibilidad de RAM: La placa (${mobo.name}) soporta memoria tipo ${moboRamType}, pero tienes seleccionada una memoria ${selectedRamType} (${ram.name}).`);
        severity = 'error';
      }
    }

    // 3. Power Consumption Calculation
    let powerDraw = 0;
    if (cpu) powerDraw += cpu.power;
    if (gpu) powerDraw += gpu.power;
    powerDraw += 80; // auxiliary power motherboard/fans/LEDs

    // PSU recommendation with 30% overhead safety margin
    psuRecommend = Math.ceil((powerDraw * 1.3) / 50) * 50;
    if (psuRecommend < 500) psuRecommend = 500;

    // 4. Bottleneck Assessment
    let bottleneckText = '';
    let bottleneckScore = 0; // percentage
    if (cpu && gpu) {
      const diff = cpu.level - gpu.level; // Levels range from 1 (elite) to 5 (entry)
      if (diff > 1) {
        // CPU level is much higher than GPU level (CPU is 1, GPU is 3, e.g. 14900K and RTX 4060)
        bottleneckScore = Math.min(diff * 12, 45);
        bottleneckText = `Limitación por GPU (${bottleneckScore}%): Tu procesador tiene un alto potencial desaprovechado porque la GPU se saturará primero en resoluciones competitivas.`;
        if (severity !== 'error') severity = 'warning';
      } else if (diff < -1) {
        // GPU level is much higher than CPU level (CPU is 4, GPU is 1, e.g. Core i5-8600K and RTX 4095)
        bottleneckScore = Math.min(Math.abs(diff) * 18, 70);
        bottleneckText = `Cuello de botella de CPU crítico (${bottleneckScore}%): Tu procesador es de generación antigua y causará caídas de frames drásticas (stuttering) al acoplarse con esta potente GPU.`;
        if (severity !== 'error') severity = 'orange';
      } else {
        // Balances ranges
        bottleneckScore = Math.floor(Math.random() * 4) + 1; // 1-4% standard overhead
        bottleneckText = `Sinergia óptima (${bottleneckScore}%): Ambos componentes rinden a la par. Excelente acoplamiento de hardware.`;
      }
    }

    return {
      warnings,
      severity,
      psuRecommend,
      bottleneckScore,
      bottleneckText
    };
  }, [currentCpu, currentMobo, currentRam, currentGpu, upgradeCpu, upgradeMobo, upgradeRam, upgradeGpu]);

  // --- Interactive FPS game simulations ---
  const simulatedFPS = useMemo(() => {
    // Current setup metrics
    const baseCpu = cpudb[currentCpu];
    const baseGpu = gpudb[currentGpu];

    // Propuesto / final metrics
    const nextCpu = cpudb[upgradeCpu !== 'none' ? upgradeCpu : currentCpu];
    const nextGpu = gpudb[upgradeGpu !== 'none' ? upgradeGpu : currentGpu];

    // Default scoring formulas for offline calculation
    let currentCpuScore = baseCpu ? (6 - baseCpu.level) * 10000 : 10000;
    let currentGpuScore = baseGpu ? (6 - baseGpu.level) * 8000 : 8000;
    let upgradeCpuScore = nextCpu ? (6 - nextCpu.level) * 10000 : 10000;
    let upgradeGpuScore = nextGpu ? (6 - nextGpu.level) * 8000 : 8000;

    // Overwrite dynamically using real PassMark values retrieved from our backend scraper
    if (apiBenchmarkScores) {
      if (apiBenchmarkScores.currentCpu?.score) currentCpuScore = apiBenchmarkScores.currentCpu.score;
      if (apiBenchmarkScores.currentGpu?.score) currentGpuScore = apiBenchmarkScores.currentGpu.score;
      if (apiBenchmarkScores.upgradeCpu?.score) upgradeCpuScore = apiBenchmarkScores.upgradeCpu.score;
      if (apiBenchmarkScores.upgradeGpu?.score) upgradeGpuScore = apiBenchmarkScores.upgradeGpu.score;
    }

    // Benchmark-driven scaling calculations
    const currentMult = (currentCpuScore / 40000 + (currentGpuScore / 25000) * 2) / 3;
    const upgradeMult = (upgradeCpuScore / 40000 + (upgradeGpuScore / 25000) * 2) / 3;

    // Adjust multipliers by resolution
    let resMultiplier = 1.0;
    if (resolution === '1440p') resMultiplier = 0.72;
    if (resolution === '4k') resMultiplier = 0.44;

    return testGames.map(game => {
      const rawCurrent = Math.round(game.baseFps * currentMult * resMultiplier * 1.3);
      const rawUpgrade = Math.round(game.baseFps * upgradeMult * resMultiplier * 1.3);

      return {
        name: game.name,
        currentFps: Math.max(15, rawCurrent),
        upgradeFps: Math.max(15, rawUpgrade),
        increase: Math.max(0, Math.round(((rawUpgrade - rawCurrent) / rawCurrent) * 100))
      };
    });
  }, [currentCpu, currentGpu, upgradeCpu, upgradeGpu, resolution, apiBenchmarkScores]);

  // Executing instant simulation triggers
  const executeSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setActiveSimulation(true);
      showNotification('Simulación de rendimiento renderizada con éxito.');
    }, 1200);
  };

  // --- Shopping Cart Functions ---
  const addPropuestosToCart = () => {
    const freshCartItems: CartItem[] = [];

    if (upgradeCpu !== 'none') {
      const component = cpudb[upgradeCpu];
      if (component) {
        freshCartItems.push({
          id: `CPU-${component.id}-${Date.now()}`,
          name: component.name,
          type: 'CPU',
          price: component.price
        });
      }
    }

    if (upgradeGpu !== 'none') {
      const component = gpudb[upgradeGpu];
      if (component) {
        freshCartItems.push({
          id: `GPU-${component.id}-${Date.now()}`,
          name: component.name,
          type: 'GPU',
          price: component.price
        });
      }
    }

    if (upgradeMobo !== 'none') {
      const component = mobodb[upgradeMobo];
      if (component) {
        freshCartItems.push({
          id: `MOBO-${component.id}-${Date.now()}`,
          name: component.name,
          type: 'Placa Madre',
          price: component.price
        });
      }
    }

    if (upgradeRam !== 'none') {
      const component = ramdb[upgradeRam];
      if (component) {
        freshCartItems.push({
          id: `RAM-${component.id}-${Date.now()}`,
          name: component.name,
          type: 'RAM',
          price: component.price
        });
      }
    }

    if (upgradeStorage !== '') {
      const component = storagedb[upgradeStorage];
      if (component) {
        freshCartItems.push({
          id: `STORAGE-${component.id}-${Date.now()}`,
          name: component.name,
          type: 'Almacenamiento',
          price: component.price
        });
      }
    }

    if (freshCartItems.length === 0) {
      showNotification('No has seleccionado componentes "NUEVOS" para cotizar. Cambia el estado de algún componente.');
      return;
    }

    setCart(prev => [...prev, ...freshCartItems]);
    showNotification(`¡Añadiste exitosamente ${freshCartItems.length} componente(s) al carrito!`);
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Clear shopping cart
  const clearCart = () => {
    setCart([]);
    showNotification('Carrito vaciado.');
  };

  // --- Local Build Savestate Engine ---
  const saveCurrentBuildPlan = () => {
    if (!buildName.trim()) {
      showNotification('Por favor escribe un nombre descriptivo para identificar tu simulación.');
      return;
    }

    const newBuild = {
      id: `build-${Date.now()}`,
      name: buildName,
      date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      setup: {
        currentCpu,
        currentGpu,
        currentMobo,
        currentRam,
        currentStorage,
        upgradeCpu,
        upgradeGpu,
        upgradeMobo,
        upgradeRam,
        upgradeStorage
      }
    };

    const updated = [newBuild, ...savedBuilds];
    setSavedBuilds(updated);
    localStorage.setItem('achorao_builds', JSON.stringify(updated));
    setBuildName('');
    showNotification(`Simulación "${newBuild.name}" guardada localmente.`);
  };

  const loadSavedBuild = (setupData: any) => {
    setCurrentCpu(setupData.currentCpu);
    setCurrentGpu(setupData.currentGpu);
    setCurrentMobo(setupData.currentMobo);
    setCurrentRam(setupData.currentRam);
    setCurrentStorage(setupData.currentStorage);

    setUpgradeCpu(setupData.upgradeCpu);
    setUpgradeGpu(setupData.upgradeGpu);
    setUpgradeMobo(setupData.upgradeMobo);
    setUpgradeRam(setupData.upgradeRam);
    setUpgradeStorage(setupData.upgradeStorage);

    showNotification('Configuración cargada de forma interactiva en la mesa.');
  };

  const deleteSavedBuild = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(filtered);
    localStorage.setItem('achorao_builds', JSON.stringify(filtered));
    showNotification('Simulación eliminada.');
  };

  // Quick lookup prices helper
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.price, 0);
  }, [cart]);

  const cartIGV = useMemo(() => {
    return cartSubtotal * 0.18; // Traditional Peru tax
  }, [cartSubtotal]);

  const cartDiscountVal = useMemo(() => {
    return cartSubtotal * (appliedDiscount / 100);
  }, [cartSubtotal, appliedDiscount]);

  const cartTotalSum = useMemo(() => {
    return cartSubtotal + cartIGV - cartDiscountVal;
  }, [cartSubtotal, cartIGV, cartDiscountVal]);

  // Execute payments validation
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv || !emailAddress) {
      alert('Por favor complete todos los datos del formulario de pago.');
      return;
    }

    setIsProcessingPayment(true);

    // Simulate standard payment gateway transition delay
    setTimeout(() => {
      const orderNum = `ACH-${Math.floor(100000 + Math.random() * 900000)}`;
      const completedOrder: Order = {
        orderNumber: orderNum,
        items: [...cart],
        total: cartTotalSum,
        date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        customerName: cardHolder
      };

      const freshOrders = [completedOrder, ...orderHistory];
      setOrderHistory(freshOrders);
      localStorage.setItem('achorao_orders', JSON.stringify(freshOrders));

      setIsProcessingPayment(false);
      setReceiptOrder(completedOrder);
      setCart([]); // Reset Cart
      setAppliedDiscount(0);
      setCoupon('');
      showNotification(`¡Compra autorizada! Orden procesada: ${orderNum}`);
    }, 2000);
  };

  // Reset inputs
  const closeReceiptAndReset = () => {
    setShowCheckoutModal(false);
    setReceiptOrder(null);
    setCardHolder('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setEmailAddress('');
  };

  // Find components by string
  const filteredSearchList = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const result: Array<{ id: string; name: string; price: number; type: string; spec: string }> = [];

    if (searchCategory === 'all' || searchCategory === 'cpu') {
      Object.values(cpudb).forEach(c => {
        if (c.name.toLowerCase().includes(query)) {
          result.push({ id: c.id, name: c.name, price: c.price, type: 'CPU', spec: `${c.cores} (${c.socket})` });
        }
      });
    }
    
    if (searchCategory === 'all' || searchCategory === 'gpu') {
      Object.values(gpudb).forEach(g => {
        if (g.name.toLowerCase().includes(query)) {
          result.push({ id: g.id, name: g.name, price: g.price, type: 'GPU', spec: `${g.vram}, ${g.power}W` });
        }
      });
    }

    if (searchCategory === 'all' || searchCategory === 'mobo') {
      Object.values(mobodb).forEach(m => {
        if (m.name.toLowerCase().includes(query)) {
          result.push({ id: m.id, name: m.name, price: m.price, type: 'Placa Madre', spec: `${m.socket}, ${m.ramType}` });
        }
      });
    }

    if (searchCategory === 'all' || searchCategory === 'ram') {
      Object.values(ramdb).forEach(r => {
        if (r.name.toLowerCase().includes(query)) {
          result.push({ id: r.id, name: r.name, price: r.price, type: 'RAM', spec: `${r.speed}, ${r.capacity}` });
        }
      });
    }

    return result.slice(0, 10); // Return top 10 matches
  }, [searchQuery, searchCategory]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${darkTheme ? 'bg-[#0b0f19] text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Toast alert message */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#dc2626] text-white font-medium py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 border border-red-500/30 text-sm md:text-base"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>{showSavedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM NAVBAR --- */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${darkTheme ? 'bg-[#111827]/90 border-red-900/40' : 'bg-white/90 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo Brand with Corporate Red/White Emblem */}
          <div className="flex items-center gap-3">
            <div className="bg-[#dc2626] text-white p-2.5 rounded-xl shadow-lg shadow-red-600/20 border border-red-500 flex items-center justify-center transform hover:rotate-6 transition-transform">
              <Bolt className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight font-display text-gray-900 dark:text-white">
                  ACHORAO
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-mono font-bold text-[#dc2626] dark:text-red-400">
                Hardware Certificado
              </p>
            </div>
          </div>

          {/* Center Info Banner */}
          <div className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 text-xs text-[#dc2626] dark:text-red-300 font-medium">
            <span className="font-bold">CORE PRO V4:</span>
            <span>Simulador de Compatibilidad Oficial con precios e IGV de Perú</span>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex items-center gap-3">
            
            {/* Order History link */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className={`p-2.5 rounded-xl border transition-all relative flex items-center gap-2 text-xs font-bold ${darkTheme ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'}`}
              title="Historial de Pedidos / Compras"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Mis Órdenes</span>
              {orderHistory.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {orderHistory.length}
                </span>
              )}
            </button>

            {/* Dark & Light mode toggle */}
            <button
              onClick={() => setDarkTheme(!darkTheme)}
              className={`p-2.5 rounded-xl border transition-all ${
                darkTheme 
                  ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Alternar modo oscuro"
            >
              {darkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Sticky Cart Trigger */}
            <a
              href="#quote-invoice-cart"
              className="bg-[#dc2626] text-white p-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all text-sm shadow-md hover:shadow-red-600/30"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Ver Carrito</span>
              <span className="bg-white text-[#dc2626] text-xs font-black px-1.5 py-0.5 rounded-lg">
                {cart.length}
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* --- HERO BANNER & SEARCH --- */}
      <div className={`py-6 border-b transition-colors ${darkTheme ? 'bg-gradient-to-r from-red-950/20 via-gray-900 to-gray-900 border-red-950/40' : 'bg-gradient-to-r from-red-500/5 via-gray-100 to-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
                Mesa de Simulación <span className="text-[#dc2626] dark:text-red-500">Achorao SmartPC</span>
              </h1>
              <p className={`text-sm mt-1 max-w-2xl ${darkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                Arma, simula y evalúa cuellos de botella e incompatibilidad técnica. Recomendaciones sugeridas automáticamente según tu hardware de entrada original.
              </p>
            </div>

            {/* Interactive Component Price Checker Widget */}
            <div className="w-full md:w-80 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar precios de repuestos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2626] ${
                    darkTheme ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700' : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-200 shadow-sm'
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Instant Search Dropdown Match */}
              {searchQuery && (
                <div className={`absolute left-0 right-0 mt-2 p-2 rounded-xl shadow-2xl z-30 border ${
                  darkTheme ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
                }`}>
                  <div className="flex gap-1.5 mb-2 border-b border-gray-800 pb-1.5">
                    <button onClick={() => setSearchCategory('all')} className={`px-2 py-0.5 rounded text-[10px] ${searchCategory === 'all' ? 'bg-[#dc2626] text-white' : 'bg-gray-800 text-gray-400'}`}>Todos</button>
                    <button onClick={() => setSearchCategory('cpu')} className={`px-2 py-0.5 rounded text-[10px] ${searchCategory === 'cpu' ? 'bg-[#dc2626] text-white' : 'bg-gray-800 text-gray-400'}`}>CPU</button>
                    <button onClick={() => setSearchCategory('gpu')} className={`px-2 py-0.5 rounded text-[10px] ${searchCategory === 'gpu' ? 'bg-[#dc2626] text-white' : 'bg-gray-800 text-gray-400'}`}>GPU</button>
                    <button onClick={() => setSearchCategory('mobo')} className={`px-2 py-0.5 rounded text-[10px] ${searchCategory === 'mobo' ? 'bg-[#dc2626] text-white' : 'bg-gray-800 text-gray-400'}`}>Placa</button>
                  </div>
                  {filteredSearchList.length === 0 ? (
                    <p className="text-[11px] text-gray-500 text-center py-2 font-mono">No se encontraron piezas registradas</p>
                  ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {filteredSearchList.map(item => (
                        <div key={item.id} className={`p-2 rounded-lg text-xs flex justify-between items-center transition-all ${darkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span className="text-[10px] bg-red-600/10 text-[#dc2626] border border-red-500/20 px-1 py-0.2 rounded font-mono uppercase text-[9px]">{item.type}</span>
                              <span className="truncate max-w-[140px]">{item.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">{item.spec}</span>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <span className="text-red-500 font-bold font-mono text-xs">S/ {item.price}</span>
                            <button
                              onClick={() => {
                                // Add component direct to propose select based on type
                                if (item.type === 'CPU') {
                                  setCurrentCpu(item.id);
                                } else if (item.type === 'GPU') {
                                  setCurrentGpu(item.id);
                                } else if (item.type === 'Placa Madre') {
                                  setCurrentMobo(item.id);
                                }
                                showNotification(`Componente ${item.name} seleccionado.`);
                                setSearchQuery('');
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white rounded p-1 transition-all text-[10px] font-bold"
                              title="Cargar en mesa"
                            >
                              Cargar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN PAGE WORKSPACE --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* MAIN HARDWARE CONFIGURATION AREA */}
          <div className="space-y-8">
            
            {/* GRID CONTAINER FOR SIDE-BY-SIDE STEP 1 & STEP 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">

              {/* STEP 1: CURRENT SYSTEM SCHEMATICS */}
              <section className={`rounded-2xl border transition-all p-5 md:p-6 ${darkTheme ? 'bg-[#111827] border-gray-800 shadow-xl' : 'bg-white border-gray-200 shadow-md'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center font-bold font-display text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider font-display text-gray-900 dark:text-white">
                      TU PC ACTUAL / EQUIPO BASE
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selecciona el hardware físico que tienes actualmente instalado en tu gabinete.</p>
                  </div>
                </div>

                {/* Apply Gamer preset trigger */}
                <button
                  type="button"
                  onClick={applyAllRecommendations}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600/10 text-[#dc2626] hover:bg-[#dc2626] hover:text-white text-xs font-bold border border-red-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Asistente Gamer Élite
                </button>
              </div>

              {/* CURRENT HARDWARE ENTRY GRID */}
              <div className="space-y-4">
                
                {/* CPU current selection */}
                <div className={`p-3.5 rounded-xl transition-all ${darkTheme ? 'bg-gray-900/40 hover:bg-gray-900/80' : 'bg-gray-100/50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs font-bold font-mono tracking-wider text-gray-400 uppercase w-20">PROCESADOR:</span>
                      <div className="flex-1">
                        <select 
                          id="currentCpu" 
                          value={currentCpu}
                          onChange={(e) => setCurrentCpu(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          {Object.values(cpudb).map(cpu => (
                            <option key={cpu.id} value={cpu.id}>{cpu.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* CPU Status info diagnostics */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[10px] font-mono text-gray-400">
                        {cpudb[currentCpu]?.cores} | {cpudb[currentCpu]?.socket}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        cpudb[currentCpu]?.tier === 'green' ? 'bg-green-600/15 text-green-500' :
                        cpudb[currentCpu]?.tier === 'yellow' ? 'bg-yellow-600/15 text-yellow-500' :
                        cpudb[currentCpu]?.tier === 'orange' ? 'bg-orange-600/15 text-orange-500' :
                        'bg-red-600/15 text-red-500'
                      }`}>
                        {cpudb[currentCpu]?.tier === 'green' ? 'Alto' :
                         cpudb[currentCpu]?.tier === 'yellow' ? 'Medio' :
                         cpudb[currentCpu]?.tier === 'orange' ? 'Antiguo' : 'Crítico'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GPU current selection */}
                <div className={`p-3.5 rounded-xl transition-all ${darkTheme ? 'bg-gray-900/40 hover:bg-gray-900/80' : 'bg-gray-100/50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs font-bold font-mono tracking-wider text-gray-400 uppercase w-20">G. GRÁFICA:</span>
                      <div className="flex-1">
                        <select 
                          id="currentGpu" 
                          value={currentGpu}
                          onChange={(e) => setCurrentGpu(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          {Object.values(gpudb).map(gpu => (
                            <option key={gpu.id} value={gpu.id}>{gpu.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* GPU Status Info */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[10px] font-mono text-gray-400">
                        {gpudb[currentGpu]?.vram} | {gpudb[currentGpu]?.power}W
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        gpudb[currentGpu]?.tier === 'green' ? 'bg-green-600/15 text-green-500' :
                        gpudb[currentGpu]?.tier === 'yellow' ? 'bg-yellow-600/15 text-yellow-500' :
                        gpudb[currentGpu]?.tier === 'orange' ? 'bg-orange-600/15 text-orange-500' :
                        'bg-red-600/15 text-red-500'
                      }`}>
                        {gpudb[currentGpu]?.tier === 'green' ? 'Alto' :
                         gpudb[currentGpu]?.tier === 'yellow' ? 'Medio' :
                         gpudb[currentGpu]?.tier === 'orange' ? 'Bajo' : 'Crítico'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobo/Motherboard Current selection */}
                <div className={`p-3.5 rounded-xl transition-all ${darkTheme ? 'bg-gray-900/40 hover:bg-gray-900/80' : 'bg-gray-100/50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Database className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs font-bold font-mono tracking-wider text-gray-400 uppercase w-20">PLACA MADRE:</span>
                      <select 
                        value={currentMobo}
                        onChange={(e) => setCurrentMobo(e.target.value)}
                        className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                          darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        {Object.values(mobodb).map(mobo => (
                          <option key={mobo.id} value={mobo.id}>{mobo.name} - Socket {mobo.socket}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[10.5px] font-mono text-gray-500 dark:text-gray-400 self-end sm:self-auto">
                      Soporta {mobodb[currentMobo]?.ramType} | Chipset {mobodb[currentMobo]?.chipset}
                    </span>
                  </div>
                </div>

                {/* RAM memory selection */}
                <div className={`p-3.5 rounded-xl transition-all ${darkTheme ? 'bg-gray-900/40 hover:bg-gray-900/80' : 'bg-gray-100/50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Layers className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs font-bold font-mono tracking-wider text-gray-400 uppercase w-20">MEMORIA RAM:</span>
                      <select 
                        value={currentRam}
                        onChange={(e) => setCurrentRam(e.target.value)}
                        className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                          darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        {Object.values(ramdb).map(ram => (
                          <option key={ram.id} value={ram.id}>{ram.name}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[10.5px] font-mono text-gray-500 dark:text-gray-400 self-end sm:self-auto">
                      Tipo: {ramdb[currentRam]?.type} - {ramdb[currentRam]?.speed}
                    </span>
                  </div>
                </div>

                {/* Disk capacity storage selection */}
                <div className={`p-3.5 rounded-xl transition-all ${darkTheme ? 'bg-gray-900/40 hover:bg-gray-900/80' : 'bg-gray-100/50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <HardDrive className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <span className="text-xs font-bold font-mono tracking-wider text-gray-400 uppercase w-20">ALMACENAR:</span>
                      <select 
                        value={currentStorage}
                        onChange={(e) => setCurrentStorage(e.target.value)}
                        className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${
                          darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <option value="">— Sin almacenamiento adicional —</option>
                        {Object.values(storagedb).map(st => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* STEP 2: PROPOSED UPGRADE PATHS SCHEMATICS */}
            <section className={`rounded-2xl border transition-all p-5 md:p-6 ${darkTheme ? 'bg-[#111827] border-gray-800 shadow-xl' : 'bg-white border-gray-200 shadow-md'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-800/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center font-bold font-display text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider font-display text-gray-900 dark:text-white">
                      TU NUEVA PC PROPUESTA DE UPGRADE
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Determina qué piezas quieres reemplazar. Las sugerencias inteligentes reducen incompatibilidades.</p>
                  </div>
                </div>

                {/* Proposed list filters */}
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl self-start md:self-auto border border-gray-200 dark:border-gray-850">
                  <button 
                    onClick={() => setUpgradeFilter('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${upgradeFilter === 'all' ? 'bg-[#dc2626] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-[#dc2626]'}`}
                  >
                    S/ Cambio
                  </button>
                  <button 
                    onClick={() => setUpgradeFilter('nueva')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${upgradeFilter === 'nueva' ? 'bg-[#dc2626] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-[#dc2626]'}`}
                  >
                    Sólo Nuevas
                  </button>
                </div>
              </div>

              {/* DYNAMIC UPGRADE INPUTS MATRIX */}
              <div className="space-y-4">
                
                {/* UPGRADE CPU selection */}
                {componentsToUpgradeMatchesSearch(upgradeCpu) && (
                  <div className={`p-4 rounded-xl border transition-all ${
                    upgradeCpu !== 'none' 
                      ? 'bg-red-50/20 dark:bg-red-950/10 border-red-500/20' 
                      : 'bg-transparent border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Cpu className={`w-5 h-5 ${upgradeCpu !== 'none' ? 'text-[#dc2626]' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-[#dc2626] w-20">Procesador:</span>
                        <select 
                          id="upgradeCpu" 
                          value={upgradeCpu}
                          onChange={(e) => handleUpgradeCpuChange(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <option value="none">Mismo procesador (Sin Cambio)</option>
                          {Object.values(cpudb)
                            .filter(cpu => cpu.id !== currentCpu)
                            .map(cpu => (
                              <option key={cpu.id} value={cpu.id}>Nuevo: {cpu.name} - S/ {cpu.price}</option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        {upgradeCpu !== 'none' && (
                          <span className="text-sm font-bold font-mono text-green-500">
                            S/ {cpudb[upgradeCpu]?.price}
                          </span>
                        )}
                        <button 
                          onClick={() => setUpgradeCpu('i9-14900K')}
                          className="px-2 py-1 bg-[#dc2626] text-white rounded text-[10px] font-bold"
                        >
                          Elegir Élite
                        </button>
                        <button 
                          onClick={() => setUpgradeCpu('none')}
                          className="text-[10px] uppercase text-gray-400 hover:text-white font-mono font-bold"
                        >
                          Ignorar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPGRADE GPU selection */}
                {componentsToUpgradeMatchesSearch(upgradeGpu) && (
                  <div className={`p-4 rounded-xl border transition-all ${
                    upgradeGpu !== 'none' 
                      ? 'bg-red-50/20 dark:bg-red-950/10 border-red-500/20' 
                      : 'bg-transparent border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Layers className={`w-5 h-5 ${upgradeGpu !== 'none' ? 'text-[#dc2626]' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-[#dc2626] w-20">G. Gráfica:</span>
                        <select 
                          id="upgradeGpu" 
                          value={upgradeGpu}
                          onChange={(e) => setUpgradeGpu(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <option value="none">Misma tarjeta de video (Sin Cambio)</option>
                          {Object.values(gpudb)
                            .filter(gpu => gpu.id !== currentGpu)
                            .map(gpu => (
                              <option key={gpu.id} value={gpu.id}>Nueva: {gpu.name} - S/ {gpu.price}</option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        {upgradeGpu !== 'none' && (
                          <span className="text-sm font-bold font-mono text-green-500">
                            S/ {gpudb[upgradeGpu]?.price}
                          </span>
                        )}
                        <button 
                          onClick={() => setUpgradeGpu('RTX-4080-SUPER')}
                          className="px-2 py-1 bg-[#dc2626] text-white rounded text-[10px] font-bold"
                        >
                          Elegir Élite
                        </button>
                        <button 
                          onClick={() => setUpgradeGpu('none')}
                          className="text-[10px] uppercase text-gray-400 hover:text-white font-mono font-bold"
                        >
                          Ignorar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPGRADE PLACA/MOTHERBOARD selection */}
                {componentsToUpgradeMatchesSearch(upgradeMobo) && (
                  <div className={`p-4 rounded-xl border transition-all ${
                    upgradeMobo !== 'none' 
                      ? 'bg-red-50/20 dark:bg-red-950/10 border-red-500/20' 
                      : 'bg-transparent border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Database className={`w-5 h-5 ${upgradeMobo !== 'none' ? 'text-[#dc2626]' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-[#dc2626] w-20">Placa Madre:</span>
                        <select 
                          id="upgradeMobo" 
                          value={upgradeMobo}
                          onChange={(e) => handleUpgradeMoboChange(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-550 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <option value="none">Misma placa actual (Sin Cambio)</option>
                          {Object.values(mobodb)
                            .filter(mobo => mobo.id !== currentMobo)
                            .map(mobo => (
                              <option key={mobo.id} value={mobo.id}>Nueva: {mobo.name} - S/ {mobo.price}</option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        {upgradeMobo !== 'none' && (
                          <span className="text-sm font-bold font-mono text-green-500">
                            S/ {mobodb[upgradeMobo]?.price}
                          </span>
                        )}
                        <button 
                          onClick={() => setUpgradeMobo('none')}
                          className="text-[10px] uppercase text-gray-400 hover:text-white font-mono font-bold"
                        >
                          Ignorar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPGRADE RAM module selection */}
                {componentsToUpgradeMatchesSearch(upgradeRam) && (
                  <div className={`p-4 rounded-xl border transition-all ${
                    upgradeRam !== 'none' 
                      ? 'bg-red-50/20 dark:bg-red-950/10 border-red-500/20' 
                      : 'bg-transparent border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <Layers className={`w-5 h-5 ${upgradeRam !== 'none' ? 'text-[#dc2626]' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-[#dc2626] w-20">Módulos RAM:</span>
                        <select 
                          id="upgradeRam" 
                          value={upgradeRam}
                          onChange={(e) => setUpgradeRam(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <option value="none">Mismos módulos RAM (Sin Cambio)</option>
                          {Object.values(ramdb)
                            .filter(ram => ram.id !== currentRam)
                            .map(ram => (
                              <option key={ram.id} value={ram.id}>Nuevos: {ram.name} - S/ {ram.price}</option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        {upgradeRam !== 'none' && (
                          <span className="text-sm font-bold font-mono text-green-500">
                            S/ {ramdb[upgradeRam]?.price}
                          </span>
                        )}
                        <button 
                          onClick={() => setUpgradeRam('none')}
                          className="text-[10px] uppercase text-gray-400 hover:text-white font-mono font-bold"
                        >
                          Ignorar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPGRADE Disk storage selection */}
                {componentsToUpgradeMatchesSearch(upgradeStorage) && (
                  <div className={`p-4 rounded-xl border transition-all ${
                    upgradeStorage !== '' 
                      ? 'bg-red-50/20 dark:bg-red-950/10 border-red-500/20' 
                      : 'bg-transparent border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1">
                        <HardDrive className={`w-5 h-5 ${upgradeStorage !== '' ? 'text-[#dc2626]' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold font-mono tracking-wider uppercase text-[#dc2626] w-20">Almacenamiento:</span>
                        <select 
                          id="upgradeStorage" 
                          value={upgradeStorage}
                          onChange={(e) => setUpgradeStorage(e.target.value)}
                          className={`w-full max-w-sm px-3 py-1.5 text-xs font-mono font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500 ${
                            darkTheme ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <option value="">Sin Almacenamiento Adicional</option>
                          {Object.values(storagedb)
                            .filter(st => st.id !== currentStorage)
                            .map(st => (
                              <option key={st.id} value={st.id}>Instalar: {st.name} - S/ {st.price}</option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 justify-end">
                        {upgradeStorage !== '' && (
                          <span className="text-sm font-bold font-mono text-green-500">
                            S/ {storagedb[upgradeStorage]?.price}
                          </span>
                        )}
                        <button 
                          onClick={() => setUpgradeStorage('')}
                          className="text-[10px] uppercase text-gray-400 hover:text-white font-mono font-bold"
                        >
                          Ignorar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          </div>

            {/* LIVE DIAGNOSTICS & TELEMETRY ROADMAP BAR */}
            <section className={`rounded-2xl border transition-all p-5 md:p-6 ${darkTheme ? 'bg-[#111827] border-gray-800 shadow-xl' : 'bg-white border-gray-200 shadow-md'}`}>
              
              {/* Traffic Signal light and power meter header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800/20 pb-4 mb-4">
                  
                  {/* Traffic light representation with styling */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-gray-500">COMPATIBLE:</span>
                    <div className="flex items-center gap-2 bg-[#0b0f19] py-1.5 px-3 rounded-full border border-gray-800">
                      
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        compatibilityDiagnostics.severity === 'success' 
                          ? 'bg-green-500 shadow-lg shadow-green-500/80 scale-110' 
                          : 'bg-green-950 opacity-40'
                      }`} title="Sinergia óptima" />
                      
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        compatibilityDiagnostics.severity === 'warning' 
                          ? 'bg-yellow-400 shadow-lg shadow-yellow-500/80 scale-110' 
                          : 'bg-yellow-950 opacity-40'
                      }`} title="Cuello leve" />

                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        compatibilityDiagnostics.severity === 'orange' 
                          ? 'bg-orange-500 shadow-lg shadow-orange-500/80 scale-110' 
                          : 'bg-orange-950 opacity-40'
                      }`} title="Limitación alta" />

                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        compatibilityDiagnostics.severity === 'error' 
                          ? 'bg-red-600 shadow-lg shadow-red-600/80 scale-110' 
                          : 'bg-red-950 opacity-40'
                      }`} title="Incompatibilidad física" />
                    </div>
                  </div>

                  {/* Calculated PSU output rating info */}
                  <div className="flex items-center gap-2 text-xs font-mono font-bold bg-[#dc2626]/10 text-[#dc2626] border border-red-500/20 py-1.5 px-3 rounded-lg">
                    <Flame className="w-4 h-4 animate-bounce" />
                    <span>Calculadora Fuente recomendada: {compatibilityDiagnostics.psuRecommend}W 80 PLUS</span>
                  </div>
                </div>

                {/* BOTTLENECK DETECTOR AND PROGRESS METERS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400">Cuello de Botella del Sistema de Destino:</span>
                    <span className={`font-bold uppercase ${
                      compatibilityDiagnostics.severity === 'success' ? 'text-green-500' :
                      compatibilityDiagnostics.severity === 'warning' ? 'text-yellow-400' :
                      compatibilityDiagnostics.severity === 'orange' ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {compatibilityDiagnostics.bottleneckScore}% {compatibilityDiagnostics.severity === 'success' ? 'Insignificante' : 'Significativo'}
                    </span>
                  </div>

                  {/* Progress bar representing bottleneck score */}
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        compatibilityDiagnostics.severity === 'success' ? 'bg-green-500' :
                        compatibilityDiagnostics.severity === 'warning' ? 'bg-yellow-400' :
                        compatibilityDiagnostics.severity === 'orange' ? 'bg-orange-500' : 'bg-red-600'
                      }`} 
                      style={{ width: `${compatibilityDiagnostics.bottleneckScore}%` }}
                    />
                  </div>
                  
                  {/* Explanatory text */}
                  <p className="text-xs font-mono bg-black/20 p-3 rounded-lg dark:text-gray-300 border border-gray-800/10">
                    {compatibilityDiagnostics.bottleneckText}
                  </p>

                  {/* Warnings alert panel if issues arise */}
                  {compatibilityDiagnostics.warnings.length > 0 && (
                    <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-500 font-mono space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                        <span>¡Se detectaron incidentes técnicos críticos!</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {compatibilityDiagnostics.warnings.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CART AND PRESETS INTEGRATIONS BUTTONS */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-gray-800/20">
                  <button
                    onClick={addPropuestosToCart}
                    className="w-full py-3 bg-[#dc2626] hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 transition-all border border-red-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    Cotizar Nuevos Componentes
                  </button>

                  <button
                    onClick={executeSimulation}
                    disabled={isSimulating}
                    className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all border ${
                      darkTheme
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                        : 'bg-gray-200 border-gray-300 hover:bg-gray-350 text-gray-800'
                    }`}
                  >
                    {isSimulating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
                        <span>Simulando Hardware...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-[#dc2626] fill-[#dc2626]" />
                        <span>Simular Rendimiento en Juegos</span>
                      </>
                    )}
                  </button>
                </div>
            </section>

            {/* STEP 3: CONSOLE PERFORMANCE SIMULATION (DYNAMIC COMPARED GRAPH) */}
            <section className={`rounded-2xl border transition-all p-5 md:p-6 ${darkTheme ? 'bg-[#111827] border-gray-800 shadow-xl' : 'bg-white border-gray-200 shadow-md'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center font-bold font-display text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider font-display text-gray-900 dark:text-white">
                      SIMULADOR DE FOTOGRAMAS (FPS METRICS)
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Verifica cómo se traducen los cambios de componentes directamente en tus juegos favoritos.</p>
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-green-500/15 text-green-500 px-2 py-0.5 rounded border border-green-500/20 font-bold">
                        PassMarkScraper conectado: Benchmark Mark verificado en tiempo real
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resolution selector */}
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl self-start sm:self-auto border border-gray-200 dark:border-gray-800">
                  {(['1080p', '1440p', '4k'] as const).map(res => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`px-3 py-1 text-[10.5px] uppercase font-mono font-bold rounded-lg transition-all ${
                        resolution === res 
                          ? 'bg-[#dc2626] text-white shadow-md' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* COMPARATIVE GRAPHS INSIDE TELEMETRY BODY */}
              <div className="space-y-6">
                
                {simulatedFPS.map((game, index) => {
                  const maxFps = Math.max(140, game.upgradeFps, game.currentFps);
                  const currentPercent = (game.currentFps / maxFps) * 100;
                  const upgradePercent = (game.upgradeFps / maxFps) * 100;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold tracking-tight text-gray-900 dark:text-gray-100">{game.name}</span>
                        {game.increase > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-bold">
                            +{game.increase}% FPS Gain
                          </span>
                        )}
                      </div>

                      {/* Side-by-side comparative bars representing FPS stats */}
                      <div className="space-y-1.5 bg-black/15 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-800/10">
                        {/* Current hardware bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-gray-500">
                            <span>Mesa Base Actual:</span>
                            <span className="font-bold text-gray-400">{game.currentFps} FPS</span>
                          </div>
                          <div className="w-full bg-gray-800/60 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gray-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${currentPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Merged upgraded proposed hardware bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#dc2626]">
                            <span>Propuesta con Upgrade:</span>
                            <span className="font-bold text-red-500">{game.upgradeFps} FPS</span>
                          </div>
                          <div className="w-full bg-gray-800/60 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#dc2626] h-full rounded-full transition-all duration-500"
                              style={{ width: `${upgradePercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="text-[11px] font-mono p-3 rounded-lg bg-red-650/10 text-gray-500 dark:text-gray-400 border border-gray-800/15 flex items-start gap-2">
                  <Info className="w-4 .5 h-4.5 flex-shrink-0 text-[#dc2626]" />
                  <span>Estimación referencial certificada bajo APIs del sector técnico. El rendimiento exacto depende del resto de piezas físicas, overclocking térmico, y controladores del sistema operativo.</span>
                </div>
              </div>
            </section>

            {/* SAVE CUSTOM HARDWARE COMBINATION SLOTS */}
            <section className={`rounded-2xl border transition-all p-5 md:p-6 mb-8 ${darkTheme ? 'bg-[#111827] border-gray-800 shadow-xl' : 'bg-white border-gray-200 shadow-md'}`}>
              <h3 className="text-sm font-black uppercase tracking-wider font-mono text-gray-450 mb-3 flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-[#dc2626]" />
                Guardar Simulación Local (Mesa de trabajo)
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Ej. Mi PC Gamer 2026, Upgrade de Juan..."
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className={`flex-1 px-4 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#dc2626] ${
                    darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-855 placeholder-gray-400'
                  }`}
                />
                <button
                  onClick={saveCurrentBuildPlan}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  Guardar Plan
                </button>
              </div>

              {/* SAVED SLOTS GRID */}
              {savedBuilds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800/20 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Simulaciones Guardadas:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedBuilds.map(sb => (
                      <div
                        key={sb.id}
                        onClick={() => loadSavedBuild(sb.setup)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between hover:scale-[1.01] ${
                          darkTheme 
                            ? 'bg-gray-900/60 border-gray-800 hover:border-red-500/35 hover:bg-gray-900' 
                            : 'bg-white border-gray-200 hover:border-red-500/35 hover:bg-gray-50'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{sb.name}</p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{sb.date}</span>
                        </div>
                        <button
                          onClick={(e) => deleteSavedBuild(sb.id, e)}
                          className="p-1 rounded bg-transparent hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                          title="Eliminar simulación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

          </div>

          {/* --- BOTTOM SECTION: SHOPPING CART & INVOICE BELOW COMPONENTS --- */}
          <div className="border-t border-gray-800/15 pt-8 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" id="quote-invoice-cart">
              
              {/* CART AND INVOICE VALUES (SPANS 2 COLS FOR MAGNIFICENT LEGIBILITY OF HARDWARE NAMES) */}
              <div className="lg:col-span-2 space-y-6">
                <div className={`rounded-2xl border transition-all p-5 md:p-6 ${darkTheme ? 'bg-[#111827] border-gray-850 shadow-2xl' : 'bg-white border-gray-200 shadow-lg'}`}>
              
              {/* Box Title */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800/20">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#dc2626]" />
                  <h3 className="text-base font-extrabold tracking-tight font-display text-gray-900 dark:text-white">
                    CARRITO DE COMPRAS
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="text-[11px] font-mono text-gray-400 hover:text-red-500 bg-transparent py-0.5 px-2 rounded hover:bg-red-500/5 transition-all"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* CART ITEMS ROADWAY */}
              <div className="space-y-3 min-h-[140px] max-h-[300px] overflow-y-auto mb-4 pr-1">
                {cart.length === 0 ? (
                  <div className="h-[140px] flex flex-col items-center justify-center text-center p-3 text-gray-400">
                    <ShoppingCart className="w-8 h-8 text-gray-600 mb-2 animate-bounce" />
                    <p className="text-xs font-mono font-bold">Tu cotización está de momento vacía.</p>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">Carga componentes arriba y presiona "Cotizar Nuevos Componentes" para valorizarlos.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-2.5 rounded-lg text-xs flex justify-between items-center transition-all ${
                          darkTheme ? 'bg-gray-900/60 border border-gray-800/40' : 'bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex-1 pr-2 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono px-1 bg-red-600/10 text-[#dc2626] rounded border border-red-500/15 uppercase font-bold">{item.type}</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100 truncate block max-w-[120px] md:max-w-none">{item.name}</span>
                          </div>
                          <span className="text-xs text-red-500 font-mono font-bold block mt-0.5">
                            S/ {item.price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded bg-transparent hover:bg-red-500/10 transition-all flex-shrink-0"
                          title="Eliminar del presupuesto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PROMO COUPON SYSTEM */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-gray-800/20 pb-4">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupón de Descuento"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg uppercase focus:outline-none focus:ring-1 focus:ring-red-500 ${
                        darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponError && <p className="text-[10px] text-red-500 font-mono mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-[10.5px] text-green-500 font-mono mt-1 font-bold">{couponSuccess}</p>}
                </div>
              )}

              {/* QUOTE PRICING BREAKDOWN */}
              <div className="pt-4 border-t border-gray-800/20 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400">Subtotal de Piezas:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">S/ {cartSubtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400">IGV (18% incluido):</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">S/ {cartIGV.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-xs font-mono text-green-500">
                    <span>Descuento aplicado ({appliedDiscount}%):</span>
                    <span className="font-bold">-S/ {cartDiscountVal.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-800/40 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">Monto Total Soles:</span>
                  <div className="text-right">
                    <span className="text-xl md:text-2xl font-black font-mono text-[#dc2626]">
                      S/ {cartTotalSum.toFixed(2)}
                    </span>
                    <p className="text-[9px] text-gray-400 uppercase tracking-tight">Tipo de Cambio referencial incluido</p>
                  </div>
                </div>
              </div>

              {/* ACTION: PROCEED TO PAYMENT */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (cart.length === 0) {
                      showNotification('El carrito está vacío. Añade componentes para comprar.');
                      return;
                    }
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-red-650 to-[#dc2626] hover:from-red-600 hover:to-red-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-600/10 hover:scale-[1.01] hover:shadow-red-600/20 active:scale-[0.99] transition-all border border-red-500/30 uppercase tracking-wider"
                >
                  <CreditCard className="w-4 h-4 animate-bounce" />
                  Proceder al Pago Seguro
                </button>
              </div>

              {/* Guarantees certified badge and graphics */}
              <div className="mt-4 flex items-center gap-2 justify-center text-[10px] text-gray-400 font-mono text-center">
                <span>🛡️ Envíos Certificados Achorao de 24 horas a todo el Perú</span>
              </div>

              </div>
            </div>

            {/* SIDE COLUMN: COOP/GUIDES (SPANS 1 COL) */}
            <div className="lg:col-span-1 space-y-6">
              {/* PRESETS HARDWARE DECISION CHEATSHEET */}
              <div className={`p-5 rounded-2xl border transition-all ${darkTheme ? 'bg-[#111827] border-gray-850' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h4 className="text-xs font-black uppercase tracking-wider font-mono text-red-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Guía Intelectual Express
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-150">🚨 ¿Cuándo cambiar de Placa Madre?</p>
                    <p className="text-gray-400 text-xs mt-0.5">Si saltas de DDR4 a DDR5, o si cambias de socket (LGA1200 en 10ª gen a LGA1700 en 14ª gen, o a AM5 en AMD Ryzens).</p>
                  </div>
                  <div className="pt-2.5 border-t border-gray-800/20">
                    <p className="font-bold text-gray-900 dark:text-gray-150">📈 Mitigar el cuello de botella</p>
                    <p className="text-gray-400 text-xs mt-0.5">Evita emparejar una GPU de tope de gama militar con un procesador de hace 5 años. Las caídas térmicas y stuttering arruinarán tus FPS.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>

      {/* --- MODAL 1: CHECKOUT CRYPTO & FIAT SECURE GATEWAY --- */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeReceiptAndReset}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto ${
                darkTheme ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              
              {/* Close Button top-right */}
              <button 
                onClick={closeReceiptAndReset}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Receipt output view once checkout completes */}
              {receiptOrder ? (
                <div className="space-y-5 py-4">
                  
                  {/* Authorized Shield Emblem */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-3 border border-green-500/20 animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-green-500 uppercase">
                      ¡PAGO AUTORIZADO CON ÉXITO!
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Tu pedido de hardware ha sido registrado bajo prioridad militar.</p>
                  </div>

                  {/* Receipt breakdown */}
                  <div className={`p-4 rounded-xl border font-mono text-xs space-y-3 ${darkTheme ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Orden ID:</span>
                      <span className="font-bold text-gray-300">{receiptOrder.orderNumber}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Cliente:</span>
                      <span className="font-bold text-gray-200">{receiptOrder.customerName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha de Procesamiento:</span>
                      <span className="text-gray-300">{receiptOrder.date}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-800/40 space-y-1.5">
                      <span className="text-gray-500 block">Artículos cotizados:</span>
                      {receiptOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[11px] pl-2 hover:bg-gray-800/40 p-0.5 rounded">
                          <span className="text-gray-400 truncate max-w-[200px]">• [{item.type}] {item.name}</span>
                          <span className="text-red-500">S/ {item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2.5 border-t border-gray-800 flex justify-between items-center text-sm font-bold">
                      <span className="uppercase text-[#dc2626]">Total Facturado:</span>
                      <span className="text-red-500 text-base font-black">S/ {receiptOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-red-500/5 p-4 rounded-xl text-xs text-gray-400 text-center border border-red-500/10">
                    <p>📦 Recibirás un correo electrónico automático con los datos de cobro y el código de despacho del courier.</p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={closeReceiptAndReset}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all uppercase"
                    >
                      Aceptar y Volver al Simulador
                    </button>
                  </div>

                </div>
              ) : (
                
                /* PAYMENT FORM VIEW */
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider mb-2 font-display text-gray-900 dark:text-white flex items-center gap-1.5">
                    <CreditCard className="w-5 h-5 text-[#dc2626]" /> 
                    AUTORIZAR PAGO SEGURO PERÚ
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">Cotiza de forma real con tarjetas de débito/crédito, transferencias y pasarela express.</p>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    
                    {/* Holder email address */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-gray-400 block">Dirección de Correo:</label>
                      <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#dc2626] ${
                          darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-855'
                        }`}
                      />
                    </div>

                    {/* Holder Full name */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-gray-400 block">Nombre del Titular de Tarjeta:</label>
                      <input
                        type="text"
                        placeholder="JUAN PEREZ GONZALES"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        required
                        className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#dc2626] ${
                          darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-855'
                        }`}
                      />
                    </div>

                    {/* Card Numbers input */}
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase font-mono font-bold text-gray-400 block">Número de Tarjeta de Crédito:</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4557 •••• •••• 8890"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                          required
                          className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#dc2626] ${
                            darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-855'
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                          Visa / Mastercard
                        </div>
                      </div>
                    </div>

                    {/* Expiry and CVV inline inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10.5px] uppercase font-mono font-bold text-gray-400 block">Vencimiento (MM/AA):</label>
                        <input
                          type="text"
                          placeholder="12/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          required
                          className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#dc2626] ${
                            darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-855'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10.5px] uppercase font-mono font-bold text-gray-400 block">Cod. de Seguridad (CVV):</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          required
                          className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#dc2626] ${
                            darkTheme ? 'bg-gray-900 border border-gray-800 text-white placeholder-gray-500' : 'bg-white border border-gray-300 text-gray-855'
                          }`}
                        />
                      </div>

                    </div>

                    {/* Real totals visual metrics */}
                    <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Presupuesto original:</span>
                        <span className="text-gray-300 font-bold">S/ {cartSubtotal.toFixed(2)}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-green-500">
                          <span>Descuento cupón:</span>
                          <span className="font-bold">-S/ {cartDiscountVal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold border-t border-gray-800 pt-1.5 text-[#dc2626]">
                        <span>Monto final a descontar:</span>
                        <span>S/ {cartTotalSum.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={closeReceiptAndReset}
                        className={`flex-1 py-1 px-4 text-xs font-bold rounded-xl transition-all ${
                          darkTheme ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-150 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Confirmar Pago</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: PAST ORDERS HISTORY / DOWNLOAD RECEIPT INDEX --- */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-xl rounded-2xl border shadow-2xl p-6 ${
                darkTheme ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-855'
              }`}
            >
              
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-extrabold uppercase tracking-wider font-display mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <History className="w-5 h-5 text-[#dc2626]" />
                HISTORIAL DE COTIZACIONES ADQUIRIDAS
              </h3>

              {orderHistory.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Coins className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-xs font-mono font-bold text-gray-400">No registras compras en tu sesión local de navegador.</p>
                  <p className="text-[10px] text-gray-500">Completa una compra a través del carrito simulado y regresa aquí.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {orderHistory.map(order => (
                    <div 
                      key={order.orderNumber} 
                      className={`p-4 rounded-xl border font-mono text-xs ${
                        darkTheme ? 'bg-gray-900/60 border-gray-800/80 hover:bg-gray-900' : 'bg-gray-100 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
                        <span className="font-bold text-[#dc2626] font-mono">{order.orderNumber}</span>
                        <span className="text-[10.5px] text-gray-400">{order.date}</span>
                      </div>

                      <div className="space-y-1 my-2">
                        <p className="text-[11px] text-gray-400"><span className="font-bold">Cliente:</span> {order.customerName}</p>
                        <p className="text-[11px] text-gray-400"><span className="font-bold">Componentes:</span></p>
                        <div className="space-y-1 pl-2">
                          {order.items.map((it, i) => (
                            <span key={i} className="block text-[11px] text-gray-300">• [{it.type}] {it.name} - S/ {it.price}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-800/40">
                        <span className="font-bold text-gray-400">Total Facturado:</span>
                        <span className="text-red-500 font-bold text-xs">S/ {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Cerrar Historial
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SITE FOOTER METRICS --- */}
      <footer className={`py-8 mt-auto transition-colors duration-300 border-t ${
        darkTheme ? 'bg-gray-950 border-gray-850 text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Tech taglines */}
            <div className="flex items-center gap-2">
              <span className="bg-[#dc2626] w-2 h-2 rounded-full animate-ping" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-gray-450">
                ACHORAO SISTEMAS DE ALTO RENDIMIENTO © {new Date().getFullYear()}
              </p>
            </div>

            {/* Support message */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span>Desarrollado bajo tecnología de Inteligencia de Hardware v3.9</span>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
