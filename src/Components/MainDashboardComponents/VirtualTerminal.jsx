import { useState } from "react"
import { motion } from "framer-motion"
import { FiTerminal } from "react-icons/fi"

const VirtualTerminal = () => {
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState("Welcome to CodeVortex Virtual Terminal")

  const handleCommandChange = (e) => {
    setCommand(e.target.value)
  }

  const handleCommandSubmit = (e) => {
    e.preventDefault()
    // Simulating command execution (replace with actual implementation)
    setOutput(
      (prevOutput) => `${prevOutput}
$ ${command}
Executing command: ${command}...
Command executed successfully.`,
    )
    setCommand("")
  }

  return (
    <section id="virtual-terminal" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Virtual Terminal</h2>
        <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-4 flex items-center">
            <FiTerminal className="text-2xl mr-2" />
            <h3 className="text-xl font-semibold">CodeVortex Terminal</h3>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto mb-4">{output}</pre>
          <form onSubmit={handleCommandSubmit} className="flex">
            <input
              type="text"
              value={command}
              onChange={handleCommandChange}
              placeholder="Enter command..."
              className="flex-grow p-2 border rounded-l-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-cyan-500 text-white px-6 py-2 rounded-r-md font-semibold hover:bg-cyan-600 transition-colors"
            >
              Execute
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default VirtualTerminal

