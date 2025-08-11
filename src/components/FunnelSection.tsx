import React, { useMemo } from 'react';
import { Filter, Play, Settings, TrendingUp, BarChart3 } from 'lucide-react';
import FunnelChart from './FunnelChart';

interface LogRecord {
  [key: string]: string | number;
}

interface FunnelSectionProps {
  record: LogRecord;
}

const FunnelSection: React.FC<FunnelSectionProps> = ({ record }) => {
  const funnelData = useMemo(() => {
    if (!record) return [];
    
    const stages = [
      { name: 'Before Adaptive Video Filter', field: 'ladders_before_filter_adaptive_video', icon: Play },
      { name: 'After Adaptive Video Filter', field: 'ladders_after_filter_adaptive_video', icon: Filter },
      { name: 'After Strategy Based Filter', field: 'ladders_after_filter_ladder_based_on_strategy_info', icon: Settings },
      { name: 'After Create Time Filter', field: 'ladders_after_filter_ladder_based_on_create_time', icon: TrendingUp },
      { name: 'After Encode User Tags Filter', field: 'ladders_after_filter_ab_test_encode_user_tag', icon: BarChart3 },
      { name: 'After Video Play Qualities Filter', field: 'ladders_after_filter_video_play_qualities', icon: Filter },
      { name: 'After Irregular Bitrate Group Filter', field: 'ladders_after_filter_irregular_bitrate_ladder_group', icon: Filter },
      { name: 'Final Result', field: 'ladders_after_filter_irregular_bitrate_ladder', icon: Play }
    ];

    return stages.map((stage, index) => {
      const value = record[stage.field] as string;
      let items: string[] = [];
      
      if (value && value !== '[]' && value !== '') {
        if (Array.isArray(value)) {
          // Direct array (from JSON input)
          items = value.map(item => String(item));
        } else if (typeof value === 'string') {
          // String that might need parsing (from Excel input)
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              items = parsed.map(item => String(item));
            } else if (typeof parsed === 'object' && parsed !== null) {
              // Convert object to formatted JSON string as single item
              items = [JSON.stringify(parsed, null, 2)];
            } else {
              items = [String(parsed)];
            }
          } catch {
            items = [String(value)];
          }
        } else if (typeof value === 'object' && value !== null) {
          // Object (from JSON input) - convert to formatted JSON string
          try {
            items = [JSON.stringify(value, null, 2)];
          } catch {
            items = [String(value)];
          }
        } else {
          // Other types
          items = [String(value)];
        }
      }
      
      return {
        ...stage,
        count: items.length,
        items: items,
        percentage: index === 0 ? 100 : 0 // Will be calculated based on first stage
      };
    });
  }, [record]);

  // Calculate percentages based on first stage
  const funnelDataWithPercentages = useMemo(() => {
    if (funnelData.length === 0) return [];
    const maxCount = funnelData[0].count;
    return funnelData.map(stage => ({
      ...stage,
      percentage: maxCount > 0 ? (stage.count / maxCount) * 100 : 0
    }));
  }, [funnelData]);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Codec Ladder Filtering Pipeline</h2>
              <p className="text-xs text-gray-600">
                {funnelDataWithPercentages.length} filtering stages
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {funnelDataWithPercentages.length > 0 ? funnelDataWithPercentages[0]?.count : 0}
            </div>
            <div className="text-xs text-gray-600">Initial</div>
          </div>
        </div>
      </div>
      <FunnelChart data={funnelDataWithPercentages} />
    </div>
  );
};

export default FunnelSection;