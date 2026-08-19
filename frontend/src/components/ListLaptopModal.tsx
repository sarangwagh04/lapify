import { useState } from "react";
import { X, Upload, Laptop, DollarSign, User, Mail, Phone } from "lucide-react";

export function ListLaptopModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      alert("Laptop listed successfully!");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">List Your Laptop</h2>
            <p className="text-sm text-gray-400 mt-1">Get an instant estimate for your used device.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Brand</label>
              <div className="relative">
                <Laptop className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <select required className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none">
                  <option value="">Select Brand</option>
                  <option value="apple">Apple</option>
                  <option value="dell">Dell</option>
                  <option value="hp">HP</option>
                  <option value="lenovo">Lenovo</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Model / Specs</label>
              <input required type="text" placeholder="e.g. MacBook Pro M1 16GB" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Condition</label>
            <div className="flex gap-3">
              {['Excellent', 'Good', 'Fair', 'Poor'].map((condition) => (
                <label key={condition} className="flex-1 cursor-pointer">
                  <input type="radio" name="condition" value={condition} className="peer sr-only" required />
                  <div className="text-center py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 peer-checked:bg-purple-500/20 peer-checked:border-purple-500 peer-checked:text-purple-300 hover:bg-gray-700 transition-colors">
                    {condition}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Expected Price ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input required type="number" min="0" placeholder="500" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium text-gray-300 mb-3">Contact Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input required type="text" placeholder="Your Name" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input required type="tel" placeholder="Phone Number" className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-800 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : (
                <>
                  <Upload size={16} />
                  Submit Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
