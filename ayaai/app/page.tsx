import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 to-green-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
          AyaAI
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-amber-300">Your Islamic AI Assistant</h2>
        <p className="max-w-2xl text-lg md:text-xl text-green-100">
          Experience the power of AI in your Islamic journey with Quranic guidance, Hadith lookup, prayer times, and personalized learning.
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-amber-300">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <Card className="bg-green-900/50 backdrop-blur-sm border-green-800">
            <div className="p-6">
              <div className="w-12 h-12 mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.35 1.05 4 3.41 4 6.14 0 4.21-4.71 7.26-8 7.75v-2.06z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-amber-300">Quran & Hadith Lookup</h4>
              <p className="text-green-100">Access authentic Quranic verses and Hadith with contextual explanations and references.</p>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-green-900/50 backdrop-blur-sm border-green-800">
            <div className="p-6">
              <div className="w-12 h-12 mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-amber-300">Prayer Times & Qibla</h4>
              <p className="text-green-100">Get accurate prayer times based on your location and find the direction of Qibla with ease.</p>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-green-900/50 backdrop-blur-sm border-green-800">
            <div className="p-6">
              <div className="w-12 h-12 mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-amber-300">Personalized Learning</h4>
              <p className="text-green-100">Tailor your learning experience with customizable settings and progress tracking.</p>
            </div>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-green-900/50 backdrop-blur-sm border-green-800">
            <div className="p-6">
              <div className="w-12 h-12 mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-amber-300">Bookmark & History</h4>
              <p className="text-green-100">Save important verses, Hadith, and conversations for easy access anytime.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Link href="/chat">
          <Button className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-green-950 font-bold py-6 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105">
            Start Chatting
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-950/50 backdrop-blur-sm border-t border-green-800 py-8">
        <div className="container mx-auto px-4 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} AyaAI. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-amber-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
