import { motion } from "framer-motion"
import { FiMenu, FiMoon, FiSun } from "react-icons/fi"
import Logo from "./Logo"

const Header = ({ isDarkMode, toggleTheme }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 dark:bg-gray-800 py-4 px-6 flex justify-between items-center"
    >
      <Logo />
      <nav className="hidden md:flex space-x-6">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#code-from-photo">Code from Photo</NavLink>
        <NavLink href="#testimonials">Testimonials</NavLink>
      </nav>
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="text-2xl"
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </motion.button>
        <button className="md:hidden text-2xl">
          <FiMenu />
        </button>
      </div>
    </motion.header>
  )
}

const NavLink = ({ href, children }) => (
  <motion.a
    href={href}
    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
)

export default Header

