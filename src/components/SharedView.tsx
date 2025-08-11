import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BarChart3, Filter, Play, Settings, TrendingUp, User, ArrowLeft, AlertCircle } from 'lucide-react';
import FunnelChart from './FunnelChart';
import MetricCards from './MetricCards';
import RecordDetailsSection from './RecordDetailsSection';
import KeyIdentifiersSection from './KeyIdentifiersSection';
import FunnelSection from './FunnelSection';
import LZString from 'lz-string';

interface LogRecord {
  [key: string]: string | number;
}

function SharedView() {
  const [searchParams] = useSearchParams();
  const [record, setRecord] = useState<LogRecord | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (!dataParam) {
      setError('No data found in URL');
      return;
    }

    try {
      // Decompress the data
      const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
      if (!decompressed) {
        setError('Failed to decompress data');
        return;
      }

      const parsedData = JSON.parse(decompressed);
      setRecord(parsedData);
    } catch (err) {
      console.error('Error parsing shared data:', err);
      setError('Invalid data format');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Shared Data</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-spin">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm text-gray-600">Loading shared data...</p>
        </div>
      </div>
    );
  }

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
                  Shared Video Analytics
                </h1>
                <p className="text-xs text-gray-500">Codec ladder filtering pipeline visualization</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="space-y-4">
          {/* Key Identifiers */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-4">
            <KeyIdentifiersSection record={record} />
          </div>

          {/* Metrics Cards */}
          <MetricCards data={[record]} />

          {/* Codec Ladder Filtering Pipeline */}
          <FunnelSection record={record} />

          {/* Record Details Table - Settings excluded, Additional Information expanded by default */}
          <RecordDetailsSection record={record} isSharedView={true} />
        </div>
      </main>
    </div>
  );
}

export default SharedView;