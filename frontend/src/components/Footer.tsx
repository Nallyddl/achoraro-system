import { Award, CheckCircle2, ChevronUp, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface FooterProps {
  currentDistrict?: string;
  onOpenLocationModal?: () => void;
}

export default function Footer({ currentDistrict, onOpenLocationModal }: FooterProps) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsappOpen = () => {
    const phone = "51942320156";
    const msg = `Hola Achorao 👋, quiero asesorarme sobre componentes gaming de la web www.achorao.com. Ubicación actual: ${currentDistrict || "Lima"}.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <footer className="bg-[#0F0F12] border-t border-white/10 text-gray-300 pt-16 selection:bg-blue-600/30 selection:text-white" id="site-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-white/5 px-4 md:px-8">
        
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-1.5">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">A</div>
            <span className="font-extrabold text-white tracking-widest">ACHORAO <span className="text-blue-500 font-medium">GAMER</span></span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            Más de 2,000 productos y 80 marcas AAA tecnológicas. Llegamos en 99 Minutos o tu envío es gratis en Lima Metropolitana. Todo con 12 meses de garantía real de fábrica.
          </p>
          <div className="flex gap-3">
            <img 
              src="https://cdn.shopify.com/s/files/1/0044/0234/8104/files/Google_review.png?v=1749057930&width=160" 
              alt="Google reviews" 
              className="h-10 border border-white/5 rounded-lg bg-black/40 p-1"
            />
            <div className="text-xs font-bold self-center">
              <span className="text-yellow-400">★★★★★</span>
              <p className="text-[10px] text-gray-500 font-black">+1,500 Google Reviews</p>
            </div>
          </div>
        </div>

        {/* Col 2: Atencion Cliente */}
        <div className="space-y-3 text-xs md:text-sm">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-blue-500 pl-2">
            Atención al Cliente
          </h4>
          <ul className="space-y-2 text-gray-400 font-medium">
            <li><a href="#envios" className="hover:text-blue-400 transition-colors">Seguimiento de Envío</a></li>
            <li><a href="#comprar" className="hover:text-blue-400 transition-colors">¿Cómo Comprar?</a></li>
            <li><a href="#cambios" className="hover:text-blue-400 transition-colors">Cambios y Devoluciones</a></li>
            <li><a href="#soporte" className="hover:text-blue-400 transition-colors">Soporte y Garantías</a></li>
            <li><a href="#sugerencias" className="hover:text-blue-400 transition-colors">Libro de Sugerencias</a></li>
          </ul>
        </div>

        {/* Col 3: Legales */}
        <div className="space-y-3 text-xs md:text-sm">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-blue-500 pl-2">
            Legales / Políticas
          </h4>
          <ul className="space-y-2 text-gray-400 font-medium">
            <li><a href="#terminos" className="hover:text-blue-400 transition-colors">Términos y Condiciones</a></li>
            <li><a href="#privacidad" className="hover:text-blue-400 transition-colors">Políticas de Privacidad</a></li>
            <li><a href="#cookies" className="hover:text-blue-400 transition-colors">Política de Cookies</a></li>
            <li><a href="#reembolso" className="hover:text-blue-400 transition-colors">Derechos ARCO</a></li>
            <li><a href="#libro-reclamaciones" className="hover:text-blue-400 transition-colors">Libro de Reclamaciones</a></li>
          </ul>
        </div>

        {/* Col 4: Empresa */}
        <div className="space-y-3 text-xs md:text-sm">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-blue-500 pl-2">
            Empresa
          </h4>
          <ul className="space-y-2 text-gray-400 font-medium">
            <li><a href="#nosotros" className="hover:text-blue-400 transition-colors">¿Quiénes Somos?</a></li>
            <li><a href="#tienda" className="hover:text-blue-400 transition-colors">Tienda Física</a></li>
            <li><a href="#corporativos" className="hover:text-blue-400 transition-colors">Mayoristas Corporativos</a></li>
            <li><a href="#unete" className="hover:text-blue-400 transition-colors">Trabaja con Nosotros</a></li>
          </ul>
        </div>

        {/* Col 5: Contacto */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-l-2 border-blue-500 pl-2">
            Contacto principal
          </h4>
          <ul className="space-y-2 text-gray-400 font-medium">
            <li className="flex items-center gap-1.5"><Phone size={11} className="text-blue-500" /> WhatsApp Directo L-S</li>
            <li className="flex items-center gap-1.5"><Mail size={11} className="text-blue-500" /> pagos@achorao.com</li>
            <li className="flex items-center gap-1.5"><MapPin size={11} className="text-blue-500" /> Vía Evitamiento 1639, Ate</li>
            <li className="pt-2">
              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">EMPRESA OFICIAL DE CONFIANZA</span>
              <div className="flex gap-1.5 mt-1">
                <div className="bg-black/40 border border-white/5 px-2 py-1 rounded text-center">
                  <Award size={14} className="text-blue-500 mt-0.5 mx-auto" />
                  <span className="text-[8px] font-bold tracking-tighter block mt-0.5">1er Lugar</span>
                </div>
                <div className="bg-black/40 border border-white/5 px-2 py-1 rounded text-center">
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 mx-auto" />
                  <span className="text-[8px] font-bold tracking-tighter block mt-0.5">Verificado</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment methods list footer */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-8 border-b border-white/5 px-4 md:px-8">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider font-mono">
          Métodos de Pago Seguros en Perú
        </div>
        <div className="flex flex-wrap gap-2.5 justify-center">
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">Visa</span>
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">Mastercard</span>
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">Amex</span>
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">Diners</span>
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">PayPal</span>
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">Yape</span>
          <span className="text-[10px] uppercase font-semibold bg-black/40 border border-white/5 text-gray-400 rounded px-2.5 py-1 font-mono">Plin</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 font-medium px-4 md:px-8 gap-2">
        <p>&copy; {new Date().getFullYear()} Achorao Gamer Store. Todos los derechos reservados. Licencia Premium.</p>
        <p className="flex items-center gap-1 font-mono text-[10px]">
          <span>LIMA, PERÚ</span>
          <span className="text-blue-500">🇵🇪</span>
        </p>
      </div>

      {/* Bottom Status Bar matching the mockup exact format */}
      <div className="h-10 bg-[#0A0A0B] border-t border-white/10 px-6 sm:px-8 flex items-center justify-between text-[10px] text-gray-500 font-mono mt-4">
        <div className="flex gap-4 sm:gap-6">
          <span>NODE_ENV: <span className="text-blue-400 font-semibold">PROD</span></span>
          <span className="hidden sm:inline">DOCKER_CONTAINER: <span className="text-gray-400">api-scraper-v2.1</span></span>
          <span>DB: <span className="text-emerald-400 font-semibold">PostgreSQL 15</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span>RAM USAGE: 142MB</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> API: CONNECTED
          </span>
        </div>
      </div>

      {/* Floating Scroll to Top button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 sm:right-8 bg-[#0F0F12] hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white rounded-full p-3.5 shadow-2xl transition-all z-45"
          id="btn-scroll-to-top"
          title="Subir al inicio"
        >
          <ChevronUp size={18} />
        </button>
      )}

      {/* Floating WhatsApp fab element toggle bubble */}
      <button
        onClick={handleWhatsappOpen}
        className="fixed bottom-6 right-6 sm:right-8 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full p-4 shadow-2xl transition-all z-45 flex items-center justify-center border border-emerald-400"
        id="btn-whatsapp-floating"
        title="Asistente de Ventas WhatsApp"
      >
        <Phone size={18} className="rotate-90 fill-current text-white" />
      </button>
    </footer>
  );
}
