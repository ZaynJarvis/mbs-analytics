import React, { useCallback } from 'react';
import { Upload, FileText, Loader2, FileSpreadsheet, Clipboard } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onJsonPaste: (jsonData: any) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onJsonPaste, isLoading }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const supportedFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );
    if (supportedFile) {
      onFileUpload(supportedFile);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleJsonPaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const jsonData = JSON.parse(text);
      onJsonPaste(jsonData);
    } catch (error) {
      alert('Invalid JSON in clipboard. Please copy valid JSON data.');
    }
  }, [onJsonPaste]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-2">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
        <p className="text-xs text-gray-600">Processing...</p>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300/50 hover:border-blue-500/50 transition-all duration-300 p-4 text-center group-hover:bg-blue-50/80">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-4 h-4 text-white" />
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Upload Data
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Drag & drop Excel file or paste JSON data
        </p>
        
        <div className="flex items-center justify-center space-x-2">
          <label className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
            <FileSpreadsheet className="w-3 h-3 mr-1" />
            Browse
          </label>
          
          <button
            onClick={handleJsonPaste}
            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium rounded hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <Clipboard className="w-3 h-3 mr-1" />
            Paste JSON
          </button>
        </div>
        
        <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <FileSpreadsheet className="w-3 h-3" />
            <span>Excel (.xlsx, .xls)</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>JSON Object</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;