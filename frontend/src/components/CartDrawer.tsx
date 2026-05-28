import { CreditCard, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { CartItem } from "../types";

/**
 * Interfaz que define las propiedades del componente CartDrawer
 */
interface CartDrawerProps {
  // determina si el carrito está visible o no.
  isOpen: boolean;
  onClose: () => void;
  // listado de productos actualmente agregados al carrito
  cartItems: CartItem[];
  // actualizar la cantidad de un producto
  onUpdateQty: (productId: string, delta: number) => void;
  // eliminar por completo un producto del carrito
  onRemoveItem: (productId: string) => void;
  //vaciar todos los elementos del carrito
  onClearCart: () => void;
}

/**
 * Componente CartDrawer 
 * Renderiza el desglose de productos, cálculo de totales (con opción de comisión por tarjeta)
 * y simula el proceso de finalización de compra (Checkout)
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  // estado para saber si el usuario pagará con tarjeta (Aplicar comision)
  const [payWithCard, setPayWithCard] = useState(false);
  // estado de la animación de éxito al procesar el pedido
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  
  // Si el carrito no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Calculos totales
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cardFee = payWithCard ? subtotal * 0.05 : 0;
  const total = subtotal + cardFee;

  /**
   * Maneja la simulación de la compra/cotización.
   * Muestra la pantalla de éxito durante 3 segundos antes de limpiar el carrito y cerrar el panel.
   */
  const handleCheckout = () => {
    setIsCheckedOut(true);
    setTimeout(() => {
      // Simulate confirmation
      onClearCart();
      setIsCheckedOut(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Permite cerrar el carrito al hacer clic fuera del panel principal. */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0A0A0B] border-l border-white/10 h-full flex flex-col shadow-2xl z-10 text-white select-none animate-in slide-in-from-right duration-250">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-blue-500" size={20} />
            <h3 className="text-lg font-bold uppercase tracking-wider">Tu Carrito</h3>
            <span className="bg-[#0F0F12] border border-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer" id="btn-close-cart">
            <X size={20} />
          </button>
        </div>

        {/* Listado de productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
              <ShoppingBag size={48} className="text-gray-700" />
              <p className="text-gray-400 text-sm">Tu carrito de compras está vacío.</p>
              <button
                onClick={onClose}
                className="bg-[#0F0F12] border border-white/10 text-gray-200 px-5 py-2 rounded-full text-xs font-bold hover:bg-white/5 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-start gap-4 p-3 bg-[#0F0F12] border border-white/5 rounded-xl"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover bg-black border border-white/10"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-mono">
                      {item.product.vendor}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                      id={`remove-item-${item.product.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h5 className="text-sm font-bold leading-snug line-clamp-2 text-gray-200">
                    {item.product.title}
                  </h5>
                  <div className="flex justify-between items-center pt-2">
                    {/* Qty Manager */}
                    <div className="flex items-center border border-white/10 bg-black/40 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        id={`dec-qty-${item.product.id}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold px-3 select-none text-gray-200 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        id={`inc-qty-${item.product.id}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-blue-400 font-mono">
                      S/. {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección de acciones y desglose de precios */}
        {cartItems.length > 0 && !isCheckedOut && (
          <div className="p-6 border-t border-white/5 bg-[#0A0A0B] space-y-4">
            {/* Custom Payment fee switcher */}
            <div className="p-3 bg-[#0F0F12] border border-white/5 rounded-xl space-y-2">
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
                  <span className="text-gray-500">
                    Aplica +5% en Pasarela (Visa/Mastercard/Paypal/Cuotéalo)
                  </span>
                </div>
              </label>
            </div>

            {/* Desglose de precios finales */}
            <div className="text-sm space-y-2 px-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal:</span>
                <span className="font-bold text-gray-200 font-mono">S/. {subtotal.toFixed(2)}</span>
              </div>
              {payWithCard && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Comisión Digital (5%):</span>
                  <span className="font-mono">S/. {cardFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t border-white/5">
                <span className="font-bold">Total estimado:</span>
                <span className="font-bold text-blue-400 font-mono">S/. {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer hover:shadow-blue-500/25"
              id="btn-checkout"
            >
              <CreditCard size={16} />
              Proceder al Pago / Cotizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
