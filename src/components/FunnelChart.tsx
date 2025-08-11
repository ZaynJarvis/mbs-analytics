import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  items: string[];
  icon: LucideIcon;
}

interface FunnelChartProps {
  data: FunnelStage[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(stage => stage.count));
  
  // Calculate stage width with improved scaling to maintain adequate space for labels
  const calculateStageWidth = (count: number, maxCount: number, index: number, totalStages: number) => {
    if (maxCount === 0) return 60; // Minimum width
    
    // Use a combination of count-based and position-based scaling
    const countRatio = count / maxCount;
    
    // Progressive minimum width - deeper stages get higher minimum widths
    const progressiveMinWidth = 70 + (index / totalStages) * 15; // 70-85% range
    
    // Apply square root scaling instead of linear to reduce dramatic shrinking
    const scaledRatio = Math.sqrt(countRatio);
    const finalWidth = progressiveMinWidth + (scaledRatio * (100 - progressiveMinWidth));
    
    return Math.max(finalWidth, progressiveMinWidth);
  };

  // Calculate removed items for each stage
  const stagesWithRemovedItems = React.useMemo(() => {
    return data.map((stage, index) => {
      if (index === 0) {
        return { ...stage, removedItems: [] };
      }
      
      const previousStage = data[index - 1];
      
      // Handle duplicates properly by counting occurrences
      const previousItemCounts = previousStage.items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const currentItemCounts = stage.items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Find removed items
      const removedItems: string[] = [];
      
      Object.entries(previousItemCounts).forEach(([item, prevCount]) => {
        const currentCount = currentItemCounts[item] || 0;
        const removedCount = prevCount - currentCount;
        
        // Add removed instances
        for (let i = 0; i < removedCount; i++) {
          removedItems.push(item);
        }
      });
      
      return { ...stage, removedItems };
    });
  }, [data]);

  return (
    <div className="p-4 h-[600px] overflow-y-auto">
      <div className="space-y-3">
        {stagesWithRemovedItems.map((stage, index) => {
          const widthPercentage = calculateStageWidth(stage.count, maxCount, index, data.length);
          const isFirst = index === 0;
          const isLast = index === data.length - 1;
          
          return (
            <div key={stage.name} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-1/2 bottom-0 w-0.5 h-4 bg-gradient-to-b from-blue-300 to-purple-300 transform -translate-x-0.5 translate-y-full z-0"></div>
              )}
              
              {/* Stage Container */}
              <div className="relative z-10">
                <div
                  className="mx-auto transition-all duration-500 ease-out hover:scale-[1.01]"
                  style={{ width: `${widthPercentage}%` }}
                >
                  <div className={`
                    relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300
                    ${isFirst 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                      : isLast 
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }
                  `}>
                    {/* Content */}
                    <div className="relative px-4 py-3 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                            <stage.icon className="w-3 h-3" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm leading-tight">
                              {stage.name}
                            </h3>
                            <div className="text-xs opacity-80">
                              Stage {index + 1}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {stage.count}
                          </div>
                          <div className="text-xs opacity-80">
                            ladders
                          </div>
                        </div>
                      </div>
                      
                      {/* Removed Items Display */}
                      {stage.removedItems.length > 0 && (
                        <div className="mt-2 p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg border border-red-300/30 backdrop-blur-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-4 h-4 bg-red-400/80 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">−</span>
                            </div>
                            <div className="text-xs font-medium text-red-100">
                              Removed ({stage.removedItems.length}):
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                            {stage.removedItems.map((item, itemIndex) => (
                              <div 
                                key={itemIndex}
                                className="text-xs bg-gradient-to-r from-red-400/30 to-pink-400/30 px-2 py-1 rounded text-red-100 font-mono border border-red-300/40 hover:from-red-400/40 hover:to-pink-400/40 transition-all duration-200 whitespace-nowrap shadow-sm"
                                title={`Removed: ${item}`}
                              >
                                <span className="opacity-75">✕</span> {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Codec Ladders Display */}
                      {stage.items.length > 0 && (
                        <div className="mt-2 p-3 bg-white/10 rounded-lg">
                          <div className="text-xs font-medium mb-2 opacity-90">Codec Ladders:</div>
                          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                            {stage.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="text-xs bg-white/15 px-2 py-1 rounded text-white/95 border border-white/10 hover:bg-white/20 transition-colors"
                                title={item}
                              >
                                {(() => {
                                  // Check if item looks like formatted JSON (contains newlines and braces)
                                  if (item.includes('\n') && (item.includes('{') || item.includes('['))) {
                                    return (
                                      <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-xs">
                                        {item}
                                      </pre>
                                    );
                                  }
                                  return <span className="font-mono whitespace-nowrap">{item}</span>;
                                })()}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {stage.items.length === 0 && (
                        <div className="mt-2 p-3 bg-white/10 rounded-lg">
                          <div className="text-xs text-white/70 italic text-center">
                            No codec ladders
                          </div>
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden mt-2">
                        <div 
                          className="h-full bg-white/70 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                      
                      {/* Percentage Display */}
                      <div className="text-right mt-1">
                        <span className="text-xs opacity-80">
                          {stage.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      {stagesWithRemovedItems.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/30">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Pipeline Summary</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="bg-white/50 p-2 rounded">
              <span className="text-gray-600 block">Initial:</span>
              <span className="font-bold text-sm text-gray-900">{stagesWithRemovedItems[0]?.count || 0}</span>
            </div>
            <div className="bg-white/50 p-2 rounded">
              <span className="text-gray-600 block">Final:</span>
              <span className="font-bold text-sm text-gray-900">{stagesWithRemovedItems[stagesWithRemovedItems.length - 1]?.count || 0}</span>
            </div>
            <div className="bg-white/50 p-2 rounded">
              <span className="text-gray-600 block">Stages:</span>
              <span className="font-bold text-sm text-gray-900">{stagesWithRemovedItems.length}</span>
            </div>
            <div className="bg-white/50 p-2 rounded">
              <span className="text-gray-600 block">Retention:</span>
              <span className="font-bold text-sm text-gray-900">
                {stagesWithRemovedItems.length > 0 && stagesWithRemovedItems[0]?.count > 0 ? ((stagesWithRemovedItems[stagesWithRemovedItems.length - 1]?.count / stagesWithRemovedItems[0]?.count) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
          
          {/* Total Removed Summary */}
          <div className="mt-3 pt-2 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Total Removed:</span>
              <span className="font-bold text-red-600">
                {stagesWithRemovedItems.reduce((total, stage) => total + stage.removedItems.length, 0)} ladders
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelChart;