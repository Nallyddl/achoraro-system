import { MapPin, X } from "lucide-react";
import { useState } from "react";
import { DistrictInfo } from "../types";

/**
 * Diccionario estático que mapea las ubicaciones soportadas en Perú con su información de despacho
 * Contiene costos de envío, tiempos estimados de entrega y métodos de despacho específicos
 */
export const PERU_DISTRICTS: { [name: string]: DistrictInfo } = {
  "Ate": { name: "Ate (Tienda principal)", deliveryCost: 0, days: "Hoy mismo / Recojo gratis", methods: ["Recojo", "Envío 99 Minutos"] },
  "Miraflores": { name: "Miraflores", deliveryCost: 15, days: "Hoy mismo (99 min o es gratis)", methods: ["Envío Express", "Regular"] },
  "San Isidro": { name: "San Isidro", deliveryCost: 15, days: "Hoy mismo (99 min o es gratis)", methods: ["Envío Express", "Regular"] },
  "Santiago de Surco": { name: "Santiago de Surco", deliveryCost: 12, days: "Hoy mismo (99 min o es gratis)", methods: ["Envío Express", "Regular"] },
  "La Molina": { name: "La Molina", deliveryCost: 12, days: "Hoy mismo (99 min o es gratis)", methods: ["Envío Express", "Regular"] },
  "San Borja": { name: "San Borja", deliveryCost: 12, days: "Hoy mismo (99 min o es gratis)", methods: ["Envío Express", "Regular"] },
  "San Miguel": { name: "San Miguel", deliveryCost: 18, days: "Hoy mismo (24h de límite)", methods: ["Envío Hoy", "Regular"] },
  "Los Olivos": { name: "Los Olivos", deliveryCost: 20, days: "Próximas 24 horas", methods: ["Envío 24-48h"] },
  "Chorrillos": { name: "Chorrillos", deliveryCost: 18, days: "Próximas 24 horas", methods: ["Envío 24-48h"] },
  "Provincias (Shalom)": { name: "Provincias (Shalom / Olva Courier)", deliveryCost: 25, days: "2 a 3 días hábiles", methods: ["Agencia Shalom", "Domicilio Olva"] }
};

/**
 * Interfaz que define las propiedades requeridas por el componente LocationModal
 */
interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDistrict: string;
  onSelectDistrict: (name: string) => void;
}

/**
 * Componente 'LocationModal'
 * Renderiza una ventana modal flotante para la selección de ubicación del usuario en Perú.
 * Actúa como un búfer intermedio: mantiene un estado de selección temporal (`tempDistrict`) y solo actualiza
 *  el estado global de la aplicación una vez que el usuario presiona el botón "Confirmar Ubicación"
 * Muestra en tiempo real la cotización y tiempos de envío según la opción seleccionada
 */
export default function LocationModal({ isOpen, onClose, selectedDistrict, onSelectDistrict }: LocationModalProps) {
  const [tempDistrict, setTempDistrict] = useState(selectedDistrict);

  if (!isOpen) return null;

  const handleSave = () => {
    onSelectDistrict(tempDistrict);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Fondo oscuro difuminado) */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose}></div>

      {/* Contenedor del Panel del Modal */}
      <div className="relative w-full max-w-md bg-[#0F0F12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 text-white animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
          id="btn-close-location"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
              <MapPin size={18} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Elige tu ubicación</h3>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Ingresa tu distrito o provincia para cotizar envíos y tiempos de entrega automáticos para tus setups gaming.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-mono">
                Distrito o Provincia (Perú)
              </label>
              <select
                value={tempDistrict}
                onChange={(e) => setTempDistrict(e.target.value)}
                className="w-full h-11 bg-[#0A0A0B] border border-white/10 rounded-xl px-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                id="select-district-modal"
              >
                <option value="">Selecciona tu ubicación...</option>
                {Object.keys(PERU_DISTRICTS).map((name) => (
                  <option key={name} value={name}>
                    {PERU_DISTRICTS[name].name}
                  </option>
                ))}
              </select>
            </div>

            {tempDistrict && PERU_DISTRICTS[tempDistrict] && (
              <div className="bg-[#0A0A0B] border border-white/5 rounded-xl p-4 text-xs space-y-2 font-sans">
                <div className="flex justify-between">
                  <span className="text-gray-500">Costo de envío:</span>
                  <span className="font-bold text-emerald-400">
                    {PERU_DISTRICTS[tempDistrict].deliveryCost === 0
                      ? "¡Gratis!"
                      : `S/. ${PERU_DISTRICTS[tempDistrict].deliveryCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tiempo estimado:</span>
                  <span className="font-bold text-gray-300">{PERU_DISTRICTS[tempDistrict].days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Métodos disponibles:</span>
                  <span className="font-bold text-blue-400 font-mono">
                    {PERU_DISTRICTS[tempDistrict].methods.join(" / ")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!tempDistrict}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl mt-6 transition-colors shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 cursor-pointer"
            id="btn-confirm-location"
          >
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
}
