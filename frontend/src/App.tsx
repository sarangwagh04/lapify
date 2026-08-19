import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KineticGrid from "@/components/ui/kinetic-grid";
import { ListLaptopModal } from "@/components/ListLaptopModal";
import { ArrowRight, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { AdminPortal } from "@/pages/AdminPortal";

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <KineticGrid globalColor="default">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <RefreshCw size={14} className="animate-spin-slow" />
            Premium Refurbished Laptops
          </span>
          
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Upgrade your tech. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Without the premium tag.
            </span>
          </h1>
          
          <p className="mt-6 max-w-xl text-lg text-white/60 leading-relaxed">
            Buy certified refurbished laptops with warranty, or list your old device to get the best value in minutes. Sustainable, reliable, and affordable.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              List Your Laptop
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30 focus:outline-none">
              Shop Now
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-purple-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-white font-medium">1-Year Warranty</h3>
              <p className="text-sm text-gray-400">On all certified devices</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-pink-400">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-white font-medium">Eco-Friendly</h3>
              <p className="text-sm text-gray-400">Reduce e-waste together</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 col-span-2 md:col-span-1">
              <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-blue-400">
                <Zap size={24} />
              </div>
              <h3 className="text-white font-medium">Instant Valuation</h3>
              <p className="text-sm text-gray-400">Get paid in 24 hours</p>
            </div>
          </div>
        </div>
      </KineticGrid>

      <ListLaptopModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}
