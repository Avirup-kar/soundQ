"use client"

import { signIn, useSession } from "next-auth/react";

export function Hero() {
  const session = useSession();
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 h-screen bg-gradient-radial from-slate-900 via-slate-950 to-black opacity-60" />
      <div className="absolute inset-0 -z-10 h-screen bg-gradient-to-b from-purple-900/20 via-transparent to-transparent blur-3xl" />

      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="space-y-8 max-w-4xl">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-none bg-gradient-to-b from-gray-200 via-gray-300 to-gray-700 bg-clip-text text-transparent">
              Let Your Fans Choose the Beat
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Real-time fan voting. Your audience decides what plays next.
            </p>
          </div>

          {/* ✅ Replaced Buttons with Normal HTML Buttons + Tailwind */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button  onClick={() => signIn()} className="px-8 py-3 cursor-pointer text-lg font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition">
              Start Streaming
            </button>
            <button className="px-8 py-3 cursor-pointer text-lg font-semibold rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4 justify-center">
            <div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <p className="text-gray-400">Active Creators</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">2M+</div>
              <p className="text-gray-400">Votes Per Day</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
