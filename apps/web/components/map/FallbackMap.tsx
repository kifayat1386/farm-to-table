'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface FarmMarker {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
}

interface FallbackMapProps {
  onSelectFarm: (farmId: string) => void;
  selectedFarmId?: string;
}

const BANGLADESH_GEO = {
  minLng: 88.0,
  maxLng: 92.7,
  minLat: 20.5,
  maxLat: 26.8,
};

export default function FallbackMap({ onSelectFarm, selectedFarmId }: FallbackMapProps) {
  const [farms, setFarms] = useState<FarmMarker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/market/interactive-map`);
        if (res.ok) {
          const data = await res.json();
          setFarms(data);
        } else {
          setFarms([
            { id: 'bogra-sector-04', name: 'Bogra Organic Poultry Sector 04', district: 'Bogra', latitude: 24.8481, longitude: 89.3730 },
            { id: 'mymensingh-sector-02', name: 'Mymensingh Rui-Katla Wetland Hub', district: 'Mymensingh', latitude: 24.7471, longitude: 90.4203 }
          ]);
        }
      } catch {
        setFarms([
          { id: 'bogra-sector-04', name: 'Bogra Organic Poultry Sector 04', district: 'Bogra', latitude: 24.8481, longitude: 89.3730 },
          { id: 'mymensingh-sector-02', name: 'Mymensingh Rui-Katla Wetland Hub', district: 'Mymensingh', latitude: 24.7471, longitude: 90.4203 }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchFarms();
  }, []);

  const convertToXY = (lat: number, lng: number) => {
    const x = ((lng - BANGLADESH_GEO.minLng) / (BANGLADESH_GEO.maxLng - BANGLADESH_GEO.minLng)) * 100;
    const y = 100 - (((lat - BANGLADESH_GEO.minLat) / (BANGLADESH_GEO.maxLat - BANGLADESH_GEO.minLat)) * 100);
    return { x: `${x}%`, y: `${y}%` };
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#F9F7F2] border border-[#2D3436]/10 rounded">
        <p className="font-sans text-sm tracking-widest text-[#2D3436]/60 animate-pulse uppercase">Initializing Vector Grid...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[650px] bg-[#F9F7F2] border border-[#2D3436]/10 overflow-hidden rounded p-6 shadow-sm select-none">
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
        <svg className="w-full h-full stroke-[#2D3436]" fill="none" viewBox="0 0 100 100" strokeWidth="0.1">
          <line x1="10" y1="0" x2="10" y2="100" /><line x1="30" y1="0" x2="30" y2="100" />
          <line x1="50" y1="0" x2="50" y2="100" /><line x1="70" y1="0" x2="70" y2="100" />
          <line x1="90" y1="0" x2="90" y2="100" /><line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" /><line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
        </svg>
      </div>

      <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
        <h4 className="font-heading text-lg font-semibold text-[#2D3436]">Sourced Regions</h4>
        <p className="font-sans text-[11px] text-[#2D3436]/50 tracking-wider uppercase">Fallback Topology Engine v1.0</p>
      </div>

      <div className="absolute inset-0 m-12">
        {farms.map((farm) => {
          const { x, y } = convertToXY(farm.latitude, farm.longitude);
          const isSelected = selectedFarmId === farm.id;

          return (
            <motion.div
              key={farm.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              style={{ left: x, top: y }}
              onClick={() => onSelectFarm(farm.id)}
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative flex items-center justify-center">
                <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-20 ${isSelected ? 'bg-[#4A5D4E] animate-ping' : 'bg-[#2D3436] group-hover:animate-ping'}`} />
                <div className={`p-2 rounded-full border transition-all duration-300 ${isSelected ? 'bg-[#4A5D4E] border-[#4A5D4E] text-[#F9F7F2]' : 'bg-[#F9F7F2] border-[#2D3436]/20 text-[#2D3436] group-hover:border-[#4A5D4E]'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="absolute left-full ml-3 bg-[#2D3436] text-[#F9F7F2] py-1.5 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded shadow-md z-30">
                  <p className="font-sans text-xs font-medium tracking-wide">{farm.name}</p>
                  <p className="font-sans text-[10px] text-[#F9F7F2]/60 tracking-wider uppercase">{farm.district} District</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
