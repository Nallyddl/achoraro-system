import { useEffect, useState } from 'react';
import { CPU, GPU, mockCPUs, mockGPUs, mockMotherboards, mockRAM, mockStorage, Motherboard, RAM, Storage } from '../types';

interface PCBuilderProps {
  onAddToCart: (config: any) => void; // para integrar con tu carrito
}

export default function PCBuilder({ onAddToCart }: PCBuilderProps) {
  const [selectedCPU, setSelectedCPU] = useState<CPU | null>(null);
  const [compatibleMotherboards, setCompatibleMotherboards] = useState<Motherboard[]>([]);
  const [selectedMB, setSelectedMB] = useState<Motherboard | null>(null);
  const [compatibleRAM, setCompatibleRAM] = useState<RAM[]>([]);
  const [selectedRAM, setSelectedRAM] = useState<RAM | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
  const [selectedGPU, setSelectedGPU] = useState<GPU | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Filtrar placas madre según socket del CPU
  useEffect(() => {
    if (selectedCPU) {
      const filtered = mockMotherboards.filter(mb => mb.socket === selectedCPU.socket);
      setCompatibleMotherboards(filtered);
      // Resetear placa si la actual no es compatible
      if (selectedMB && !filtered.find(mb => mb.id === selectedMB.id)) {
        setSelectedMB(null);
      }
    } else {
      setCompatibleMotherboards([]);
      setSelectedMB(null);
    }
  }, [selectedCPU]);

  // Filtrar RAM según el tipo de la placa madre
  useEffect(() => {
    if (selectedMB) {
      const filtered = mockRAM.filter(ram => ram.type === selectedMB.ramType);
      setCompatibleRAM(filtered);
      if (selectedRAM && !filtered.find(ram => ram.id === selectedRAM.id)) {
        setSelectedRAM(null);
      }
    } else {
      setCompatibleRAM([]);
      setSelectedRAM(null);
    }
  }, [selectedMB]);

  // Recalcular precio total
  useEffect(() => {
    let sum = 0;
    if (selectedCPU) sum += selectedCPU.price;
    if (selectedMB) sum += selectedMB.price;
    if (selectedRAM) sum += selectedRAM.price;
    if (selectedStorage) sum += selectedStorage.price;
    if (selectedGPU) sum += selectedGPU.price;
    setTotalPrice(sum);
  }, [selectedCPU, selectedMB, selectedRAM, selectedStorage, selectedGPU]);

  const handleAddToCart = () => {
    const config = {
      cpu: selectedCPU,
      motherboard: selectedMB,
      ram: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
      totalPrice,
    };
    onAddToCart(config);
    // Aquí puedes mostrar un toast o abrir el carrito
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-white">
      <div className="border-b border-white/10 pb-4 mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-red-500 pl-3">🛠️ Arma tu PC paso a paso</h2>
        <p className="text-gray-400 text-sm mt-2">Selecciona cada componente y el sistema te mostrará solo opciones compatibles.</p>
      </div>

      {/* 1. CPU */}
      <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-5 mb-5">
        <label className="block text-red-400 font-bold mb-3">1. Procesador (CPU)</label>
        <select
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
          value={selectedCPU?.id || ''}
          onChange={(e) => {
            const cpu = mockCPUs.find(c => c.id === e.target.value);
            setSelectedCPU(cpu || null);
          }}
        >
          <option value="">-- Selecciona una CPU --</option>
          {mockCPUs.map(cpu => (
            <option key={cpu.id} value={cpu.id}>{cpu.name} - S/. {cpu.price.toFixed(2)}</option>
          ))}
        </select>
        {selectedCPU && (
          <div className="mt-2 text-xs text-gray-400">
            Socket: {selectedCPU.socket} | Núcleos: {selectedCPU.cores}
          </div>
        )}
      </div>

      {/* 2. Placa madre (solo compatibles) */}
      {selectedCPU && (
        <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-5 mb-5">
          <label className="block text-red-400 font-bold mb-3">2. Placa madre (compatible con {selectedCPU.socket})</label>
          {compatibleMotherboards.length === 0 ? (
            <p className="text-yellow-400 text-sm">⚠️ No hay placas madre compatibles con este procesador.</p>
          ) : (
            <select
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
              value={selectedMB?.id || ''}
              onChange={(e) => {
                const mb = compatibleMotherboards.find(m => m.id === e.target.value);
                setSelectedMB(mb || null);
              }}
            >
              <option value="">-- Selecciona una placa madre --</option>
              {compatibleMotherboards.map(mb => (
                <option key={mb.id} value={mb.id}>{mb.name} - S/. {mb.price.toFixed(2)}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* 3. RAM (compatible con placa) */}
      {selectedMB && compatibleRAM.length > 0 && (
        <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-5 mb-5">
          <label className="block text-red-400 font-bold mb-3">3. Memoria RAM (compatible con {selectedMB.ramType})</label>
          <select
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
            value={selectedRAM?.id || ''}
            onChange={(e) => {
              const ram = compatibleRAM.find(r => r.id === e.target.value);
              setSelectedRAM(ram || null);
            }}
          >
            <option value="">-- Selecciona RAM --</option>
            {compatibleRAM.map(ram => (
              <option key={ram.id} value={ram.id}>{ram.name} {ram.capacity}GB - S/. {ram.price.toFixed(2)}</option>
            ))}
          </select>
        </div>
      )}

      {/* 4. Almacenamiento */}
      <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-5 mb-5">
        <label className="block text-red-400 font-bold mb-3">4. Almacenamiento</label>
        <select
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
          value={selectedStorage?.id || ''}
          onChange={(e) => {
            const storage = mockStorage.find(s => s.id === e.target.value);
            setSelectedStorage(storage || null);
          }}
        >
          <option value="">-- Selecciona un disco --</option>
          {mockStorage.map(storage => (
            <option key={storage.id} value={storage.id}>{storage.name} {storage.capacity} - S/. {storage.price.toFixed(2)}</option>
          ))}
        </select>
      </div>

      {/* 5. GPU */}
      <div className="bg-[#0F0F12] border border-white/10 rounded-xl p-5 mb-5">
        <label className="block text-red-400 font-bold mb-3">5. Tarjeta gráfica (GPU)</label>
        <select
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
          value={selectedGPU?.id || ''}
          onChange={(e) => {
            const gpu = mockGPUs.find(g => g.id === e.target.value);
            setSelectedGPU(gpu || null);
          }}
        >
          <option value="">-- Selecciona una GPU --</option>
          {mockGPUs.map(gpu => (
            <option key={gpu.id} value={gpu.id}>{gpu.name} - {gpu.vram}GB - S/. {gpu.price.toFixed(2)}</option>
          ))}
        </select>
      </div>

      {/* Barra fija inferior con total y botón */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F0F12] border-t border-red-500/30 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-50 shadow-2xl">
        <div className="text-white text-center sm:text-left">
          <span className="text-sm uppercase tracking-wide">Total estimado</span>
          <span className="text-2xl font-bold text-red-500 ml-2 font-mono">S/. {totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selectedCPU || !selectedMB || !selectedRAM || !selectedStorage || !selectedGPU}
          className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-400 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-500/20"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}