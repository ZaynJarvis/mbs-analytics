import React from 'react';
import { CheckCircle, XCircle, Zap, AlertTriangle } from 'lucide-react';

interface LadderItem {
  name: string;
  bitrate: number;
  universal_vmaf?: number;
  status: string | number;
  reason?: string;
  definition?: number;
  [key: string]: any;
}

interface LadderInfoDisplayProps {
  ladderData: any;
}

const LadderInfoDisplay: React.FC<LadderInfoDisplayProps> = ({ ladderData }) => {
  // Parse ladder data - handle both JSON and Excel input
  const parseLadderData = (data: any): LadderItem[] => {
    console.log('🔍 LadderInfoDisplay - Raw input data:', data);
    console.log('🔍 LadderInfoDisplay - Data type:', typeof data);
    
    if (!data) return [];
    
    let parsedData: any = data;
    
    // First normalize the input - handle both JSON and Excel string inputs
    if (typeof data === 'string') {
      console.log('🔍 LadderInfoDisplay - Processing string data:', data);
      try {
        parsedData = JSON.parse(data);
        console.log('🔍 LadderInfoDisplay - Parsed JSON from string:', parsedData);
      } catch {
        // If parsing fails, return empty array
        console.log('❌ LadderInfoDisplay - Failed to parse JSON from string');
        return [];
      }
    }
    
    // Now handle the structured map format
    let items: LadderItem[] = [];
    console.log('🔍 LadderInfoDisplay - Processing parsed data:', parsedData);
    
    if (Array.isArray(parsedData)) {
      console.log('🔍 LadderInfoDisplay - Data is array, length:', parsedData.length);
      // Handle array of objects (each object is a map with ladder name as key)
      parsedData.forEach(item => {
        console.log('🔍 LadderInfoDisplay - Processing array item:', item);
        if (typeof item === 'object' && item !== null) {
          // Each item is a map like {"ladder_name": {bitrate: ..., status: ...}}
          Object.entries(item).forEach(([ladderName, ladderInfo]: [string, any]) => {
            console.log('🔍 LadderInfoDisplay - Processing ladder:', ladderName, ladderInfo);
            if (typeof ladderInfo === 'object' && ladderInfo !== null) {
              items.push({
                name: ladderName,
                ...ladderInfo
              });
            }
          });
        }
      });
    } else if (typeof parsedData === 'object' && parsedData !== null) {
      console.log('🔍 LadderInfoDisplay - Data is object, keys:', Object.keys(parsedData));
      // Handle single object (map with ladder names as keys)
      Object.entries(parsedData).forEach(([ladderName, ladderInfo]: [string, any]) => {
        console.log('🔍 LadderInfoDisplay - Processing object ladder:', ladderName, ladderInfo);
        // Handle double-encoded JSON strings from Excel
        let processedLadderInfo = ladderInfo;
        if (typeof ladderInfo === 'string') {
          try {
            processedLadderInfo = JSON.parse(ladderInfo);
            console.log('🔍 LadderInfoDisplay - Parsed inner JSON:', processedLadderInfo);
          } catch (e) {
            console.log('🔍 LadderInfoDisplay - Failed to parse inner JSON:', e);
            // If parsing fails, treat as string value
            processedLadderInfo = { value: ladderInfo };
          }
        }
        
        if (typeof processedLadderInfo === 'object' && processedLadderInfo !== null) {
          items.push({
            name: ladderName,
            ...processedLadderInfo
          });
        } else {
          console.log('🔍 LadderInfoDisplay - Skipping non-object ladder info:', typeof processedLadderInfo, processedLadderInfo);
        }
      });
    }
    
    console.log('🔍 LadderInfoDisplay - Final parsed items:', items);
    return items;
  };

  const ladderItems = parseLadderData(ladderData);
  console.log('🔍 LadderInfoDisplay - Ladder items result:', ladderItems);
  
  // Split by status
  const selectedGears = ladderItems.filter(item => String(item.status) === '1');
  const notSelectedGears = ladderItems.filter(item => String(item.status) === '0');
  
  // Sort not selected gears: by reason asc, then by bitrate desc
  const sortedNotSelected = notSelectedGears.sort((a, b) => {
    const reasonA = String(a.reason || '').toLowerCase();
    const reasonB = String(b.reason || '').toLowerCase();
    
    if (reasonA !== reasonB) {
      return reasonA.localeCompare(reasonB);
    }
    
    const bitrateA = Number(a.bitrate) || 0;
    const bitrateB = Number(b.bitrate) || 0;
    return bitrateB - bitrateA; // desc
  });

  // Sort selected gears by bitrate desc for consistency
  const sortedSelected = selectedGears.sort((a, b) => {
    const bitrateA = Number(a.bitrate) || 0;
    const bitrateB = Number(b.bitrate) || 0;
    return bitrateB - bitrateA; // desc
  });

  const renderLadderItem = (item: LadderItem, index: number, isSelected: boolean) => {
    const bitrate = item.bitrate ? `${item.bitrate}bps` : 'N/A';
    const reason = item.reason || 'N/A';
    const vmaf = item.universal_vmaf ? item.universal_vmaf.toFixed(2) : 'N/A';
    const definition = item.definition || 'N/A';
    
    return (
      <div
        key={index}
        className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
          isSelected 
            ? 'bg-green-50 border-green-200 hover:bg-green-100' 
            : 'bg-red-50 border-red-200 hover:bg-red-100'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isSelected ? (
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <div className="text-xs font-medium text-gray-700 truncate">
              {item.name}
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Zap className="w-3 h-3" />
            <span className="font-mono">{bitrate}</span>
          </div>
        </div>
        
        {!isSelected && (
          <div className="mb-2 flex items-center space-x-2">
            <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <span className="font-medium">Reason:</span> {reason}
            </div>
          </div>
        )}
        
        <div className="text-xs font-mono bg-white/60 p-2 rounded border overflow-x-auto">
          <div className="space-y-1">
            <div><span className="text-blue-600 font-semibold">Bitrate:</span> {bitrate}</div>
            <div><span className="text-blue-600 font-semibold">VMAF:</span> {vmaf}</div>
            <div><span className="text-blue-600 font-semibold">Definition:</span> {definition}p</div>
          </div>
        </div>
      </div>
    );
  };

  if (ladderItems.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No ladder info available
      </div>
    );
  }

  return (
    <div className="space-y-4 col-span-2">
      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Selected: {sortedSelected.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-gray-700">Not Selected: {sortedNotSelected.length}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Total: {ladderItems.length} gears
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selected Gears (Status 1) */}
        <div className="space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center space-x-2 pb-2 border-b border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-sm text-gray-900">
              Selected Gears ({sortedSelected.length})
            </h4>
          </div>
          <div className="space-y-2">
            {sortedSelected.length > 0 ? (
              sortedSelected.map((item, index) => renderLadderItem(item, index, true))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No selected gears
              </div>
            )}
          </div>
        </div>

        {/* Not Selected Gears (Status 0) */}
        <div className="space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center space-x-2 pb-2 border-b border-red-200">
            <XCircle className="w-4 h-4 text-red-600" />
            <h4 className="font-semibold text-sm text-gray-900">
              Not Selected Gears ({sortedNotSelected.length})
            </h4>
            <div className="text-xs text-gray-500">
              (sorted by reason ↑, bitrate ↓)
            </div>
          </div>
          <div className="space-y-2">
            {sortedNotSelected.length > 0 ? (
              sortedNotSelected.map((item, index) => renderLadderItem(item, index, false))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No rejected gears
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LadderInfoDisplay;