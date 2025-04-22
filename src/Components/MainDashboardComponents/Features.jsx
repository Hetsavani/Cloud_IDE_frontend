import { motion } from "framer-motion"
import { FiShield, FiTerminal, FiCloud, FiCode, FiZap, FiGlobe } from "react-icons/fi"

const Features = () => {
  const features = [
    {
      icon: <FiShield />,
      title: "Enhanced Security",
      description: "State-of-the-art security measures to protect your code and data.",
    },
    {
      icon: <FiTerminal />,
      title: "Virtual Terminal",
      description: "Powerful command-line interface for advanced operations.",
    },
    {
      icon: <FiCloud />,
      title: "Remote Code Storage",
      description: "Securely store and access your code from anywhere in the world.",
    },
    {
      icon: <FiCode />,
      title: "Multi-Language Support",
      description: "Write and execute code in multiple programming languages.",
    },
    {
      icon: <FiZap />,
      title: "Built-in Online Compiler",
      description: "Compile and run your code directly in the browser.",
    },
    {
      icon: <FiGlobe />,
      title: "Lightweight Development",
      description: "No need for heavy editors or space-occupying files and configurations.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-4xl text-cyan-500 mb-4">
        {feature.icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
    </motion.div>
  )
}

export default Features

