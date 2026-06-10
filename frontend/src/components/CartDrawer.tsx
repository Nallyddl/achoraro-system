import { CreditCard, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

// Pricing lookup mapping matching Simulator Console for auto-suggested trade-in values
const LOOKUP_PRICES: { [key: string]: number } = {
  "AMD Ryzen 5 5600X": 720.0,
  "AMD Ryzen 7 5700X": 950.0,
  "AMD Ryzen 7 7800X3D": 1790.0,
  "AMD Ryzen 9 7950X": 2790.0,
  "Intel Core i5-12400F": 680.0,
  "Intel Core i7-13700K": 1690.0,
  "Intel Core i9-14900K": 2590.0,
  "Intel Core i3-12100": 450.0,
  "Ryzen 5 3600": 390.0,
  "Intel Core i7-7700K": 590.0,
  "NVIDIA GeForce RTX 3060": 1390.0,
  "NVIDIA GeForce RTX 4060": 1590.0,
  "NVIDIA GeForce RTX 4070 SUPER": 2990.0,
  "NVIDIA GeForce RTX 4090": 8990.0,
  "AMD Radeon RX 6600": 990.0,
  "AMD Radeon RX 7800 XT": 2590.0,
  "NVIDIA GTX 1650": 650.0,
  "NVIDIA GeForce RTX 4080 SUPER": 4890.0,
  "NVIDIA GTX 1060": 550.0,
  "ASUS Prime H610M DDR4": 340.0,
  "ASUS Prime B760M-A WiFi DDR5": 620.0,
  "MSI PRO Z790-A WiFi DDR5": 1190.0,
  "MSI B550M PRO-VDH WiFi": 490.0,
  "ASUS TUF Gaming A620M-PLUS (AM5)": 590.0,
  "ASUS ROG STRIX X670E-F Gaming AM5": 1650.0,
  "8GB (1x8GB) DDR4 2666MHz": 110.0,
  "16GB (2x8GB) DDR4 3200MHz": 230.0,
  "16GB (1x16GB) DDR5 5200MHz": 290.0,
  "32GB (2x16GB) DDR5 6000MHz": 590.0,
  "64GB (2x32GB) DDR5 6400MHz": 1190.0,
  "HDD Toshiba 1TB SATA 7200 RPM": 190.0,
  "SSD Kingston A400 480GB SATA": 180.0,
  "SSD Kingston NV2 1TB NVMe PCIe 4.0": 290.0,
  "Corsair MP600 Pro 2TB NVMe PCIe 4.0": 790.0,
};

const POPULAR_CPUS = [
  "AMD Ryzen 5 5600X",
  "AMD Ryzen 7 5700X",
  "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 9 7950X",
  "Intel Core i5-12400F",
  "Intel Core i7-13700K",
  "Intel Core i9-14900K",
  "Intel Core i3-12100",
];

const POPULAR_GPUS = [
  "NVIDIA GeForce RTX 3060",
  "NVIDIA GeForce RTX 4060",
  "NVIDIA GeForce RTX 4070 SUPER",
  "NVIDIA GeForce RTX 4090",
  "AMD Radeon RX 6605",
  "AMD Radeon RX 7800 XT",
  "NVIDIA GTX 1650",
  "NVIDIA GeForce RTX 4080 SUPER",
];

const POPULAR_PLACAS = [
  "MSI B550M PRO-VDH WiFi",
  "ASUS Prime H610M DDR4",
  "ASUS Prime B760M-A WiFi DDR5",
  "MSI PRO Z790-A WiFi DDR5",
  "ASUS TUF Gaming A620M-PLUS (AM5)",
  "ASUS ROG STRIX X670E-F Gaming AM5",
];

const POPULAR_RAMS = [
  "16GB (2x8GB) DDR4 3200MHz",
  "8GB (1x8GB) DDR4 2666MHz",
  "16GB (1x16GB) DDR5 5200MHz",
  "32GB (2x16GB) DDR5 6000MHz",
  "64GB (2x32GB) DDR5 6400MHz",
];

const POPULAR_STORAGES = [
  "SSD Kingston A400 480GB SATA",
  "HDD Toshiba 1TB SATA 7200 RPM",
  "SSD Kingston NV2 1TB NVMe PCIe 4.0",
  "Corsair MP600 Pro 2TB NVMe PCIe 4.0",
];

const COMPONENT_OPTIONS = {
  cpu: POPULAR_CPUS,
  gpu: POPULAR_GPUS,
  placa: POPULAR_PLACAS,
  ram: POPULAR_RAMS,
  storage: POPULAR_STORAGES,
};

function getSuggestedPrice(name: string, type: string): number {
  if (!name) return 0;
  const originalPrice = LOOKUP_PRICES[name];
  if (originalPrice) return Math.round(originalPrice * 0.4);
  switch (type) {
    case "cpu": return 150;
    case "gpu": return 250;
    case "placa": return 100;
    case "ram": return 80;
    case "storage": return 50;
    default: return 50;
  }
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [payWithCard, setPayWithCard] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  // Trade-In States
  const [useTradeIn, setUseTradeIn] = useState(false);
  const [currentSpecs, setCurrentSpecs] = useState<{
    cpu: string;
    gpu: string;
    placa: string;
    ram: string;
    storage: string;
  }>({ cpu: "", gpu: "", placa: "", ram: "", storage: "" });

  const [enabledParts, setEnabledParts] = useState<{ [key: string]: boolean }>({
    cpu: false,
    gpu: false,
    placa: false,
    ram: false,
    storage: false,
  });

  const [tradeInPrices, setTradeInPrices] = useState<{ [key: string]: number }>({
    cpu: 150,
    gpu: 250,
    placa: 100,
    ram: 80,
    storage: 55,
  });

  // Load specs from localStorage on mount & when drawer opens
  useEffect(() => {
    if (isOpen) {
      try {
        const cCpu = localStorage.getItem("ach_currentCpu") || "";
        const cGpu = localStorage.getItem("ach_currentGpu") || "";
        const cPlaca = localStorage.getItem("ach_currentPlaca") || "";
        const cRam = localStorage.getItem("ach_currentRam") || "";
        const cStorage = localStorage.getItem("ach_currentStorage") || "";

        setCurrentSpecs({
          cpu: cCpu,
          gpu: cGpu,
          placa: cPlaca,
          ram: cRam,
          storage: cStorage,
        });

        // Autodetect which ones are entered as current, and activate trade-in selection automatically
        const newEnabled: { [key: string]: boolean } = {
          cpu: !!cCpu,
          gpu: !!cGpu,
          placa: !!cPlaca,
          ram: !!cRam,
          storage: !!cStorage,
        };
        setEnabledParts(newEnabled);

        // Pre-populate trade-in prices based on current specs
        setTradeInPrices({
          cpu: getSuggestedPrice(cCpu, "cpu"),
          gpu: getSuggestedPrice(cGpu, "gpu"),
          placa: getSuggestedPrice(cPlaca, "placa"),
          ram: getSuggestedPrice(cRam, "ram"),
          storage: getSuggestedPrice(cStorage, "storage"),
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sync back to localStorage if user selects component inside Cart
  const handleUpdateComponent = (type: string, val: string) => {
    try {
      localStorage.setItem(`ach_current${type.charAt(0).toUpperCase() + type.slice(1)}`, val);
      setCurrentSpecs((prev) => ({ ...prev, [type]: val }));
      
      // Toggle it active automatically
      setEnabledParts((prev) => ({ ...prev, [type]: !!val }));

      const sugPrice = getSuggestedPrice(val, type);
      setTradeInPrices((prev) => ({ ...prev, [type]: sugPrice }));
    } catch (e) {
      console.error(e);
    }
  };

  // Totals calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cardFee = payWithCard ? subtotal * 0.05 : 0;

  let tradeInDiscount = 0;
  if (useTradeIn) {
    if (enabledParts.cpu && currentSpecs.cpu) tradeInDiscount += tradeInPrices.cpu || 0;
    if (enabledParts.gpu && currentSpecs.gpu) tradeInDiscount += tradeInPrices.gpu || 0;
    if (enabledParts.placa && currentSpecs.placa) tradeInDiscount += tradeInPrices.placa || 0;
    if (enabledParts.ram && currentSpecs.ram) tradeInDiscount += tradeInPrices.ram || 0;
    if (enabledParts.storage && currentSpecs.storage) tradeInDiscount += tradeInPrices.storage || 0;
  }

  const subtotalWithFee = subtotal + cardFee;
  const total = Math.max(0, subtotalWithFee - tradeInDiscount);

  const handleCheckout = () => {
    setIsCheckedOut(true);
    setTimeout(() => {
      // Simulate confirmation and clear cart
      onClearCart();
      setIsCheckedOut(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0A0A0B] border-l border-white/10 h-full flex flex-col shadow-2xl z-10 text-white select-none animate-in slide-in-from-right duration-250">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-500" size={20} />
            <h3 className="text-lg font-bold uppercase tracking-wider">Tu Carrito</h3>
            <span className="bg-[#0F0F12] border border-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-full font-bold font-mono">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer" id="btn-close-cart">
            <X size={20} />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isCheckedOut ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 text-2xl font-bold animate-bounce">
                ✓
              </div>
              <h4 className="text-xl font-bold text-blue-450">¡Pedido Realizado!</h4>
              <p className="text-sm text-gray-400 max-w-xs">
                Tu cotización ha sido procesada con éxito por Achorao. En unos minutos nos comunicaremos para coordinar tu envío gratis de 99 min.
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={48} className="text-gray-705" />
              <p className="text-gray-400 text-sm">Tu carrito de compras está vacío.</p>
              <button
                onClick={onClose}
                className="bg-[#0F0F12] border border-white/10 text-gray-200 px-5 py-2 rounded-full text-xs font-bold hover:bg-white/5 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start gap-4 p-3 bg-[#0F0F12] border border-white/5 rounded-xl"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-lg object-contain bg-black border border-white/10 p-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-mono">
                        {item.product.vendor}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-550 hover:text-red-400 transition-colors cursor-pointer"
                        id={`remove-item-${item.product.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h5 className="text-[12px] font-bold leading-normal line-clamp-2 text-gray-200">
                      {item.product.title}
                    </h5>
                    <div className="flex justify-between items-center pt-1.5">
                      {/* Qty Manager */}
                      <div className="flex items-center border border-white/10 bg-black/40 rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQty(item.product.id, -1)}
                          className="p-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          id={`dec-qty-${item.product.id}`}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-[11px] font-bold px-2.5 select-none text-gray-200 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, 1)}
                          className="p-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          id={`inc-qty-${item.product.id}`}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-blue-400 font-mono">
                        S/. {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions with Trade-in section */}
        {cartItems.length > 0 && !isCheckedOut && (
          <div className="p-6 border-t border-white/5 bg-[#0A0A0B] space-y-4 max-h-[60%] overflow-y-auto">
            
            {/* Custom Payment fee switcher */}
            <div className="p-3 bg-[#0F0F12]/80 border border-white/5 rounded-2xl space-y-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={payWithCard}
                  onChange={(e) => setPayWithCard(e.target.checked)}
                  className="accent-blue-600 rounded w-4 h-4 cursor-pointer"
                  id="chk-card-fee"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-gray-200 block">¿Pagas con Tarjeta de Crédito?</span>
                  <span className="text-gray-500 text-[10px]">
                    Aplica +5% en Pasarela (Visa/Mastercard/Paypal/Cuotéalo)
                  </span>
                </div>
              </label>
            </div>

            {/* NEW: Trade-In Section (Pagar con piezas viejas que ingresó el usuario) */}
            <div className="p-3 bg-[#0F0F12] border border-white/15 rounded-2xl space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useTradeIn}
                  onChange={(e) => setUseTradeIn(e.target.checked)}
                  className="accent-emerald-500 rounded w-4 h-4 cursor-pointer"
                  id="chk-trade-in"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-gray-150 block">¿Pagar con piezas viejas / Trade-in?</span>
                  <span className="text-emerald-400 text-[10px] font-bold block uppercase tracking-wide">
                    ¡Véndenos tus partes viejas como descuento! <i className="bi bi-fire text-amber-500"></i>
                  </span>
                </div>
              </label>

              {useTradeIn && (
                <div className="pt-2.5 border-t border-white/5 space-y-3">
                  <div className="bg-[#0A0A0B] p-2 rounded-xl text-[9px] text-gray-450 leading-relaxed font-semibold border border-white/5">
                    Se detectaron tus componentes del simulador. Selecciona las piezas que deseas vender, ingresa el precio acordado y se aplicará un descuento directo al total.
                  </div>

                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {[
                      { key: "cpu", label: "Procesador (CPU)", iconClass: "bi bi-cpu text-blue-400" },
                      { key: "gpu", label: "Tarjeta Gráfica (GPU)", iconClass: "bi bi-controller text-emerald-400" },
                      { key: "placa", label: "Placa Madre", iconClass: "bi bi-diagram-3-fill text-purple-400" },
                      { key: "ram", label: "Memoria RAM", iconClass: "bi bi-lightning-charge-fill text-amber-400" },
                      { key: "storage", label: "Almacenamiento / Disco", iconClass: "bi bi-hdd-fill text-pink-400" },
                    ].map(({ key, label, iconClass }) => {
                      const value = (currentSpecs as any)[key];
                      const isEnabled = (enabledParts as any)[key];
                      const price = (tradeInPrices as any)[key] || 0;
                      const optionsList = (COMPONENT_OPTIONS as any)[key] || [];

                      return (
                        <div key={key} className="p-2.5 bg-[#050506] border border-white/5 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) => setEnabledParts(prev => ({ ...prev, [key]: e.target.checked }))}
                                disabled={!value}
                                className="accent-emerald-500 rounded w-3.5 h-3.5 cursor-pointer disabled:opacity-30"
                              />
                              <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                                <i className={`${iconClass} text-xs`}></i> {label}
                              </span>
                            </label>

                            {isEnabled && value && (
                              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black font-mono">
                                SELECCIONADO
                              </span>
                            )}
                          </div>

                          <div className="pl-5 space-y-2">
                            {value ? (
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="text-gray-400 leading-tight line-clamp-1 flex-1 font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                  {value}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateComponent(key, "")}
                                  className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase transition-colors"
                                >
                                  Quitar
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <span className="block text-[8px] text-gray-500 font-bold uppercase">No cargada en actual:</span>
                                <select
                                  value={value}
                                  onChange={(e) => handleUpdateComponent(key, e.target.value)}
                                  className="w-full h-8 bg-[#0A0A0B] border border-white/10 rounded-lg px-2 text-[10px] text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                  <option value="">-- Cargar componente aquí --</option>
                                  {optionsList.map((opt: string) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {value && (
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                                <span className="text-[9px] text-gray-400 font-semibold uppercase">Precio Acordado:</span>
                                <div className="flex items-center bg-[#0A0A0B] border border-white/10 rounded-lg px-2 h-7 w-28">
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold pr-1">S/.</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={price || ""}
                                    onChange={(e) => {
                                      const p = Math.max(0, parseInt(e.target.value) || 0);
                                      setTradeInPrices(prev => ({ ...prev, [key]: p }));
                                    }}
                                    className="w-full text-[11px] font-bold text-right text-emerald-400 font-mono bg-transparent outline-none border-none p-0 focus:ring-0"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price lines */}
            <div className="text-xs space-y-2 px-1">
              <div className="flex justify-between">
                <span className="text-gray-450 font-medium">Subtotal:</span>
                <span className="font-bold text-gray-200 font-mono">S/. {subtotal.toFixed(2)}</span>
              </div>
              
              {payWithCard && (
                <div className="flex justify-between text-gray-450">
                  <span>Comisión Digital (5%):</span>
                  <span className="font-mono">S/. {cardFee.toFixed(2)}</span>
                </div>
              )}

              {useTradeIn && tradeInDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-black animate-pulse">
                  <span>Descuento Piezas Viejas (Trade-In):</span>
                  <span className="font-mono">- S/. {tradeInDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base pt-2.5 border-t border-white/10">
                <span className="font-bold text-gray-100">Total estimado:</span>
                <span className="font-bold text-blue-500 font-mono text-lg text-red-500">
                  S/. {total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer hover:shadow-blue-500/25"
              id="btn-checkout"
            >
              <CreditCard size={15} />
              Proceder al Pago / Cotizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
