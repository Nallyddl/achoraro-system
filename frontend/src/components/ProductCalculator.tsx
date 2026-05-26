import  { useState, useEffect } from "react";
import { Info, Calculator } from "lucide-react";

interface ProductCalculatorProps {
  basePrice: number; // S/. 339.90
  onAddToCart: () => void;
}

export default function ProductCalculator({ basePrice, onAddToCart }: ProductCalculatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<"cash" | "card" | "miles" | "cuotas" | "paypal">("cash");
  const [exchangeRate, setExchangeRate] = useState<number>(3.76); // Custom mock/Live Peruvian FX rate

  useEffect(() => {
    // Quick async fetch simulation for FX rate
    setExchangeRate(3.72 + Math.random() * 0.08);
  }, []);

  // Payments logic
  const cashPrice = basePrice;
  const cardPrice = basePrice * 1.05; // 5% CC surcharge
  const milesNeeded = Math.round(cardPrice / 0.03); // Millas standard conversion factor
  const monthlyInstallment = Math.round(cardPrice / 3);
  const paypalUsd = (cardPrice / exchangeRate).toFixed(2);

  return (
    <div className="bg-[#0F0F12] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl text-white select-none">
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <span className="text-xs text-blue-400 font-bold uppercase tracking-wider font-mono">COTIZADOR AL INSTANTE</span>
          <h4 className="text-base font-bold tracking-tight">Opciones de Pago Especializadas</h4>
        </div>
        <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 font-mono">
          <Calculator size={12} />
          99 Minutos o Gratis
        </div>
      </div>

      {/* Pricing Header Display */}
      <div className="bg-[#0A0A0B] rounded-xl p-4 text-center border border-white/5 space-y-1">
        <div className="flex justify-center items-baseline gap-2">
          {selectedMethod === "cash" && (
            <>
              <span className="text-3xl font-bold text-white font-mono">S/. {cashPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-500 line-through font-mono">S/. 429.90</span>
            </>
          )}
          {selectedMethod === "card" && (
            <span className="text-3xl font-bold text-white font-mono">S/. {cardPrice.toFixed(2)}</span>
          )}
          {selectedMethod === "miles" && (
            <span className="text-3xl font-bold text-white font-mono">{milesNeeded.toLocaleString()} Puntos</span>
          )}
          {selectedMethod === "cuotas" && (
            <span className="text-3xl font-bold text-white font-mono">3x S/. {monthlyInstallment.toFixed(2)}</span>
          )}
          {selectedMethod === "paypal" && (
            <span className="text-3xl font-bold text-white font-mono">$ {paypalUsd} USD</span>
          )}
        </div>
        <p className="text-xs text-gray-400 font-medium">
          {selectedMethod === "cash" && "Válido para Transferencia Directa, Yape, Plin o Efectivo en Tienda"}
          {selectedMethod === "card" && "Aplicable para cualquier tarjeta de Crédito o Débito"}
          {selectedMethod === "miles" && "Canjea via Puntos Interbank, Millas BCP o Puntos BBVA al instante"}
          {selectedMethod === "cuotas" && "Sin intereses con bancos asociados (BBVA, Diners, BCP Qore)"}
          {selectedMethod === "paypal" && `Conversión calculada al tipo de cambio especial (1 USD = S/. ${exchangeRate.toFixed(2)})`}
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#0A0A0B] border border-white/10 rounded-xl">
        <button
          onClick={() => setSelectedMethod("cash")}
          className={`py-2 text-[10px] font-bold uppercase text-center rounded-lg transition-colors cursor-pointer ${
            selectedMethod === "cash" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
          id="btn-calculator-cash"
        >
          Yape
        </button>
        <button
          onClick={() => setSelectedMethod("card")}
          className={`py-2 text-[10px] font-bold uppercase text-center rounded-lg transition-colors cursor-pointer ${
            selectedMethod === "card" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
          id="btn-calculator-card"
        >
          Tarjeta
        </button>
        <button
          onClick={() => setSelectedMethod("miles")}
          className={`py-2 text-[10px] font-bold uppercase text-center rounded-lg transition-colors cursor-pointer ${
            selectedMethod === "miles" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
          id="btn-calculator-miles"
        >
          Puntos
        </button>
        <button
          onClick={() => setSelectedMethod("cuotas")}
          className={`py-2 text-[10px] font-bold uppercase text-center rounded-lg transition-colors cursor-pointer ${
            selectedMethod === "cuotas" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
          id="btn-calculator-cuotas"
        >
          Cuotas
        </button>
        <button
          onClick={() => setSelectedMethod("paypal")}
          className={`py-2 text-[10px] font-bold uppercase text-center rounded-lg transition-colors cursor-pointer ${
            selectedMethod === "paypal" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
          id="btn-calculator-paypal"
        >
          PayPal
        </button>
      </div>

      {/* Payment detail summary card */}
      <div className="bg-[#0A0A0B]/40 rounded-xl p-4 border border-white/5 text-xs text-gray-300 space-y-2.5">
        <div className="flex items-center gap-2 text-white">
          <Info size={14} className="text-blue-400" />
          <span className="font-bold uppercase tracking-wider font-mono">Términos de Compra</span>
        </div>
        {selectedMethod === "cash" && (
          <p>
            No aplica comisiones. Compra directa y rápida. Tu producto se valida y entrega en un rango máximo de 99 Minutos en Lima Metropolitana si compras antes de las 4 p.m. de Lunes a Sábado.
          </p>
        )}
        {selectedMethod === "card" && (
          <p>
            Incluye la comisión regulada por pasarelas internacionales de pago. Acepta Visa, Mastercard, American Express y Diners Club. Puedes pagar directo en tienda o en web segura.
          </p>
        )}
        {selectedMethod === "miles" && (
          <p>
            Paga el 100% de tu compra o combina efectivo con puntos. Un asesor de Achorao validará tu canje de Millas de forma digital o en nuestro local principal a 10 min de el Jockey Plaza.
          </p>
        )}
        {selectedMethod === "cuotas" && (
          <p>
            Válido con tarjetas de Crédito BBVA y BCP seleccionadas. Programa de Financiamiento Inteligente de hasta 12 meses sin intereses en toda la marca Gravastar, Logitech y Corsair.
          </p>
        )}
        {selectedMethod === "paypal" && (
          <p>
            Ideal para envíos internacionales o cuentas extranjeras. Los costos de envío internacional se actualizan al completar tu dirección de despacho en la caja final.
          </p>
        )}
      </div>

      {/* Cart submission action */}
      <button
        onClick={onAddToCart}
        className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase rounded-xl transition-all tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 cursor-pointer"
        id="btn-calculator-add-to-cart"
      >
        Agregar a mi setup de compra
      </button>
    </div>
  );
}
