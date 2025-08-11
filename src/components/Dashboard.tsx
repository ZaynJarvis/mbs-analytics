import React, { useState, useMemo } from 'react';
import { Upload, BarChart3, Database, Filter, Play, Settings, TrendingUp, ChevronLeft, ChevronRight, User, Share2, Copy, Check } from 'lucide-react';
import FileUpload from './FileUpload';
import FunnelChart from './FunnelChart';
import MetricCards from './MetricCards';
import RecordDetailsSection from './RecordDetailsSection';
import KeyIdentifiersSection from './KeyIdentifiersSection';
import FunnelSection from './FunnelSection';
import * as XLSX from 'xlsx';
import LZString from 'lz-string';

interface LogRecord {
  [key: string]: string | number;
}

function Dashboard() {
  const [data, setData] = useState<LogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [shareNotification, setShareNotification] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      let records: LogRecord[] = [];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Handle Excel files
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          records = (jsonData.slice(1) as any[][]).map(row => {
            const record: LogRecord = {};
            headers.forEach((header, index) => {
              record[header] = row[index] || '';
            });
            return record;
          });
        }
      } else {
        alert('Unsupported file format. Please upload an Excel file (.xlsx or .xls).');
        return;
      }
      
      setData(records);
      setCurrentRecordIndex(0);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please make sure it\'s a valid Excel file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonPaste = async (jsonData: any) => {
    setIsLoading(true);
    try {
      let records: LogRecord[] = [];
      
      if (Array.isArray(jsonData)) {
        // If it's an array, take all records
        records = jsonData;
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // If it's a single object, wrap it in an array
        records = [jsonData];
      } else {
        throw new Error('Invalid JSON format. Expected object or array.');
      }
      
      setData(records);
      setCurrentRecordIndex(0);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Error parsing JSON data. Please make sure it\'s valid JSON.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentRecord = data[currentRecordIndex];

  const nextRecord = () => {
    if (currentRecordIndex < data.length - 1) {
      setCurrentRecordIndex(currentRecordIndex + 1);
    }
  };

  const prevRecord = () => {
    if (currentRecordIndex > 0) {
      setCurrentRecordIndex(currentRecordIndex - 1);
    }
  };

  const generateShareUrl = async () => {
    if (!currentRecord) return;

    try {
      // Create shareable data excluding settings fields
      const shareableData = { ...currentRecord };
      
      // Remove settings fields
      Object.keys(shareableData).forEach(key => {
        if (key.endsWith('_settings')) {
          delete shareableData[key];
        }
      });

      // Compress the data
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(shareableData));
      
      // Generate share URL
      const baseUrl = 'https://fancy-yeot-117418.netlify.app';
      const url = `${baseUrl}/shared?data=${compressed}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      
      // Show notification
      setShareNotification(true);
      setTimeout(() => setShareNotification(false), 3000);
    } catch (error) {
      console.error('Error generating share URL:', error);
      alert('Failed to generate share URL. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Video Analytics Dashboard
                </h1>
                <p className="text-xs text-gray-500">Codec ladder filtering pipeline visualization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {data.length > 0 && currentRecord && (
                <button
                  onClick={generateShareUrl}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Database className="w-3 h-3" />
                <span>{data.length} records</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-4">
          {/* Top Section: Upload and Navigation */}
          <div className="grid grid-cols-12 gap-4">
            {/* Upload Component */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-900">Upload Data</h2>
                </div>
                <FileUpload onFileUpload={handleFileUpload} onJsonPaste={handleJsonPaste} isLoading={isLoading} />
              </div>
            </div>

            {/* Key Identifiers and Record Navigation */}
            {data.length > 0 && (
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-4">
                  {/* Record Navigation Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Record Analysis</h2>
                      <p className="text-xs text-gray-600">
                        Record {currentRecordIndex + 1} of {data.length}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevRecord}
                        disabled={currentRecordIndex === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200/50">
                        <span className="text-xs font-medium text-gray-700">
                          {currentRecordIndex + 1} / {data.length}
                        </span>
                      </div>
                      <button
                        onClick={nextRecord}
                        disabled={currentRecordIndex === data.length - 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Key Identifiers */}
                  <KeyIdentifiersSection record={currentRecord} />
                </div>
              </div>
            )}
            
            {/* Empty state for key identifiers when no data */}
            {data.length === 0 && (
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-4 flex items-center justify-center min-h-[120px]">
                  <div className="text-center">
                    <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload data to see record details</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {data.length > 0 && currentRecord && (
            <>
              {/* Metrics Cards */}
              <MetricCards data={[currentRecord]} />

              {/* Codec Ladder Filtering Pipeline - Full Width */}
              <FunnelSection record={currentRecord} />

              {/* Record Details Table */}
              <RecordDetailsSection record={currentRecord} />
            </>
          )}

          {/* Empty State */}
          {data.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to Video Analytics Dashboard
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Upload your Excel file to start analyzing codec ladder filtering pipelines.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Share Notification */}
      {shareNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg border border-green-200/50 shadow-lg p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Share link copied!</p>
              <p className="text-xs text-gray-600">Link has been copied to clipboard</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;