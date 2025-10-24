"use client"

import { Music, Users, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Real-Time Voting",
    description: "Fans vote on the next track, creating an interactive experience.",
  },
  {
    icon: Music,
    title: "Custom Playlists",
    description: "Create curated selections and let your audience vote from them.",
  },
  {
    icon: TrendingUp,
    title: "Engagement Analytics",
    description: "Track voting patterns and understand what your fans love most.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Powerful Features</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything creators need for engaging interactive streams.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 
                           hover:border-indigo-500/50 transition-all duration-300 
                           shadow-lg hover:shadow-indigo-900/30">
                <div className="bg-indigo-900 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
