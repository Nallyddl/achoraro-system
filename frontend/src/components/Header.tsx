import React, { useState } from "react";
import { Search, MapPin, ShoppingBag, Menu, X, Instagram, Facebook, Youtube, ChevronDown } from "lucide-react";
import { CartItem } from "../types";

interface HeaderProps {
  cartItems: CartItem[];
  currentDistrict: string;
  onOpenLocationModal: () => void;
  onOpenCartDrawer: () => void;
  onSearch: (term: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export default function Header({
  cartItems,
  currentDistrict,
  onOpenLocationModal,
  onOpenCartDrawer,
  onSearch,
  selectedTab,
  setSelectedTab,
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="w-full bg-[#0A0A0B] text-white selection:bg-blue-600/30 selection:text-white" id="site-header">
      {/* Top Banner Announcement slider */}
      <div className="bg-gradient-to-r from-blue-900/30 via-slate-900 to-blue-900/30 border-b border-white/5 text-gray-300 text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center overflow-hidden h-9">
        <div className="animate-pulse flex items-center gap-2 font-mono">
          <span>Hasta 12 Cuotas sin intereses en toda la tienda</span>
          <span className="opacity-40 sm:inline">•</span>
          <span className="hidden sm:inline">Envíos Gratis a provincia en compras +S/. 599</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline text-blue-400">Canjee Millas y Puntos Gratis</span>
        </div>
      </div>

      {/* Toolbar - Links and socials */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 border-b border-white/5 bg-[#0F0F12] text-xs text-gray-400">
        <div className="flex items-center gap-5 font-semibold tracking-wider font-sans">
          <button onClick={() => setSelectedTab("products")} className="hover:text-blue-400 transition-colors cursor-pointer">Logitech</button>
          <button onClick={() => setSelectedTab("simulator")} className="hover:text-blue-400 transition-colors cursor-pointer">Arma tu PC / Simulador</button>
          <button onClick={() => setSelectedTab("products")} className="hover:text-blue-400 transition-colors cursor-pointer">Sim Racing</button>
          <button onClick={() => setSelectedTab("products")} className="hover:text-blue-400 transition-colors cursor-pointer">Sillas gamer</button>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-gray-400">
            <Instagram size={14} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-gray-400">
            <Facebook size={14} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-gray-400">
            <Youtube size={14} />
          </a>
        </div>
      </div>

      {/* Core Site Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#0F0F12] sticky top-0 z-40 border-b border-white/10">
        {/* Left Mobile Hamburguer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white cursor-pointer"
          id="btn-mobile-menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Branding Logo */}
        <div className="flex items-center cursor-pointer select-none" onClick={() => setSelectedTab("home")}>
          <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-md shadow-blue-900/10">A</div>
            <span className="font-extrabold text-white tracking-widest text-lg">ACHORAO <span className="text-blue-500 font-medium">GAMER</span></span>
          </div>
        </div>

        {/* Center Navigation Links Desktop */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-400">
          <button
            onClick={() => setSelectedTab("home")}
            className={`transition-colors py-1 cursor-pointer ${selectedTab === "home" ? "text-white border-b-2 border-blue-500 font-semibold" : "hover:text-white"}`}
          >
            Inicio
          </button>
          <button
            onClick={() => setSelectedTab("products")}
            className={`transition-colors py-1 cursor-pointer ${selectedTab === "products" ? "text-white border-b-2 border-blue-500 font-semibold" : "hover:text-white"}`}
          >
            Productos
          </button>
          <button
            onClick={() => setSelectedTab("simulator")}
            className={`transition-colors py-1 flex items-center gap-1 cursor-pointer ${selectedTab === "simulator" ? "text-blue-400 font-semibold border-b-2 border-blue-500" : "hover:text-white"}`}
          >
            Simular Setup / Upgrade
          </button>
        </nav>

        {/* Search, Location, and Cart Options */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search bar inside header desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 text-white text-xs px-3 py-2 pr-8 rounded-md border border-white/10 focus:border-blue-500 focus:outline-none w-36 md:w-48 transition-all"
              id="header-search-input"
            />
            <button type="submit" className="absolute right-2.5 text-gray-400 hover:text-white cursor-pointer" id="btn-submit-search">
              <Search size={14} />
            </button>
          </form>

          {/* District Selector button */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#0F0F12] hover:border-blue-500/50 transition-all select-none cursor-pointer"
            id="btn-trigger-location-header"
          >
            <MapPin size={12} className="text-blue-500" />
            <span className="max-w-[70px] sm:max-w-[124px] truncate">
              {currentDistrict || "Ubicación"}
            </span>
            <ChevronDown size={10} className="opacity-60" />
          </button>

          {/* Cart Bag trigger button */}
          <button
            onClick={onOpenCartDrawer}
            className="relative p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-lg shadow-blue-900/30 hover:scale-105"
            id="btn-cart-trigger"
          >
            <ShoppingBag size={15} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse border border-[#0F0F12] leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Mobile Sidebar menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="mobile-navigation-drawer">
          {/* Backdrop screen */}
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)}></div>

          {/* Drawer content */}
          <div className="relative w-72 bg-[#0F0F12] border-r border-white/10 h-full flex flex-col p-6 text-white space-y-6 z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-lg font-bold uppercase text-blue-500">Menú Achorao</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-sm font-medium uppercase tracking-wider">
              <button
                onClick={() => {
                  setSelectedTab("home");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 cursor-pointer ${selectedTab === "home" ? "text-blue-500 font-semibold" : "text-gray-300 hover:text-white"}`}
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  setSelectedTab("products");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 cursor-pointer ${selectedTab === "products" ? "text-blue-500 font-semibold" : "text-gray-300 hover:text-white"}`}
              >
                Productos
              </button>
              <button
                onClick={() => {
                  setSelectedTab("simulator");
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 font-black cursor-pointer ${selectedTab === "simulator" ? "text-blue-400" : "text-gray-300 hover:text-white"}`}
              >
                Simular Setup / Upgrade
              </button>
            </nav>

            <div className="pt-6 border-t border-white/10 text-xs text-gray-500 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                <button onClick={() => { onOpenLocationModal(); setIsMobileMenuOpen(false); }} className="hover:underline text-gray-300 cursor-pointer">
                  {currentDistrict ? `Envío en: ${currentDistrict}` : "Seleccionar Ubicación de despacho"}
                </button>
              </div>
              <p>Av. Vía Evitamiento 1639, Ate, Lima</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
