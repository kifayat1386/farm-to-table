'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FallbackMap from '@/components/map/FallbackMap';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { io, Socket } from 'socket.io-client';
import { ThermometerSun, Droplet } from 'lucide-react';

interface SensorData {
  farmId: string;
  temperature: number;
  ph: number;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export default function FarmsPage() {
  const [selectedFarmId, setSelectedFarmId] = useState<string | undefined>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    if (selectedFarmId && isDrawerOpen) {
      // Fetch Products via REST
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/market/farm/${selectedFarmId}/products`)
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setProducts([]);
          }
        })
        .catch(err => console.error('Failed to fetch products:', err));

      // Connect to the NestJS WebSocket Gateway
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        newSocket.emit('join-farm-stream', selectedFarmId);
      });

      newSocket.on('sensor-update', (data: SensorData) => {
        console.log('Received sensor update:', data);
        if (data.farmId === selectedFarmId) {
          setSensorData(data);
        }
      });

      return () => {
        newSocket.emit('leave-farm-stream', selectedFarmId);
        newSocket.disconnect();
        setSocket(null);
        setSensorData(null);
        setProducts([]);
      };
    }
  }, [selectedFarmId, isDrawerOpen]);

  const handleSelectFarm = (farmId: string) => {
    setSelectedFarmId(farmId);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-12 bg-cream min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-charcoal">Live Market Map</h1>
            <p className="text-charcoal/70 mt-2">Select a region to view live telemetry and harvest drops.</p>
          </div>

          <FallbackMap onSelectFarm={handleSelectFarm} selectedFarmId={selectedFarmId} />

          <Sheet open={isDrawerOpen} onOpenChange={(open) => {
            setIsDrawerOpen(open);
            if (!open) {
              // slight delay to avoid jitter when closing
              setTimeout(() => setSelectedFarmId(undefined), 300);
            }
          }}>
            <SheetContent side="right" className="bg-cream border-l border-charcoal/10 sm:max-w-md w-full overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-heading text-2xl text-charcoal">Farm Telemetry</SheetTitle>
                <SheetDescription className="text-charcoal/60">
                  Live sensor data from {selectedFarmId}
                </SheetDescription>
              </SheetHeader>

              {/* Live Telemetry Display */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-charcoal/5 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ThermometerSun className="w-24 h-24 text-sage" />
                  </div>
                  <ThermometerSun className="w-6 h-6 text-sage mb-2" />
                  <span className="text-sm font-medium text-charcoal/60 uppercase tracking-wider mb-1">Temp</span>
                  <span className="text-3xl font-bold text-charcoal tabular-nums">
                    {sensorData ? sensorData.temperature : '--'}°
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-charcoal/5 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Droplet className="w-24 h-24 text-sage" />
                  </div>
                  <Droplet className="w-6 h-6 text-sage mb-2" />
                  <span className="text-sm font-medium text-charcoal/60 uppercase tracking-wider mb-1">Soil pH</span>
                  <span className="text-3xl font-bold text-charcoal tabular-nums">
                    {sensorData ? sensorData.ph : '--'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading text-xl font-semibold text-charcoal border-b border-charcoal/10 pb-2">Available Products</h3>
                {products.length === 0 ? (
                  <p className="text-sm text-charcoal/60 italic">Loading inventory...</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="p-4 rounded border border-charcoal/10 bg-white/50">
                      <p className="font-medium text-charcoal">{product.name}</p>
                      <p className="text-sm text-sage mt-1">৳ {product.price} / {product.unit}</p>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </main>
    </>
  );
}
