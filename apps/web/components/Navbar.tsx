"use client";

import Link from "next/link";
import { Menu, Sprout, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#2D3436]/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-[#4A5D4E]" />
          <span className="font-heading text-xl font-semibold tracking-wide text-[#2D3436]">
            FarmLive
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2D3436]/80">
          <Link href="/farms" className="hover:text-[#4A5D4E] transition-colors">Live Farms</Link>
          <Link href="/products" className="hover:text-[#4A5D4E] transition-colors">Fresh Harvest</Link>
          <Link href="/drops" className="hover:text-[#4A5D4E] transition-colors">Community Drops</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-[#4A5D4E]/10">
            <User className="h-5 w-5 text-[#2D3436]" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#4A5D4E]/10 relative">
            <ShoppingCart className="h-5 w-5 text-[#2D3436]" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#4A5D4E]" />
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-[#2D3436]"><Menu className="h-6 w-6" /></Button></SheetTrigger>
            <SheetContent side="right" className="bg-[#F9F7F2] border-[#2D3436]/10">
              <div className="flex flex-col gap-6 mt-8 font-heading text-lg">
                <Link href="/farms" className="hover:text-[#4A5D4E]">Live Farms</Link>
                <Link href="/products" className="hover:text-[#4A5D4E]">Fresh Harvest</Link>
                <Link href="/drops" className="hover:text-[#4A5D4E]">Community Drops</Link>
                <hr className="border-[#2D3436]/10" />
                <Link href="/login" className="flex items-center gap-2 hover:text-[#4A5D4E]">
                  <User className="h-5 w-5" /> Account
                </Link>
                <Link href="/cart" className="flex items-center gap-2 hover:text-[#4A5D4E]">
                  <ShoppingCart className="h-5 w-5" /> Cart
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
