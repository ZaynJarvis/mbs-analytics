import React, { useState } from 'react';
import { Video, Settings, Copy, Check, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react';
import LadderInfoDisplay from './LadderInfoDisplay';

interface LogRecord {
  [key: string]: string | number;
}

interface HorizontalTableProps {
  data: LogRecord;
  isSharedView?: boolean;
}

const HorizontalTable: React.FC<HorizontalTableProps> = ({ data, isSharedView = false }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(isSharedView); // Default to expanded in shared view
  const [showFullSettings, setShowFullSettings] = useState(false);

  // Settings fields (fields ending with _settings)
  const settingsFields = Object.keys(data).filter(key => key.endsWith('_settings'));

  // Other fields (excluding key fields, settings, and ladder fields)
  const otherFields = Object.keys(data).filter(key => 
    !['vid', 'item_id', 'device_id', 'user_id'].includes(key) &&
    !key.endsWith('_settings') &&
    !key.startsWith('ladders_') &&
    !key.toLowerCase().includes('ladder_info') &&
    !['priority_region', 'device_platform', 'video_duration', 'overall_score', 'access_type'].includes(key) // Remove redundant fields
  );

  const copyToClipboard = async (text: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatSettingsValue = (value: string | number): string => {
    const str = String(value);
    try {
      // Try to parse as JSON for better formatting
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return str;
    }
  };

  const renderBooleanValue = (value: string | number) => {
    const str = String(value).toLowerCase();
    if (str === 'true' || str === '1') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          True
        </span>
      );
    } else if (str === 'false' || str === '0') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
          False
        </span>
      );
    }
    return <span className="text-sm text-gray-900">{String(value)}</span>;
  };

  const isBooleanField = (key: string, value: string | number): boolean => {
    const str = String(value).toLowerCase();
    return str === 'true' || str === 'false' || str === '1' || str === '0' || 
           key.includes('enable') || key.includes('disable') || key.includes('flag') ||
           key.includes('is_') || key.includes('has_');
  };

  // Check if we have ladder info
  const ladderInfoFields = Object.keys(data).filter(key => 
    key.toLowerCase().includes('ladder_info')
  );
  
  console.log('🔍 HorizontalTable - All data keys:', Object.keys(data));
  console.log('🔍 HorizontalTable - Ladder info fields found:', ladderInfoFields);
  console.log('🔍 HorizontalTable - Ladder info field values:', ladderInfoFields.map(field => ({
    field,
    value: data[field],
    type: typeof data[field]
  })));

  return (
    <div className="space-y-6">
      {/* Ladder Information - First in Record Details */}
      {ladderInfoFields.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200/50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Video className="w-4 h-4 mr-2 text-blue-600" />
              Ladder Information
            </h3>
          </div>
          <div className="p-4">
            {ladderInfoFields.map(field => (
              <div key={field} className="mb-4 last:mb-0">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <LadderInfoDisplay ladderData={data[field]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information - Collapsible */}
      {otherFields.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200/50 overflow-hidden">
          <div 
            className="px-4 py-3 bg-gradient-to-r from-gray-100 to-slate-100 border-b border-gray-200/50 cursor-pointer hover:bg-gray-200/50 transition-colors"
            onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <Video className="w-4 h-4 mr-2 text-gray-600" />
                Additional Information ({otherFields.length} fields)
              </h3>
              {showAdditionalInfo ? (
                <EyeOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
          {showAdditionalInfo && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {otherFields.map(field => (
                  <div key={field} className={`bg-white/60 rounded-lg p-3 border border-white/50 ${
                    field.toLowerCase().includes('ladder_info') ? 'col-span-full' : ''
                  }`}>
                    <div className="flex flex-col space-y-2">
                      <span className="text-xs font-medium text-gray-600">
                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <div className="text-sm">
                        {isBooleanField(field, data[field]) ? 
                          renderBooleanValue(data[field]) : 
                          <div className="text-gray-900">
                            {(() => {
                              const value = data[field];
                              if (value === null || value === undefined || value === '') {
                                return <span>N/A</span>;
                              }
                              
                              // Handle objects - stringify them but format JSON nicely
                              if (typeof value === 'object' && value !== null) {
                                try {
                                  // Format with proper indentation for readability
                                  return (
                                    <pre className="text-xs font-mono bg-gray-100 p-2 rounded border overflow-x-auto whitespace-pre-wrap break-words">
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  );
                                } catch {
                                  return <span className="break-all">{String(value)}</span>;
                                }
                              }
                              
                              // Handle strings that might contain JSON objects
                              if (typeof value === 'string') {
                                try {
                                  const parsed = JSON.parse(value);
                                  if (typeof parsed === 'object' && parsed !== null) {
                                    // Format parsed JSON objects nicely
                                    return (
                                      <pre className="text-xs font-mono bg-gray-100 p-2 rounded border overflow-x-auto whitespace-pre-wrap break-words">
                                        {JSON.stringify(parsed, null, 2)}
                                      </pre>
                                    );
                                  }
                                } catch {
                                  // Not JSON, return as-is
                                }
                              }
                              
                              return <span className="break-all">{String(value)}</span>;
                            })()}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Configuration Settings - Code Editor Style */}
      {!isSharedView && settingsFields.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200/50 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-orange-100 to-red-100 border-b border-orange-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-orange-600" />
                Configuration Settings
              </h3>
              <button
                onClick={() => setShowFullSettings(!showFullSettings)}
                className="flex items-center space-x-2 px-3 py-1 text-xs text-orange-700 hover:text-orange-900 hover:bg-orange-200/50 rounded transition-colors"
              >
                {showFullSettings ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>Show Default</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>Show Full</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {settingsFields.map(field => {
              const settingsValue = formatSettingsValue(data[field] || 'N/A');
              const hasNullFields = settingsValue.includes(': null') || settingsValue.includes(':null');
              
              // Filter out null fields in default mode
              let displayValue = settingsValue;
              if (!showFullSettings && hasNullFields) {
                try {
                  const parsed = JSON.parse(String(data[field]));
                  const filtered = Object.fromEntries(
                    Object.entries(parsed).filter(([_, value]) => value !== null && value !== undefined && value !== '')
                  );
                  displayValue = JSON.stringify(filtered, null, 2);
                } catch {
                  displayValue = settingsValue;
                }
              }
              
              return (
                <div key={field} className="bg-white/60 rounded-lg border border-white/50 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-100/50 border-b border-gray-200/50">
                    <span className="text-xs font-medium text-gray-700">
                      {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <button
                      onClick={() => copyToClipboard(displayValue, field)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200/50 rounded transition-colors"
                    >
                      {copiedField === field ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-green-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-gray-800 font-mono bg-gray-50 p-3 rounded border">
                      {(() => {
                        try {
                          const parsed = JSON.parse(displayValue);
                          return (
                            <div className="space-y-1">
                              {Object.entries(parsed).map(([key, value], index) => (
                                <div key={index} className="flex items-start">
                                  <span className="text-blue-600 font-semibold min-w-0 flex-shrink-0 mr-2">
                                    "{key}":
                                  </span>
                                  <span className="text-gray-800 break-all">
                                    {typeof value === 'string' ? `"${value}"` : 
                                     typeof value === 'object' && value !== null ? JSON.stringify(value) :
                                     String(value)}
                                    {index < Object.entries(parsed).length - 1 ? ',' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        } catch {
                          return <div className="whitespace-pre-wrap break-all">{displayValue}</div>;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalTable;