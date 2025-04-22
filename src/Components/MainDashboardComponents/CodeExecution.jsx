import { useState } from "react"
import { motion } from "framer-motion"
import { FiPlay } from "react-icons/fi"

const CodeExecution = () => {
  const [code, setCode] = useState("// Write your code here")
  const [language, setLanguage] = useState("javascript")
  const [output, setOutput] = useState("")

  const handleCodeChange = (e) => {
    setCode(e.target.value)
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  const handleExecuteCode = () => {
    // Simulating code execution (replace with actual implementation)
    setOutput(`Executing ${language} code...

Output:
Hello, CodeVortex!`)
  }

  return (
    <section id="code-execution" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Code Execution</h2>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <label htmlFor="language-select" className="block mb-2 text-lg font-semibold">
              Select Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="code-input" className="block mb-2 text-lg font-semibold">
              Code Editor
            </label>
            <textarea
              id="code-input"
              value={code}
              onChange={handleCodeChange}
              rows="10"
              className="w-full p-4 border rounded-md font-mono bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExecuteCode}
            className="w-full bg-cyan-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-cyan-600 transition-colors mb-8 flex items-center justify-center"
          >
            <FiPlay className="mr-2" />
            Execute Code
          </motion.button>
          {output && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Output:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <code>{output}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CodeExecution

