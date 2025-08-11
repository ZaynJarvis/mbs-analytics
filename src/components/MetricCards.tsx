import React from 'react';
import { BarChart3, Clock, Globe, Smartphone, Wifi, TrendingUp, Code } from 'lucide-react';

interface LogRecord {
  [key: string]: string | number;
}

interface MetricCardsProps {
  data: LogRecord[];
}

const MetricCards: React.FC<MetricCardsProps> = ({ data }) => {
  const metrics = React.useMemo(() => {
    if (data.length === 0) return [];

    const record = data[0]; // Single record analysis
    
    const duration = parseFloat(String(record.video_duration) || '0');
    const score = parseFloat(String(record.overall_score) || '0');
    const region = String(record.priority_region || 'Unknown');
    const deviceType = String(record.device_type || record.device_platform || 'Unknown');
    const accessType = String(record.access_type || 'Unknown');
    const clientVersion = String(record.client_version || 'Unknown');

    return [
      {
        title: 'Region',
        value: region,
        icon: Globe,
        color: 'from-green-600 to-green-500',
        bgColor: 'from-green-50 to-green-100'
      },
      {
        title: 'DeviceType',
        value: deviceType,
        icon: Smartphone,
        color: 'from-purple-600 to-purple-500',
        bgColor: 'from-purple-50 to-purple-100'
      },
      {
        title: 'Client Version', 
        value: clientVersion,
        icon: Code,
        color: 'from-blue-600 to-blue-500',
        bgColor: 'from-blue-50 to-blue-100'
      },
      {
        title: 'Duration',
        value: `${duration.toFixed(1)}s`,
        icon: Clock,
        color: 'from-orange-600 to-orange-500',
        bgColor: 'from-orange-50 to-orange-100'
      },
      {
        title: 'Access',
        value: accessType,
        icon: Wifi,
        color: 'from-teal-600 to-teal-500',
        bgColor: 'from-teal-50 to-teal-100'
      },
      {
        title: 'Score',
        value: score.toFixed(1),
        icon: TrendingUp,
        color: 'from-rose-600 to-rose-500',
        bgColor: 'from-rose-50 to-rose-100'
      }
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {metrics.map((metric, index) => (
        <div
          key={metric.title}
          className={`relative overflow-hidden rounded-lg border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-br ${metric.bgColor}`}
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-md`}>
                <metric.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900" title={String(metric.value)}>
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {metric.title}
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;