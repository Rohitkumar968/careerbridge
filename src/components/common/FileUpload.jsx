import React, { useRef } from 'react'
import { Upload, X } from 'lucide-react'

export const FileUpload = ({ onFileSelect, accept = '.pdf,.docx', label = 'Upload File' }) => {
  const inputRef = useRef(null)
  const [file, setFile] = React.useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  const handleClear = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF or DOCX</p>
        </button>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
