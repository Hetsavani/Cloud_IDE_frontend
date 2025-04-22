import { motion } from "framer-motion"
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi"
import Logo from "./Logo"

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <Logo />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Empowering developers with a powerful cloud IDE solution.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#code-from-photo"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Code from Photo
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Connect with Us</h3>
            <div className="flex space-x-4">
              <SocialIcon href="https://github.com" icon={<FiGithub />} />
              <SocialIcon href="https://twitter.com" icon={<FiTwitter />} />
              <SocialIcon href="https://linkedin.com" icon={<FiLinkedin />} />
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2023 CodeVortex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ href, icon }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
  >
    {icon}
  </motion.a>
)

export default Footer

