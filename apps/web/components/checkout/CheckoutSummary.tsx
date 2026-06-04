'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OrderLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutSummaryProps {
  items: OrderLineItem[];
  logisticsFee: number;
  onConfirmPayment: (method: 'bKash' | 'Nagad') => void;
  isProcessing: boolean;
}

export default function CheckoutSummary({ items, logisticsFee, onConfirmPayment, isProcessing }: CheckoutSummaryProps) {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | null>(null);

  const totalItemCost = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Platform logic mirrored strictly for frontend display transparency
  const platformFee = totalItemCost * 0.10;
  const vendorPayout = totalItemCost - platformFee;
  const finalTotal = totalItemCost + logisticsFee;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#F9F7F2] border border-[#2D3436]/20 rounded-xl p-6 shadow-sm">
      <h2 className="font-heading text-2xl font-bold text-[#2D3436] mb-6">Payment Summary</h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm font-medium text-[#2D3436]">
          <span>Total Item Cost</span>
          <span>৳ {totalItemCost.toFixed(2)}</span>
        </div>

        {/* Extreme regional transparency breakdown */}
        <div className="pl-4 border-l-2 border-[#2D3436]/10 space-y-2">
          <div className="flex justify-between items-center text-xs text-[#2D3436]/70">
            <span>Farmer Earnings (Direct)</span>
            <span>৳ {vendorPayout.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-[#2D3436]/70">
            <span>Platform Support (10%)</span>
            <span>৳ {platformFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium text-[#2D3436]">
          <span>Dynamic Logistics Fee</span>
          <span>৳ {logisticsFee.toFixed(2)}</span>
        </div>

        <hr className="border-[#2D3436]/20" />

        <div className="flex justify-between items-center text-lg font-bold text-[#2D3436]">
          <span>Total Payable</span>
          <span>৳ {finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-[#2D3436]">Select Mobile Banking</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className={`h-[44px] rounded border-[#2D3436]/20 font-bold tracking-wide transition-colors ${selectedMethod === 'bKash' ? 'bg-[#E2136E] text-white border-[#E2136E] hover:bg-[#E2136E]/90 hover:text-white' : 'text-[#E2136E] hover:bg-[#E2136E]/10'}`}
            onClick={() => setSelectedMethod('bKash')}
          >
            bKash
          </Button>
          <Button
            variant="outline"
            className={`h-[44px] rounded border-[#2D3436]/20 font-bold tracking-wide transition-colors ${selectedMethod === 'Nagad' ? 'bg-[#F46824] text-white border-[#F46824] hover:bg-[#F46824]/90 hover:text-white' : 'text-[#F46824] hover:bg-[#F46824]/10'}`}
            onClick={() => setSelectedMethod('Nagad')}
          >
            Nagad
          </Button>
        </div>

        <Button
          className="w-full h-[44px] bg-[#4A5D4E] hover:bg-[#4A5D4E]/90 text-white font-medium rounded shadow mt-6"
          disabled={!selectedMethod || isProcessing}
          onClick={() => selectedMethod && onConfirmPayment(selectedMethod)}
        >
          {isProcessing ? 'Processing Transaction...' : `Pay ৳ ${finalTotal.toFixed(2)} securely`}
        </Button>
      </div>
    </div>
  );
}
