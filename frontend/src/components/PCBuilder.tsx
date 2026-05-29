import { ArrowLeft, ArrowRight, Cpu, Disc, HardDrive, Layers, Monitor, Plus, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Product } from "../types";

interface ArmaTuPCProps {
  onAddToCart: (product: Product) => void;
}

interface PredefinedComponent {
  name: string;
  price: number;
  image: string;
  details: string;
  score?: number;
  platform?: "intel" | "amd" | "all";
}

// Catálogo de componentes predefinidos con imágenes, precios y estadísticas exactas.
const DEF_CPUS: { intel: PredefinedComponent[]; amd: PredefinedComponent[] } = {
  intel: [
    {
      name: "Intel Core i3-12100",
      price: 450.0,
      image: "https://i.ebayimg.com/images/g/Ky0AAeSwPZBp2UL0/s-l1600.webp",
      details: "4 Cores, 8 Threads @ 3.3GHz | TDP 60W | LGA1700",
      score: 13800,
    },
    {
      name: "Intel Core i5-12400F",
      price: 680.0,
      image: "https://http2.mlstatic.com/D_NQ_NP_752066-MPE111514623255_052026-O.webp",
      details: "6 Cores, 12 Threads @ 2.5GHz | TDP 65W | LGA1700",
      score: 19500,
    },
    {
      name: "Intel Core i7-13700K",
      price: 1690.0,
      image: "https://www.pakbyte.pk/cdn/shop/files/Intel-Core-I7-13700K-Desktop-Processor-PakByte-Computers-24397643972675.webp?v=1753680611",
      details: "16 Cores, 24 Threads @ 3.4GHz | TDP 125W | LGA1700",
      score: 46500,
    },
    {
      name: "Intel Core i9-14900K",
      price: 2590.0,
      image: "https://compuvisionperu.pe/public/img/productos/d90q5gUm0WR0ZC9lid6XCYpej1rhhCbACSr8yCkpY1gy4gZd9W0CufgTXO15QT6TmnRaq2GFtn3oJTHJ.jpg",
      details: "24 Cores, 32 Threads @ 3.2GHz | TDP 125W | LGA1700",
      score: 60800,
    },
  ],
  amd: [
    {
      name: "Ryzen 5 3600",
      price: 390.0,
      image: "https://media.falabella.com/falabellaPE/133734185_01/w=1500,h=1500,fit=cover",
      details: "6 Cores, 12 Threads @ 3.6GHz | TDP 65W | AM4",
      score: 17800,
    },
    {
      name: "AMD Ryzen 5 5600X",
      price: 720.0,
      image: "https://sahuaperu.com.pe/wp-content/uploads/2025/03/RYZEN-5-5600X-C1-768x768.png",
      details: "6 Cores, 12 Threads @ 3.7GHz | TDP 65W | AM4",
      score: 21900,
    },
    {
      name: "AMD Ryzen 7 5700X",
      price: 950.0,
      image: "https://www.infotec.com.pe/59999-large_default/procesador-amd-ryzen-7-5700x-34ghz-32mb-100-100000926wof-am4.jpg",
      details: "8 Cores, 16 Threads @ 3.4GHz | TDP 65W | AM4",
      score: 26700,
    },
    {
      name: "AMD Ryzen 7 7800X3D",
      price: 1790.0,
      image: "https://arteus.pe/cdn/shop/files/100-100000910WOF-3_600x.jpg?v=1750889548",
      details: "8 Cores, 16 Threads @ 4.2GHz (3D V-Cache) | TDP 120W | AM5",
      score: 34300,
    },
    {
      name: "AMD Ryzen 9 7950X",
      price: 2790.0,
      image: "https://arteus.pe/cdn/shop/files/100-100000514WOF-3_600x.jpg?v=1750892706",
      details: "16 Cores, 32 Threads @ 4.5GHz | TDP 170W | AM5",
      score: 63200,
    },
  ],
};

const DEF_MOTHERBOARDS: { intel: PredefinedComponent[]; amd: PredefinedComponent[] } = {
  intel: [
    {
      name: "ASUS Prime B760M-A WiFi DDR5",
      price: 620.0,
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=85",
      details: "Chipset Intel B760 | Wifi Integrado | DDR5 AM5 ready | RGB Sync",
    },
    {
      name: "Gigabyte B760M DS3H DDR4",
      price: 480.0,
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=400&q=85",
      details: "Excelente opción de Entrada con soporte DDR4 dual-channel para ahorro",
    },
    {
      name: "MSI PRO Z790-A WiFi DDR5",
      price: 1150.0,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=85",
      details: "Chipset Premium Z790 | Soporte para Overclocking avanzado de generación 13/14",
    },
  ],
  amd: [
    {
      name: "ASUS TUF Gaming A620M-PLUS WiFi (AM5)",
      price: 549.9,
      image: "https://www.achorao.com/cdn/shop/files/asus-tarjeta-madre-motherboard-default-title-motherboard-asus-tuff-gaming-a620m-plus-wifi-am5-ddr5-197105164260-39065243058416.jpg?v=1754485565&width=360",
      details: "Chipset AMD AM5 | Listo para DDR5 de alta velocidad y procesadores Ryzen 7000+",
    },
    {
      name: "MSI B550M PRO-VDH WiFi (AM4)",
      price: 490.0,
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=85",
      details: "Chipset AM4 definitivo para Ryzens Serie 3000 y 5000 | Wi-Fi Integrado",
    },
    {
      name: "ASUS ROG STRIX X670E-F Gaming AM5",
      price: 1650.0,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=85",
      details: "Gama Ultra de ASUS ROG | PCIe 5.0 completo | Enfriamiento VRM premium",
    },
  ],
};

const DEF_RAMS: PredefinedComponent[] = [
  {
    name: "Corsair Vengeance LPX 16GB (1x16GB) DDR5 5200MHz",
    price: 290.0,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=400&q=85",
    details: "DDR5 de alto rendimiento, perfil bajo de refrigeración pasiva de aluminio",
  },
  {
    name: "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz",
    price: 230.0,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=400&q=85",
    details: "Canal dual DDR4 ultrarrápido con disipador asimétrico negro",
  },
  {
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    price: 590.0,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=85",
    details: "RGB Direccional programable iCUE | Alta velocidad DDR5 CL36",
  },
  {
    name: "G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz",
    price: 1190.0,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=85",
    details: "La opción de diseño y render profesional más extrema | Latencia CL32 ultrabaja",
  },
];

const DEF_GPUS: PredefinedComponent[] = [
  {
    name: "NVIDIA GTX 1650 4GB",
    price: 650.0,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
    details: "GPU compacta para entrada básica de esports y streaming ligero",
  },
  {
    name: "AMD Radeon RX 6600 8GB",
    price: 990.0,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
    details: "La reina indiscutible del valor costo/beneficio para juego competitivo en 1080p",
  },
  {
    name: "NVIDIA GeForce RTX 3060 12GB",
    price: 1390.0,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
    details: "Excelente VRAM de 12GB para modelado 3D, IA local y Ray Tracing medio",
  },
  {
    name: "NVIDIA GeForce RTX 4060 8GB",
    price: 1590.0,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
    details: "Arquitectura Ada Lovelace con DLSS 3 Frame Generation para duplicar FPS",
  },
  {
    name: "AMD Radeon RX 7800 XT 16GB",
    price: 2590.0,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
    details: "Rendimiento monstruoso en 1440p con generosa caché infinita",
  },
  {
    name: "NVIDIA GeForce RTX 4070 SUPER 12GB",
    price: 2990.0,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=85",
    details: "Alta tasa de FPS y Ray Tracing con trazado de rayos completo en 1440p",
  },
  {
    name: "NVIDIA GeForce RTX 4080 SUPER 16GB",
    price: 4890.0,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=85",
    details: "Nivel entusiasta supremo para juego masivo y creadores digitales en 4K",
  },
  {
    name: "NVIDIA GeForce RTX 4090 24GB",
    price: 8990.0,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=85",
    details: "La gráfica de consumo definitivo del planeta. 24GB de VRAM extrema",
  },
];

const DEF_STORAGES: PredefinedComponent[] = [
  {
    name: "SSD Kingston NV2 1TB NVMe PCIe 4.0",
    price: 290.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Lectura de hasta 3500 MB/s, ideal para arranque ultrarrápido de tu OS y juegos",
  },
  {
    name: "Corsair MP600 Pro 2TB NVMe PCIe 4.0",
    price: 650.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Disipador de aluminio alto rendimiento, lectura extrema de 7000 MB/s",
  },
  {
    name: "SSD Kingston A400 480GB SATA",
    price: 140.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Formato SATA de 2.5 pulgadas, excelente para almacenamiento secundario",
  },
];

const DEF_PSUS: PredefinedComponent[] = [
  {
    name: "MSI MAG A650BN 650W 80+ Bronze",
    price: 250.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Certificación 80 Plus Bronze | Excelente protección eléctrica y estabilidad",
  },
  {
    name: "Corsair RM850e 850W 80+ Gold Modular",
    price: 580.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Totalmente modulable, capacitores japoneses calificados de gran eficiencia premium",
  },
  {
    name: "ASUS ROG Thor 1000W Platinum II",
    price: 1390.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Certificación Platinum, pantalla OLED de vatiaje instantáneo en tiempo real",
  },
];

const DEF_COOLINGS: PredefinedComponent[] = [
  {
    name: "DeepCool AG400 Air Cooler",
    price: 130.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Ventilador PWM silencioso de 120mm y 4 tubos de cobre de contacto directo",
  },
  {
    name: "Cooler Master Hyper 212 Halo",
    price: 190.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Doble bucle de iluminación LED RGB y excelente refrigeración por aire",
  },
  {
    name: "Corsair iCUE H150i Elite Capellix XT Liquid Cooler 360mm",
    price: 890.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Refrigeración líquida extrema triple ventilador de 120mm, sincronización iCUE",
  },
];

const DEF_CASES: PredefinedComponent[] = [
  {
    name: "Antryx FX-500 Black",
    price: 180.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Formato ATX, panel lateral acrílico y rejilla metálica frontal óptima",
  },
  {
    name: "Corsair 4000D Airflow Tempered Glass",
    price: 420.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Gabinete semitorre ATX de alto flujo de aire con vidrio templado premium",
  },
  {
    name: "Lian Li O11 Dynamic EVO",
    price: 690.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
    details: "Estructura modular espaciosa de vidrio templado doble, ideal para setups entusiastas",
  },
];

/**
 * Interfaz que define la estructura de un componente personalizado
 * añadido manualmente por el usuario
 */
interface CustomComponent {
  id: string;
  category: string;
  name: string;
  price: number;
}

/**
 * Interfaz que define las propiedades del componente ArmaTuPC
 */
export default function ArmaTuPC({ onAddToCart }: ArmaTuPCProps) {
  // Navigation Steps:
  // 1: Platform (Intel vs AMD)
  // 2: CPU Choice (Procesador)
  // 3: Motherboard Choice (Placa Madre)
  // 4: RAM Selection (Memoria RAM)
  // 5: GPU Selection (Tarjeta Gráfica)
  // 6: Storage Selection (Almacenamiento)
  // 7: PSU Selection (Fuente de Poder)
  // 8: Cooling Selection (Enfriamiento)
  // 9: Case Selection (Case / Gabinete)
  // 10: Resumen Final y Envío al Carrito
  const [step, setStep] = useState<number>(1);
  const [platform, setPlatform] = useState<"intel" | "amd">("intel");
 
  // Estados de Componentes Predefinidos
  const [selectedCpu, setSelectedCpu] = useState<PredefinedComponent | null>(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState<PredefinedComponent | null>(null);
  const [selectedRam, setSelectedRam] = useState<PredefinedComponent | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<PredefinedComponent | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<PredefinedComponent | null>(null);
  const [selectedPsu, setSelectedPsu] = useState<PredefinedComponent | null>(null);
  const [selectedCooling, setSelectedCooling] = useState<PredefinedComponent | null>(null);
  const [selectedCase, setSelectedCase] = useState<PredefinedComponent | null>(null);

  // Estado para componentes personalizados añadidos por el usuario
  const [customComponents, setCustomComponents] = useState<CustomComponent[]>([]);

  // Estados para el formulario de añadir componente personalizado
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState("SSD / Almacenamiento");
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  const handlePlatformSelect = (plat: "intel" | "amd") => {
    setPlatform(plat);
    // Resetear selecciones al cambiar de plataforma para evitar incompatibilidades
    setSelectedCpu(null);
    setSelectedMotherboard(null);
    setStep(2);
  };

  const handleAddCustomComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrice) return;
    const priceNum = parseFloat(customPrice);
    if (isNaN(priceNum) || priceNum < 0) return;

    const newComponent: CustomComponent = {
      id: Date.now().toString(),
      category: customCategory,
      name: customName.trim(),
      price: priceNum,
    };

    setCustomComponents([...customComponents, newComponent]);
    setCustomName("");
    setCustomPrice("");
    setIsAddingCustom(false);
  };

  const handleRemoveCustomComponent = (id: string) => {
    setCustomComponents(customComponents.filter((c) => c.id !== id));
  };

  // Función para obtener el ícono correspondiente a la categoría del componente personalizado
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "SSD / Almacenamiento":
        return <HardDrive size={16} className="text-blue-400" />;
      case "Fuente de Poder":
        return <Layers size={16} className="text-yellow-400" />;
      case "Cooler / Refrigeración":
        return <Disc size={16} className="text-teal-400" />;
      default:
        return <Monitor size={16} className="text-purple-400" />;
    }
  };

  // Cálculo del subtotal sumando los precios de los componentes seleccionados y los personalizados
  const subtotal =
    (selectedCpu?.price || 0) +
    (selectedMotherboard?.price || 0) +
    (selectedRam?.price || 0) +
    (selectedGpu?.price || 0) +
    (selectedStorage?.price || 0) +
    (selectedPsu?.price || 0) +
    (selectedCooling?.price || 0) +
    (selectedCase?.price || 0) +
    customComponents.reduce((sum, item) => sum + item.price, 0);

  // Función para añadir un componente individual al carrito 
  const addSingleToCart = (comp: PredefinedComponent, vendor: string) => {
    const prod: Product = {
      id: `pcbuild-${vendor.toLowerCase().replace(/\s+/g, "-")}-${comp.name.replace(/\s+/g, "-").toLowerCase()}`,
      title: comp.name,
      vendor: vendor,
      price: comp.price,
      image: comp.image,
      available: true,
    };
    onAddToCart(prod);
  };

  // Función para añadir toda la configuración personalizada al carrito
  const addEntireBuildToCart = () => {
    // Collect all selected components
    const itemsToAdd: { comp: PredefinedComponent | CustomComponent; vendor: string }[] = [];

    if (selectedCpu) itemsToAdd.push({ comp: selectedCpu, vendor: platform === "intel" ? "Intel" : "AMD" });
    if (selectedMotherboard) itemsToAdd.push({ comp: selectedMotherboard, vendor: "Placa Madre" });
    if (selectedRam) itemsToAdd.push({ comp: selectedRam, vendor: "Memoria RAM" });
    if (selectedGpu) itemsToAdd.push({ comp: selectedGpu, vendor: "Tarjeta de Video" });
    if (selectedStorage) itemsToAdd.push({ comp: selectedStorage, vendor: "Almacenamiento (SSD)" });
    if (selectedPsu) itemsToAdd.push({ comp: selectedPsu, vendor: "Fuente de Poder" });
    if (selectedCooling) itemsToAdd.push({ comp: selectedCooling, vendor: "Enfriamiento" });
    if (selectedCase) itemsToAdd.push({ comp: selectedCase, vendor: "Gabinete / Case" });

    // Añadir componentes personalizados al listado de productos a agregar al carrito
    customComponents.forEach((c) => {
      itemsToAdd.push({
        comp: {
          name: c.name,
          price: c.price,
          image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
          details: c.category,
        },
        vendor: "Componente Adicional (" + c.category + ")",
      });
    });

    itemsToAdd.forEach((item) => {
      const prod: Product = {
        id: `pcbuild-${item.comp.name.replace(/\s+/g, "-").toLowerCase()}`,
        title: item.comp.name,
        vendor: item.vendor,
        price: item.comp.price,
        image: (item.comp as any).image || "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=85",
        available: true,
      };
      onAddToCart(prod);
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 text-white space-y-8 select-none" id="arma-tu-pc-wizard">
      {/* Step Header Indicator */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase text-blue-400 font-mono">
          <Layers size={12} className="animate-pulse" />
          FÁCIL Y PERSONALIZADO
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-white">
          Arma tu PC Gamer Paso a Paso
        </h2>
        <p className="text-gray-400 text-sm max-w-xl mx-auto font-medium">
          Selecciona tu procesador, placa compatible, memoria ram y tarjeta gráfica de acuerdo a tu presupuesto. ¡Incluso puedes añadir partes personalizadas adicionales!
        </p>
      </div>

      {/* Pasos de procesos de construcción */}
      <div className="hidden lg:flex justify-between items-center max-w-5xl mx-auto border border-white/5 bg-[#0F0F12]/80 p-3 rounded-2xl text-[10px] sm:text-xs font-semibold uppercase text-gray-500 gap-1 overflow-x-auto">
        {[
          { num: 1, label: "Plat." },
          { num: 2, label: "Procesador" },
          { num: 3, label: "Placa Madre" },
          { num: 4, label: "RAM" },
          { num: 5, label: "Gráfica" },
          { num: 6, label: "Almac." },
          { num: 7, label: "Fuente" },
          { num: 8, label: "Cooler" },
          { num: 9, label: "Case" },
          { num: 10, label: "Resumen" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => {
              if (s.num === 1 || (s.num > 1 && platform)) {
                setStep(s.num);
              }
            }}
            className={`flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
              step === s.num
                ? "text-blue-400 font-bold"
                : s.num < step
                ? "text-emerald-400 hover:text-white"
                : "hover:text-gray-300"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${
                step === s.num
                  ? "bg-blue-600 text-white"
                  : s.num < step
                  ? "bg-emerald-500/20 text-emerald-450 border border-emerald-500/30"
                  : "bg-[#0A0A0B]"
              }`}
            >
              {s.num}
            </span>
            <span className="hidden xl:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Step View Panels */}
        <div className="lg:col-span-8 bg-[#0F0F12] border border-white/10 rounded-3xl p-6 min-h-[460px] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] text-gray-500 font-bold font-mono uppercase">PASO {step} DE 10</span>
              <h3 className="text-xl font-bold uppercase text-white mt-0.5">
                {step === 1 && "Selecciona tu Plataforma Principal"}
                {step === 2 && `Elige tu Procesador ${platform.toUpperCase()}`}
                {step === 3 && "Selecciona la Placa Madre compatible"}
                {step === 4 && "Elige la Memoria RAM adecuada"}
                {step === 5 && "Selecciona tu Tarjeta Gráfica (GPU)"}
                {step === 6 && "Elige tu Almacenamiento principal"}
                {step === 7 && "Selecciona tu Fuente de Poder (PSU)"}
                {step === 8 && "Elige tu Enfriamiento / Cooler"}
                {step === 9 && "Selecciona tu Case / Gabinete"}
                {step === 10 && "Revisa e Importa tu PC al Carrito"}
              </h3>
            </div>

            {/* Vista de selección de plataforma */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {/* Intel Card Selection Button */}
                <div
                  onClick={() => handlePlatformSelect("intel")}
                  className={`group relative border rounded-2xl p-6 text-center space-y-4 cursor-pointer transition-all bg-[#0A0A0B]/60 flex flex-col items-center hover:border-blue-500/50 ${
                    platform === "intel" && step > 1 ? "border-blue-500 ring-1 ring-blue-500" : "border-white/5"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Cpu size={28} />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">PLATA-FORMA INTEL</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">
                      Soporte de DDR5 moderna, multitarea híbrida avanzada, excelente rendimiento en software de productividad y renderizado.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-blue-400 group-hover:underline">Comenzar con Intel ➔</div>
                </div>

                {/* AMD Card Selection Button */}
                <div
                  onClick={() => handlePlatformSelect("amd")}
                  className={`group relative border rounded-2xl p-6 text-center space-y-4 cursor-pointer transition-all bg-[#0A0A0B]/60 flex flex-col items-center hover:border-blue-500/50 ${
                    platform === "amd" && step > 1 ? "border-blue-500 ring-1 ring-blue-500" : "border-white/5"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                    <Cpu size={28} />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">PLATA-FORMA AMD RYZEN</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">
                      Pioneros del 3D V-Cache especializado para videojuegos, menor consumo térmico TDP y longevidad excepcional del socket AM5.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-orange-400 group-hover:underline">Comenzar con AMD ➔</div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEF_CPUS[platform].map((cpu) => {
                  const isSelected = selectedCpu?.name === cpu.name;
                  return (
                    <div
                      key={cpu.name}
                      onClick={() => setSelectedCpu(cpu)}
                      className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <img
                        src={cpu.image}
                        alt={cpu.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">{platform === "intel" ? "Intel Core" : "AMD Ryzen"}</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{cpu.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{cpu.details}</p>
                        <span className="text-xs font-black text-emerald-450 font-mono">
                          S/. {cpu.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-[#0A0A0B] p-4 rounded-2xl text-xs flex gap-3 items-center border border-yellow-500/10">
                  <ShieldCheck className="text-yellow-400 flex-shrink-0" size={18} />
                  <div>
                    <span className="font-bold text-yellow-400 uppercase">Verificador de Compatibilidad:</span>
                    <p className="text-gray-400 mt-0.5 font-medium">
                      Solo mostramos placas compatibles con tu plataforma {platform.toUpperCase()} seleccionada en el paso anterior.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DEF_MOTHERBOARDS[platform].map((mb) => {
                    const isSelected = selectedMotherboard?.name === mb.name;
                    return (
                      <div
                        key={mb.name}
                        onClick={() => setSelectedMotherboard(mb)}
                        className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                          isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                        }`}
                      >
                        <img
                          src={mb.image}
                          alt={mb.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">SOCKET {platform === "intel" ? "LGA1700" : "AM4/AM5"}</span>
                          <h4 className="text-xs font-extrabold text-white truncate">{mb.name}</h4>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{mb.details}</p>
                          <span className="text-xs font-black text-emerald-400 font-mono">
                            S/. {mb.price.toFixed(2)}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEF_RAMS.map((ram) => {
                  const isSelected = selectedRam?.name === ram.name;
                  return (
                    <div
                      key={ram.name}
                      onClick={() => setSelectedRam(ram)}
                      className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <img
                        src={ram.image}
                        alt={ram.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">MEMORIA RAM</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{ram.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{ram.details}</p>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          S/. {ram.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEF_GPUS.map((gpu) => {
                  const isSelected = selectedGpu?.name === gpu.name;
                  return (
                    <div
                      key={gpu.name}
                      onClick={() => setSelectedGpu(gpu)}
                      className={`relative border rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none space-y-3 ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="h-28 bg-black/60 rounded-xl overflow-hidden flex items-center justify-center relative p-1.5">
                          <img
                            src={gpu.image}
                            alt={gpu.name}
                            referrerPolicy="no-referrer"
                            className="h-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider">GPU DEDICADA</span>
                          <h4 className="text-xs font-extrabold text-white leading-tight mt-0.5">{gpu.name}</h4>
                          <p className="text-[9px] text-gray-400 leading-normal line-clamp-2 mt-1 h-6">{gpu.details}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline pt-1.5 border-t border-white/5">
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          S/. {gpu.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 6 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEF_STORAGES.map((st) => {
                  const isSelected = selectedStorage?.name === st.name;
                  return (
                    <div
                      key={st.name}
                      onClick={() => setSelectedStorage(st)}
                      className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <img
                        src={st.image}
                        alt={st.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Almacenamiento (SSD)</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{st.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{st.details}</p>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          S/. {st.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 7 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEF_PSUS.map((psu) => {
                  const isSelected = selectedPsu?.name === psu.name;
                  return (
                    <div
                      key={psu.name}
                      onClick={() => setSelectedPsu(psu)}
                      className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <img
                        src={psu.image}
                        alt={psu.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Fuente de Poder</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{psu.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{psu.details}</p>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          S/. {psu.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 8 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEF_COOLINGS.map((cl) => {
                  const isSelected = selectedCooling?.name === cl.name;
                  return (
                    <div
                      key={cl.name}
                      onClick={() => setSelectedCooling(cl)}
                      className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <img
                        src={cl.image}
                        alt={cl.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Enfriamiento CPU</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{cl.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{cl.details}</p>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          S/. {cl.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 9 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEF_CASES.map((cs) => {
                  const isSelected = selectedCase?.name === cs.name;
                  return (
                    <div
                      key={cs.name}
                      onClick={() => setSelectedCase(cs)}
                      className={`relative border rounded-2xl p-3 flex gap-3 items-center cursor-pointer transition-all bg-[#0A0A0B]/45 hover:border-blue-500/40 select-none ${
                        isSelected ? "border-blue-500 ring-2 ring-blue-500/25 bg-blue-500/5" : "border-white/5"
                      }`}
                    >
                      <img
                        src={cs.image}
                        alt={cs.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/5"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Gabinete / Case</span>
                        <h4 className="text-xs font-extrabold text-white truncate">{cs.name}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{cs.details}</p>
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          S/. {cs.price.toFixed(2)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {step === 10 && (
              <div className="space-y-6">
                <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs text-blue-400 font-bold tracking-widest uppercase font-mono">Ficha Técnica de Ensamblaje Achorao</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Procesador</span>
                      <p className="text-xs font-bold text-white">{selectedCpu ? selectedCpu.name : "No seleccionado"}</p>
                      {selectedCpu && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedCpu.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Placa Madre</span>
                      <p className="text-xs font-bold text-white">{selectedMotherboard ? selectedMotherboard.name : "No seleccionada"}</p>
                      {selectedMotherboard && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedMotherboard.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Memoria RAM</span>
                      <p className="text-xs font-bold text-white">{selectedRam ? selectedRam.name : "No seleccionada"}</p>
                      {selectedRam && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedRam.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Tarjeta Gráfica</span>
                      <p className="text-xs font-bold text-white">{selectedGpu ? selectedGpu.name : "No seleccionada"}</p>
                      {selectedGpu && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedGpu.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Almacenamiento (SSD)</span>
                      <p className="text-xs font-bold text-white">{selectedStorage ? selectedStorage.name : "No seleccionado"}</p>
                      {selectedStorage && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedStorage.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Fuente de Poder</span>
                      <p className="text-xs font-bold text-white">{selectedPsu ? selectedPsu.name : "No seleccionado"}</p>
                      {selectedPsu && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedPsu.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Enfriamiento</span>
                      <p className="text-xs font-bold text-white">{selectedCooling ? selectedCooling.name : "No seleccionado"}</p>
                      {selectedCooling && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedCooling.price.toFixed(2)}</p>}
                    </div>

                    <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Gabinete / Case</span>
                      <p className="text-xs font-bold text-white">{selectedCase ? selectedCase.name : "No seleccionado"}</p>
                      {selectedCase && <p className="text-[10px] text-emerald-450 font-semibold font-mono">S/. {selectedCase.price.toFixed(2)}</p>}
                    </div>
                  </div>

                  {customComponents.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase font-mono">Adicionales Personalizados ({customComponents.length})</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {customComponents.map((c) => (
                          <div key={c.id} className="text-xs bg-black/40 border border-white/5 p-2 rounded-lg flex justify-between items-center">
                            <span className="truncate max-w-[160px] text-white font-medium">{c.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-emerald-400 font-bold">S/. {c.price.toFixed(2)}</span>
                              <button
                                onClick={() => handleRemoveCustomComponent(c.id)}
                                className="text-gray-500 hover:text-red-400 p-0.5 ml-1 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Valor Total Estimado:</span>
                      <p className="text-2xl font-extrabold text-blue-400 font-mono">S/. {subtotal.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button
                      onClick={addEntireBuildToCart}
                      disabled={
                        !selectedCpu &&
                        !selectedMotherboard &&
                        !selectedRam &&
                        !selectedGpu &&
                        !selectedStorage &&
                        !selectedPsu &&
                        !selectedCooling &&
                        !selectedCase &&
                        customComponents.length === 0
                      }
                      className="h-11 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer shadow-blue-600/10"
                    >
                      <ShoppingCart size={15} />
                      Añadir toda la PC al Carrito
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center bg-[#0A0A0B] p-4 rounded-2xl border border-white/5">
                    <div className="space-y-0.5 text-left">
                      <h4 className="text-xs font-bold text-gray-300 uppercase">¿Quieres agregar componentes personalizados adicionales?</h4>
                      <p className="text-[11px] text-gray-500">Agrega periféricos, licencias u otras partes fuera del catálogo base.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingCustom(!isAddingCustom)}
                      className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      {isAddingCustom ? "Cerrar" : "Añadir"}
                    </button>
                  </div>

                  {isAddingCustom && (
                    <form onSubmit={handleAddCustomComponent} className="bg-[#0A0A0B] mt-4 border border-white/10 rounded-2xl p-4 space-y-4 animate-in slide-in-from-top-3 duration-250">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-left">
                          <label className="block text-xs font-bold text-gray-400 mb-1 leading-none uppercase">Categoría</label>
                          <select
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full h-10 bg-[#0F0F12] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option>SSD / Almacenamiento</option>
                            <option>Fuente de Poder</option>
                            <option>Gabinete / Case</option>
                            <option>Cooler / Refrigeración</option>
                            <option>Otros</option>
                          </select>
                        </div>

                        <div className="text-left">
                          <label className="block text-xs font-bold text-gray-400 mb-1 leading-none uppercase">Nombre</label>
                          <input
                            type="text"
                            placeholder="Ej: SSD Kingston NV2 1TB"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full h-10 bg-[#0F0F12] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>

                        <div className="text-left">
                          <label className="block text-xs font-bold text-gray-400 mb-1 leading-none uppercase">Precio (S/.)</label>
                          <input
                            type="number"
                            placeholder="Ej: 299"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="w-full h-10 bg-[#0F0F12] border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
                        >
                          Confirmar y Agregar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botones de Control Inferior */}
          <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="h-10 px-4 border border-white/10 rounded-xl hover:bg-white/5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300"
            >
              <ArrowLeft size={14} />
              Atrás
            </button>

            <button
              onClick={() => setStep(Math.min(10, step + 1))}
              disabled={step === 10 || (step === 1 && !platform)}
              className="h-10 px-5 bg-[#0A0A0B] border border-white/10 rounded-xl hover:bg-[#121215] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:hidden text-zinc-300"
            >
              Siguiente
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Resumen de Especificaciones */}
        <div className="lg:col-span-4 bg-[#0F0F12]/80 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
              <Layers size={16} className="text-blue-500" />
              Tu Configuración de PC
            </h4>
          </div>

          <div className="space-y-4">
            {/* Intel/AMD Flag indicator */}
            <div className="flex justify-between items-center bg-[#0A0A0B] p-2 rounded-xl text-xs">
              <span className="text-gray-500 font-bold uppercase font-mono">Plataforma</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                platform === "intel" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "bg-orange-600/20 text-orange-400 border border-orange-500/20"
              }`}>
                {platform?.toUpperCase()}
              </span>
            </div>

            {/* Componentes Seleccionados */}
            <div className="space-y-3 divide-y divide-white/5">
              {/* CPU Line */}
              <div className="flex justify-between items-start pt-1 font-sans">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Procesador</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedCpu ? selectedCpu.name : "Pendiente..."}</p>
                </div>
                {selectedCpu ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedCpu.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedCpu, platform === "intel" ? "Intel" : "AMD")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* Motherboard Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Placa Compatible</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedMotherboard ? selectedMotherboard.name : "Pendiente..."}</p>
                </div>
                {selectedMotherboard ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedMotherboard.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedMotherboard, "Placa Madre")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* RAM Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Memoria RAM</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedRam ? selectedRam.name : "Pendiente..."}</p>
                </div>
                {selectedRam ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedRam.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedRam, "Memoria RAM")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* GPU Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Tarjeta Gráfica</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedGpu ? selectedGpu.name : "Pendiente..."}</p>
                </div>
                {selectedGpu ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedGpu.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedGpu, "Tarjeta de Video")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* Storage Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Almacenamiento</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedStorage ? selectedStorage.name : "Pendiente..."}</p>
                </div>
                {selectedStorage ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedStorage.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedStorage, "Almacenamiento")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* PSU Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Fuente de Poder</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedPsu ? selectedPsu.name : "Pendiente..."}</p>
                </div>
                {selectedPsu ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedPsu.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedPsu, "Fuente de Poder")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* Cooling Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Enfriamiento</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedCooling ? selectedCooling.name : "Pendiente..."}</p>
                </div>
                {selectedCooling ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedCooling.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedCooling, "Enfriamiento")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>

              {/* Case Line */}
              <div className="flex justify-between items-start pt-3">
                <div className="text-left space-y-0.5 max-w-[160px]">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Gabinete / Case</span>
                  <p className="text-[11px] font-bold text-white truncate">{selectedCase ? selectedCase.name : "Pendiente..."}</p>
                </div>
                {selectedCase ? (
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {selectedCase.price.toFixed(2)}</span>
                    <button
                      onClick={() => addSingleToCart(selectedCase, "Case")}
                      className="text-[10px] text-blue-400 font-bold hover:underline font-mono mt-0.5 cursor-pointer"
                    >
                      + Carrito
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-600 font-mono">S/. 0.00</span>
                )}
              </div>
            </div>

            {/* Componentes Adicionales */}
            {customComponents.length > 0 && (
              <div className="space-y-2.5 divide-y divide-white/5 pt-2 border-t border-white/10">
                <span className="text-[9px] text-gray-500 font-extrabold uppercase font-mono tracking-wider block">Componentes Adicionales</span>
                {customComponents.map((c) => (
                  <div key={c.id} className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-zinc-300 truncate max-w-[150px]" title={c.name}>{c.name}</span>
                    <span className="font-mono text-emerald-450 text-[11px] font-bold">S/. {c.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen de Totales */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400">Total Acumulado:</span>
              <span className="text-xl font-black text-emerald-450 font-mono">S/. {subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[9px] text-gray-500 font-semibold leading-relaxed uppercase">
              * El precio cotizado incluye Garantía oficial Achorao de 3 años, ensamblaje con pasta térmica noctua, y despacho express local.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
