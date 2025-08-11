import React from 'react';
import { User } from 'lucide-react';

interface LogRecord {
  [key: string]: string | number;
}

interface KeyIdentifiersSectionProps {
  record: LogRecord;
}

const KeyIdentifiersSection: React.FC<KeyIdentifiersSectionProps> = ({ record }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50 overflow-hidden">
      <div className="px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200/50">
        <h3 className="text-xs font-semibold text-gray-900 flex items-center">
          <User className="w-3 h-3 mr-1 text-blue-600" />
          Key Identifiers
        </h3>
      </div>
      <div className="p-3">
        <table className="w-full text-xs">
          <tbody>
            <tr className="border-b border-gray-200/50">
              <td className="py-1 pr-2 font-medium text-gray-600 w-16">Video ID</td>
              <td className="py-1 text-gray-900 font-mono bg-gray-50 px-2 rounded break-all text-xs">
                {String(record?.vid || 'N/A')}
              </td>
            </tr>
            <tr className="border-b border-gray-200/50">
              <td className="py-1 pr-2 font-medium text-gray-600">Item ID</td>
              <td className="py-1 text-gray-900 font-mono bg-gray-50 px-2 rounded break-all">
                {String(record?.item_id || 'N/A')}
              </td>
            </tr>
            <tr className="border-b border-gray-200/50">
              <td className="py-1 pr-2 font-medium text-gray-600">Device ID</td>
              <td className="py-1 text-gray-900 font-mono bg-gray-50 px-2 rounded break-all">
                {String(record?.device_id || 'N/A')}
              </td>
            </tr>
            <tr>
              <td className="py-1 pr-2 font-medium text-gray-600">User ID</td>
              <td className="py-1 text-gray-900 font-mono bg-gray-50 px-2 rounded break-all">
                {String(record?.user_id || 'N/A')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeyIdentifiersSection;