"use client"


export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 border border-primary/30 rounded-2xl p-12 md:p-16 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Ready to Start?</h2>

          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Join creators streaming with fan voting today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              className="px-8 py-3 text-lg cursor-pointer font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button
              className="px-8 py-3 text-lg cursor-pointer font-semibold border border-gray-600 text-gray-200 rounded-xl hover:bg-gray-800/40 transition-transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}