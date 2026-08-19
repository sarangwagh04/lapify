import { useState, useEffect } from "react";
import { Lock, LogOut, Image as ImageIcon, X } from "lucide-react";

export function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@lapify.com" && password === "Pass@123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Lock size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-lg transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/listings")
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Lapify Admin</h1>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Submissions</h2>
          <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700">
            Total: {listings.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto border border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-800/80 text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-gray-700">ID</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-700">Device</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-700">Condition</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-700">Price</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-700">Contact</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-700 text-right">Attachments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {listings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">#{listing.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-200 capitalize">{listing.brand}</div>
                      <div className="text-xs text-gray-500 mt-0.5 capitalize">{listing.model_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        listing.condition === 'Excellent' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        listing.condition === 'Good' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        listing.condition === 'Fair' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {listing.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-300">${listing.price}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{listing.user_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{listing.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedImages(listing.image_paths)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-purple-400 rounded-lg text-xs font-medium transition-colors border border-gray-700 hover:border-gray-600"
                      >
                        <ImageIcon size={14} />
                        View ({listing.image_paths.length})
                      </button>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No submissions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Image Modal */}
      {selectedImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
              <h3 className="font-medium text-white flex items-center gap-2">
                <ImageIcon size={16} className="text-purple-400" /> Attached Images
              </h3>
              <button onClick={() => setSelectedImages(null)} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedImages.map((path, idx) => {
                  const url = `http://localhost:8000/${path.replace(/\\/g, '/')}`;
                  return (
                    <div key={idx} className="rounded-xl overflow-hidden border border-gray-800 bg-black aspect-video flex items-center justify-center">
                      <img src={url} alt={`Attachment ${idx}`} className="max-w-full max-h-full object-contain" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
