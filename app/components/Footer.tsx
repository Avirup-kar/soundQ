"use client"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-gray-100 via-black to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">♪</span>
            </div>
            <span className="font-bold text-gray-500 text-xl">SoundVote</span>
          </div>
          <p className="text-5xl md:text-7xl font-bold bg-gradient-to-b from-gray-700 to-gray-400 bg-clip-text text-transparent">
            Let Fans Choose
          </p>
          <p className="text-gray-500 text-sm">© 2025 SoundVote</p>
        </div>
      </div>
    </footer>
  )
}