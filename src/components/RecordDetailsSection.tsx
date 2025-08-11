import React from 'react';
import { Database } from 'lucide-react';
import HorizontalTable from './HorizontalTable';

interface LogRecord {
  [key: string]: string | number;
}

interface RecordDetailsSectionProps {
  record: LogRecord;
  isSharedView?: boolean;
}

const RecordDetailsSection: React.FC<RecordDetailsSectionProps> = ({ record, isSharedView = false }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-gray-600" />
          <h2 className="text-sm font-semibold text-gray-900">Record Details</h2>
          {isSharedView && (
            <span className="text-xs text-gray-500">(Settings excluded from shared view)</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <HorizontalTable data={record} isSharedView={isSharedView} />
      </div>
    </div>
  );
};

export default RecordDetailsSection;