import { useState } from "react"
import Header from "../Components/MainDashboardComponents/Header"
import Hero from "../Components/MainDashboardComponents/Hero"
import Features from "../Components/MainDashboardComponents/Features"
import CodeFromPhoto from "../Components/MainDashboardComponents/CodeFromPhoto"
import Testimonials from "../Components/MainDashboardComponents/Testimonials"
import Footer from "../Components/MainDashboardComponents/Footer"
import "./Dashboard.css"

const CodeVortexDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="codevortex-wrapper">
      <div className={`cv-min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
          <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <main>
            <Hero />
            <Features />
            <CodeFromPhoto />
            <Testimonials />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default CodeVortexDashboard

