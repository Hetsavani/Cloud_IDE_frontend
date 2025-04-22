import { useState } from "react"
import { motion } from "framer-motion"
import { FiUpload } from "react-icons/fi"

const CodeFromPhoto = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [extractedCode, setExtractedCode] = useState("")

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleExtractCode = () => {
    // Simulating code extraction (replace with actual implementation)
    setTimeout(() => {
      setExtractedCode(`
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
      `)
    }, 1500)
  }

  return (
    <section id="code-from-photo" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Code from Photo</h2>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="ml-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            NEW
          </motion.div>
        </div>
        <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <label htmlFor="photo-upload" className="block mb-2 text-lg font-semibold">
              Upload a photo of handwritten code
            </label>
            <div className="flex items-center">
              <input type="file" id="photo-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
              <motion.label
                htmlFor="photo-upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white rounded-lg cursor-pointer"
              >
                <FiUpload className="mr-2" />
                Choose File
              </motion.label>
              <span className="ml-4">{selectedFile ? selectedFile.name : "No file chosen"}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExtractCode}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors mb-8"
          >
            Extract Code
          </motion.button>
          {extractedCode && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Extracted Code:</h3>
              <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                <code>{extractedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CodeFromPhoto

