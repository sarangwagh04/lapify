import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
        <div className="p-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            React + Tailwind
          </h1>
          <p className="text-gray-400 mb-8">
            Your beautiful frontend is successfully configured and ready for development.
          </p>
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transform transition hover:-translate-y-1 active:translate-y-0"
          >
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
