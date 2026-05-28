import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LocationModal from "./components/LocationModal";
import ArmaTuPC from "./components/PCBuilder";
import ProductCalculator from "./components/ProductCalculator";
import SimulatorConsole from "./components/SimulatorConsole";
import { CartItem, Product } from "./types";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Mouse gamer Gravastar Mercury M1 Pro, inalámbrico, Gradient Black",
    vendor: "GravaStar",
    price: 339.90,
    compareAtPrice: 429.90,
    image: "https://www.achorao.com/cdn/shop/files/m1proportada.jpg?v=1763394293",
    secondaryImage: "https://www.achorao.com/cdn/shop/files/m1pro1.jpg?v=1763394327",
    tag: "Ahorra S/.90.00",
    available: true,
  },
  {
    id: "2",
    title: "Playseat GearShift Holder PRO soporte de Caja",
    vendor: "Playseat",
    price: 299.90,
    compareAtPrice: 600.00,
    image: "https://www.achorao.com/cdn/shop/files/playseat-repuestos-y-accesorios-para-simuladores-default-title-gearshift-holder-pro-soporte-de-caja-8717496871756-39536913416432.jpg?v=1754483006&width=360",
    secondaryImage: "https://www.achorao.com/cdn/shop/files/playseat-repuestos-y-accesorios-para-simuladores-default-title-gearshift-holder-pro-soporte-de-caja-8717496871756-38399011651824.jpg?v=1754482958&width=360",
    tag: "Ahorra 50%",
    available: true,
  },
  {
    id: "3",
    title: "Mochila Targus Urban Convertible, 15.6\"",
    vendor: "Targus",
    price: 139.90,
    compareAtPrice: 189.90,
    image: "https://www.achorao.com/cdn/shop/files/targus-mochila-default-title-mochila-targus-urban-convertible-15-6-tbb595gl-092636346638-46365308354800.jpg?v=1738880689&width=360",
    tag: "Ahorra 26%",
    available: true,
  },
  {
    id: "4",
    title: "Placa Madre ASUS TUF Gaming A620M-PLUS WiFi DDR5 para AMD AM5 Matx",
    vendor: "Asus",
    price: 549.90,
    compareAtPrice: 649.90,
    image: "https://www.achorao.com/cdn/shop/files/asus-tarjeta-madre-motherboard-default-title-motherboard-asus-tuff-gaming-a620m-plus-wifi-am5-ddr5-197105164260-39065243058416.jpg?v=1754485565&width=360",
    tag: "Ahorra 15%",
    available: true,
  },
  {
    id: "5",
    title: "TP Link Archer C80 Router AC1900 WiFi de Doble Banda",
    vendor: "Tp-Link",
    price: 169.90,
    compareAtPrice: 194.90,
    image: "https://www.achorao.com/cdn/shop/files/tp-link-computo-default-title-tp-link-archer-c80-router-ac1900-wifi-de-doble-banda-6935364088873-46364852224240.jpg?v=1738879345&width=360",
    tag: "Ahorra 13%",
    available: true,
  },
  {
    id: "6",
    title: "Cámara de seguridad TP-Link Tapo C310 Wi-Fi, interior/exterior",
    vendor: "Tp-Link",
    price: 134.90,
    image: "https://www.achorao.com/cdn/shop/files/tp-link-camaras-default-title-camara-tapo-c310-wi-fi-de-seguridad-para-casa-p163b-6935364010911-46364638675184.jpg?v=1738878477&width=360",
    available: true,
  },
  {
    id: "7",
    title: "Lámpara portátil Philips Hue Go v2 White & Color Ambiance",
    vendor: "Philips Hue",
    price: 369.90,
    image: "https://www.achorao.com/cdn/shop/files/philips-hue-smarthome-default-title-lampara-portatil-philips-hue-go-portable-light-zigbee-bluetooth-8718696174036-46364667838704.jpg?v=1738878660&width=360",
    tag: "Agotado",
    available: false,
  },
  {
    id: "8",
    title: "Interruptor dimmer inteligente Philips Hue (Dimmer Switch)",
    vendor: "Philips Hue",
    price: 99.90,
    image: "https://www.achorao.com/cdn/shop/files/philips-hue-smarthome-default-title-philips-hue-interruptor-dimmer-switch-hue-ultimo-modelo-8719514274679-39633522229488.jpg?v=1754483228&width=360",
    available: true,
  },
  {
    id: "9",
    title: "Barra de luz LED inteligente Philips Hue Play multicolor, pack x1",
    vendor: "Philips Hue",
    price: 259.90,
    image: "https://www.achorao.com/cdn/shop/files/philips-hue-smarthome-default-title-play-light-and-bar-philips-hue-barra-led-inteligente-multi-color-x1-8718696170731-39633366581488.jpg?v=1754483241&width=360",
    available: true,
  },
  {
    id: "10",
    title: "Silla gamer Corsair TC500 LUXE",
    vendor: "CORSAIR",
    price: 1449.90,
    image: "https://www.achorao.com/cdn/shop/files/corsair-silla-gamer-sherwood-silla-gamer-corsair-tc500-luxe-840006678465-38400377454832.jpg?v=1754485024&width=360",
    available: true,
  }
];

const BRANDS = [
  { name: "Logitech", logo: "https://www.achorao.com/cdn/shop/collections/logitech_360x.jpg?v=1705616059" },
  { name: "Logitech G", logo: "https://www.achorao.com/cdn/shop/collections/307353898_10159834618459871_9186133384972693342_n_360x.jpg?v=1705616091" },
  { name: "Playseat", logo: "https://www.achorao.com/cdn/shop/collections/playseat_68c99f71-7184-4259-a076-38ca4c3615cd_360x.webp?v=1734487865" },
  { name: "PlayStation", logo: "https://www.achorao.com/cdn/shop/collections/playstation-23_360x.png?v=1750474412" },
  { name: "Nintendo", logo: "https://www.achorao.com/cdn/shop/collections/Nintendo_cuadrado_360x.jpg?v=1705616544" },
  { name: "Philips Hue", logo: "https://www.achorao.com/cdn/shop/collections/philips_hue_360x.jpg?v=1705617760" },
  { name: "Intel", logo: "https://www.achorao.com/cdn/shop/collections/intel_360x.jpg?v=1705617539" },
  { name: "JBL", logo: "https://www.achorao.com/cdn/shop/collections/jbl-professional-logo-vector_360x.webp?v=1705616459" },
  { name: "MSI", logo: "https://www.achorao.com/cdn/shop/collections/msi_360x.jpg?v=1705617676" },
  { name: "Sony", logo: "https://www.achorao.com/cdn/shop/collections/Sony_360x.png?v=1705616325" },
  { name: "Razer", logo: "https://www.achorao.com/cdn/shop/collections/portada-razer_360x.webp?v=1705616252" }
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Ate");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Modal control triggers
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Big Hero Carousel slider index
  const [heroIndex, setHeroIndex] = useState(0);
  const [isBrandAccordionOpen, setIsBrandAccordionOpen] = useState(false);

  const heroSlides = [
    {
      title: "Sillas CORSAIR TC100 / TC500",
      subtitle: "4 modelos de alto nivel gaming disponibles con despacho prioritario",
      image: "https://www.achorao.com/cdn/shop/files/imgi_97_Sillas-corsair-2026-TC100-TC500_-banner-web.jpg?v=1775058603",
      buttonText: "ME LO LLEVO YA!",
      linkTab: "products",
    },
    {
      title: "Logitech MX Master 4 Series",
      subtitle: "La serie definitiva de productividad digital y reto creativo",
      image: "https://www.achorao.com/cdn/shop/files/web-baner-mx-master-4-platzi.jpg?v=1776897583",
      buttonText: "COMPRAR LOGITECH",
      linkTab: "products",
    },
    {
      title: "TU PODEROSA PC TE ESPERA",
      subtitle: "Simula el rendimiento y el upgrade exacto de tus specs favoritas",
      image: "https://www.achorao.com/cdn/shop/files/imgi_89_pc-gamer-back-to-school-baner.jpg?v=1775059274",
      buttonText: "PROBAR SIMULADOR",
      linkTab: "simulator",
    }
  ];

  // Load persistence configurations
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("ach_cart");
      const storedDist = localStorage.getItem("ach_district");
      if (storedCart) setCartItems(JSON.parse(storedCart));
      if (storedDist) setSelectedDistrict(storedDist);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    try {
      localStorage.setItem("ach_cart", JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectDistrict = (name: string) => {
    setSelectedDistrict(name);
    try {
      localStorage.setItem("ach_district", name);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prevItems, { product, quantity: 1 }];
      }
      try {
        localStorage.setItem("ach_cart", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setIsCartDrawerOpen(true); // Auto reveal checkout
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (item.product.id === productId) {
          const next = item.quantity + delta;
          return { ...item, quantity: Math.max(1, next) };
        }
        return item;
      });
      try {
        localStorage.setItem("ach_cart", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem("ach_cart", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSearch = (term: string) => {
    setSearchFilter(term);
    setSelectedTab("products");
  };

  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    if (!searchFilter) return true;
    return p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.vendor.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-200 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-blue-600/30 selection:text-white">
      
      {/* Dynamic Header Component */}
      <Header
        cartItems={cartItems}
        currentDistrict={selectedDistrict}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
        onSearch={handleSearch}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Main Core Content body switch Router pattern */}
      <main className="flex-1 pb-16">
        {selectedTab === "home" && (
          <div className="space-y-12">
            {/* 1. Large Hero Slideshow Rotator */}
            <div className="relative h-[240px] sm:h-[400px] md:h-[500px] w-full overflow-hidden bg-black select-none">
              {heroSlides.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30 flex items-end p-6 md:p-12">
                    <div className="max-w-xl space-y-2 md:space-y-4 text-left">
                      <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight font-display text-white">
                        {slide.title}
                      </h2>
                      <p className="text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <button
                        onClick={() => setSelectedTab(slide.linkTab)}
                        className="h-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 rounded-full transition-all uppercase tracking-widest shadow-lg shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                      >
                        {slide.buttonText}
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slider Left Arrow button */}
              <button
                onClick={() => setHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full z-20 cursor-pointer"
                id="btn-hero-prev"
              >
                <ChevronLeft size={18} />
              </button>
              {/* Slider Right Arrow button */}
              <button
                onClick={() => setHeroIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full z-20 cursor-pointer"
                id="btn-hero-next"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* 2. CTS Exclusive Countdown Banner Section */}
            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0F0F12] flex flex-col md:flex-row items-center p-8 md:p-12 gap-8">
                <div className="absolute inset-0 bg-cover bg-center brightness-40 pointer-events-none" style={{ backgroundImage: "url('https://www.achorao.com/cdn/shop/files/banner5.jpg?v=1775078889')" }}></div>
                
                {/* Text section */}
                <div className="relative z-10 flex-1 space-y-3 text-center md:text-left">
                  <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    PROMO CTS ACTIVA 🔥
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold uppercase leading-snug tracking-tight text-white">
                    MOMENTO DE APROVECHAR LAS CTS
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm font-medium">
                    ENVÍO GRATIS en Lima Metropolitana + Descuentos masivos del 10% al 45% en todo el catálogo de periféricos.
                  </p>
                </div>

                {/* Countdown display component */}
                <div className="relative z-10 flex items-center gap-2 font-display uppercase tracking-wider select-none text-white">
                  <div className="bg-black/85 border border-white/10 rounded-2xl w-14 sm:w-16 py-3 text-center">
                    <span className="block text-xl sm:text-2xl font-extrabold text-blue-500 leading-none">05</span>
                    <span className="text-[10px] text-gray-500 font-bold mt-1 block">Días</span>
                  </div>
                  <div className="bg-black/85 border border-white/10 rounded-2xl w-14 sm:w-16 py-3 text-center">
                    <span className="block text-xl sm:text-2xl font-extrabold text-blue-500 leading-none">12</span>
                    <span className="text-[10px] text-gray-500 font-bold mt-1 block">Horas</span>
                  </div>
                  <div className="bg-black/85 border border-white/10 rounded-2xl w-14 sm:w-16 py-3 text-center">
                    <span className="block text-xl sm:text-2xl font-extrabold text-blue-500 leading-none">44</span>
                    <span className="text-[10px] text-gray-500 font-bold mt-1 block">Min</span>
                  </div>
                  <div className="bg-black/85 border border-white/10 rounded-2xl w-14 sm:w-16 py-3 text-center">
                    <span className="block text-xl sm:text-2xl font-extrabold text-blue-500 leading-none">18</span>
                    <span className="text-[10px] text-gray-500 font-bold mt-1 block">Seg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Category selector grid */}
            <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
              <h3 className="text-lg font-bold uppercase border-l-4 border-blue-500 pl-3 text-white tracking-tight">
                Comprar por Categorías
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Simuladores", img: "https://www.achorao.com/cdn/shop/collections/simulator.png?v=1705681063", tab: "products" },
                  { name: "Sillas Gamer", img: "https://www.achorao.com/cdn/shop/collections/gamer_bewerber_it-jobs_jpg_2d571711-0e6e-4932-9bc8-328934971f9c.webp?v=1728011758", tab: "products" },
                  { name: "Teclados", img: "https://www.achorao.com/cdn/shop/collections/Mesa_de_trabajo_5_copia_20.jpg?v=1705616133", tab: "products" },
                  { name: "Arma tu setup", img: "https://www.achorao.com/cdn/shop/collections/work-remote-og-image.webp?v=1705616121", tab: "simulator" },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedTab(item.tab)}
                    className="group relative h-40 rounded-2xl overflow-hidden border border-white/5 bg-[#0F0F12]/40 hover:border-white/10 cursor-pointer select-none"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-305"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                      <span className="font-bold text-xs uppercase tracking-wider text-white block group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Super descuentos x 24H Carousell grid */}
            <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold uppercase border-l-4 border-blue-500 pl-3 text-white tracking-tight">
                  Super Descuentos x 24H 🔥
                </h3>
                <button
                  onClick={() => setSelectedTab("products")}
                  className="text-xs text-blue-500 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Ver Todo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {INITIAL_PRODUCTS.slice(1, 5).map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#0F0F12] border border-white/5 hover:border-white/10 rounded-3xl p-4 space-y-3 transition-all relative flex flex-col justify-between"
                  >
                    {product.tag && (
                      <div className="absolute left-3 top-3 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded z-10">
                        {product.tag}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="h-44 bg-black/30 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center p-2 relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full object-contain hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{product.vendor}</span>
                        <h4 className="text-xs font-semibold tracking-tight text-white line-clamp-2 h-8 leading-snug">
                          {product.title}
                        </h4>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex flex-col text-left font-mono">
                        {product.compareAtPrice && (
                          <span className="text-[10px] text-gray-500 line-through">
                            S/. {product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-bold text-emerald-400">S/. {product.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 h-8 rounded-xl transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. PROMINENT DETAILED SECTON - THE GRAVASTAR MOUSE GALAXY CHATTER */}
            <div className="w-full max-w-7xl mx-auto px-4 pt-4">
              <div className="bg-[#0F0F12] border border-white/10 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left image and spec list sheet */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="relative bg-[#0A0A0B]/80 border border-white/5 aspect-square rounded-3xl flex items-center justify-center p-6">
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      OFERTA ESTELAR
                    </span>
                    <img
                      src={INITIAL_PRODUCTS[0].image}
                      alt={INITIAL_PRODUCTS[0].title}
                      className="max-h-[300px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Thumbnails list */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      INITIAL_PRODUCTS[0].image,
                      INITIAL_PRODUCTS[0].secondaryImage,
                      "https://www.achorao.com/cdn/shop/files/D_NQ_NP_852381-MPE86624203981_062025-O.webp?v=1763394327",
                      "https://www.achorao.com/cdn/shop/files/m1proportada2.jpg?v=1763394327"
                    ].map((thumb, idx) => (
                      <div key={idx} className="bg-[#0A0A0B] border border-white/5 rounded-xl p-1.5 flex items-center justify-center h-16">
                        <img src={thumb} alt="Preview" className="h-full object-contain opacity-75 hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right purchase detail and calculator */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">{INITIAL_PRODUCTS[0].vendor}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                      {INITIAL_PRODUCTS[0].title}
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                      Sensor óptico PixArt PAW 3395 de precisión ultra alta, ajustable hasta 26,000 DPI reales. Chasis de primera en polímero con diseño esquelético simétrico super-liviano de 72 gramos para sesiones prolongadas.
                    </p>
                    
                    {/* Bullet Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Modo Dual: Tipo C / 2.4G
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Switches 100M Clicks
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Software Programable
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Batería 500mAh
                      </div>
                    </div>
                  </div>

                  {/* Calculator Widget component */}
                  <ProductCalculator
                    basePrice={INITIAL_PRODUCTS[0].price}
                    onAddToCart={() => handleAddToCart(INITIAL_PRODUCTS[0])}
                  />
                </div>
              </div>
            </div>

            {/* 6. Brands Accordion fold */}
            <div className="w-full max-w-7xl mx-auto px-4" id="brands-accordion">
              <div className="bg-[#0F0F12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                <button
                  onClick={() => setIsBrandAccordionOpen(!isBrandAccordionOpen)}
                  className="w-full p-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 bg-gradient-to-r from-blue-950/20 via-[#0F0F12] to-black select-none text-white focus:outline-none cursor-pointer"
                  id="btn-trigger-brands-accordion"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold uppercase tracking-tight">Marcas oficiales de la casa</h3>
                    <p className="text-xs text-gray-400 font-medium">Logitech, Royal Kludge, Razer, Playseat, Intel, Sony…</p>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-500/20 text-xs font-bold px-4 py-2 rounded-xl text-blue-400 font-mono">
                    {isBrandAccordionOpen ? "Colapsar Lista ▲" : "Ver Marcas Oficiales ▼"}
                  </div>
                </button>

                {isBrandAccordionOpen && (
                  <div className="p-6 bg-[#0A0A0B]/70 border-t border-white/10 animate-in slide-in-from-top duration-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                      {BRANDS.map((brand, i) => (
                        <div
                          key={i}
                          className="bg-[#0F0F12] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2"
                        >
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-12 w-12 rounded-xl object-contain border border-white/10 bg-black/40 p-1"
                          />
                          <span className="text-[11px] font-bold text-gray-300 tracking-wide uppercase font-mono">
                            {brand.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 7. Hotspot Section: Corsair chair display */}
            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] border border-white/10 flex items-center bg-black">
                <img
                  src="https://www.achorao.com/cdn/shop/files/corsair-silla-gamer-sherwood-silla-gamer-corsair-tc500-luxe-840006678465-38400377454832.jpg?v=1754485024"
                  alt="Oferta del día"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-[#0A0A0B]/20"></div>

                {/* Animated visual hotspot ring */}
                <div className="absolute left-[35%] top-[45%] group z-20">
                  <div className="relative flex items-center justify-center h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border border-white"></span>

                    {/* Hover detail tooltip */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block bg-[#0F0F12] border border-white/10 rounded-2xl p-4 w-44 shadow-2xl space-y-2 text-left">
                      <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block font-mono">DESTACADOS DE LUJO</span>
                      <h5 className="text-xs font-bold uppercase text-white tracking-wide leading-tight">Corsair TC500 LUXE</h5>
                      <span className="text-xs font-bold text-emerald-400 block font-mono">S/. 1,449.90</span>
                      <button
                        onClick={() => handleAddToCart(INITIAL_PRODUCTS[9])}
                        className="w-full h-7 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Comprar ahora
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 max-w-sm sm:max-w-md p-6 sm:p-10 text-left space-y-2">
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-widest inline-block font-mono">
                    OFERTA DEL DÍA
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-white leading-tight">
                    Silla gamer Corsair TC500 LUXE
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                    Diseño ergonómico premium para sesiones prolongadas de Sim Racing o trabajo corporativo intensivo.
                  </p>
                  <button
                    onClick={() => handleAddToCart(INITIAL_PRODUCTS[9])}
                    className="h-9 bg-[#0F0F12] hover:bg-black border border-white/10 text-white text-[10px] font-bold uppercase rounded-xl px-5 transition-colors tracking-widest flex items-center gap-1.5 cursor-pointer"
                  >
                    ME LA LLEVO YA
                    <ArrowRight size={10} className="text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* 8. Map visits address card display */}
            <div className="w-full max-w-7xl mx-auto px-4 bg-[#0F0F12]/80 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono">TIENDA FÍSICA AUTORIZADA</span>
                <h4 className="text-lg font-bold uppercase text-white">Visítanos en Tienda Principal</h4>
                <p className="text-xs text-gray-400">A solo 10 minutos del Jockey Plaza. Resuelve tus dudas, paga y recoge al instante L-S.</p>
              </div>
              <a
                href="https://maps.google.com?daddr=Av. Vía de Evitamiento 1639 - Ate"
                target="_blank"
                rel="noreferrer"
                className="h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap shadow-blue-900/15"
              >
                CÓMO LLEGAR (GOOGLE MAPS)
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        )}

        {selectedTab === "products" && (
          <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold uppercase border-l-4 border-blue-500 pl-3 text-white tracking-tight">
                Catálogo de Productos Gaming
              </h3>
              <div className="text-xs font-mono text-gray-500">
                Mostrando {filteredProducts.length} productos
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#0F0F12] border border-white/5 hover:border-white/10 rounded-3xl p-4 space-y-3 transition-all relative flex flex-col justify-between h-96 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="h-44 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-3 relative">
                      {product.tag && (
                        <div className="absolute left-2.5 top-2.5 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded z-10">
                          {product.tag}
                        </div>
                      )}
                      <img src={product.image} alt={product.title} className="max-h-full object-contain" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.vendor}</span>
                      <h4 className="text-xs font-semibold leading-normal text-white line-clamp-2">
                        {product.title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                    <div className="flex flex-col text-left font-mono">
                      {product.compareAtPrice && (
                        <span className="text-[9px] text-gray-500 line-through">S/. {product.compareAtPrice.toFixed(2)}</span>
                      )}
                      <span className="text-xs font-bold text-emerald-400">S/. {product.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.available}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-[10px] font-bold uppercase px-3 h-8 rounded-xl transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                    >
                      {product.available ? "Agregar" : "Agotado"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "armatupc" && (
          <ArmaTuPC onAddToCart={handleAddToCart} />
        )}

        {selectedTab === "simulator" && (
          <SimulatorConsole onAddToCart={handleAddToCart} />
        )}
      </main>

      {/* Footer component */}
      <Footer currentDistrict={selectedDistrict} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleSelectDistrict}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => saveCart([])}
      />

    </div>
  );
}
