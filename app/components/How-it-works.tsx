"use client"

const steps = [
  {
    number: "01",
    title: "Create Stream",
    description: "Set up your profile and create a stream with the existing playlist.",
    color: "text-indigo-500",
  },
  {
    number: "02",
    title: "Fans Vote",
    description: "Share your link. Your audience votes on the next track.",
    color: "text-pink-500",
  },
  {
    number: "03",
    title: "Earn & Grow",
    description: "Get paid for engagement and watch your community grow.",
    color: "text-green-500",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100">How It Works</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get started in three simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg hover:border-indigo-500/40 transition-all duration-300 flex flex-col gap-4 text-left"
            >
              <div className={`${step.color} text-5xl font-extrabold opacity-30`}>
                {step.number}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-100">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
