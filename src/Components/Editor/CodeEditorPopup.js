import { useState, useEffect, lazy, Suspense } from "react"
import MonacoEditor from "@monaco-editor/react";

// Use React's lazy loading instead of Next.js dynamic import
// const MonacoEditor = lazy(() => import("react-monaco-editor"))

const CodeEditorPopup = ({ isOpen, onClose, initialCode, onSave }) => {
  const [code, setCode] = useState(initialCode)

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleSave = () => {
    onSave(code)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-3/4 h-3/4 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow">
          <Suspense fallback={<div>Loading editor...</div>}>
            <MonacoEditor
              language="text"
              theme="vs-dark"
              value={code}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
              onChange={handleEditorChange}
            />
          </Suspense>
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeEditorPopup

