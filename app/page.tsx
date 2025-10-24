import React from 'react'
import Navbar from './components/Navbar'
import { Hero } from './components/hero'
import { Features } from './components/Features'
import { HowItWorks } from './components/how-it-works'
import { CTA } from './components/Cta'
import { Footer } from './components/Footer'
import { Redirect } from './components/Redirect'
import { Toaster } from 'react-hot-toast'


const page = () => {
  return (
    <main>
      <Toaster
       position="top-center"
       containerStyle={{ zIndex: 999999 }}
       reverseOrder={false}
      />
      <Redirect />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  )
}

export default page
