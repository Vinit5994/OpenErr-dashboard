'use client';

import { AlertCircle, Clock, Server, Layers } from 'lucide-react';
import { ErrorInsights } from '../utils/types';

interface StatsCardsProps {
  insights: ErrorInsights;
}

export default function StatsCards({ insights }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Errors',
      value: insights.totalErrors.toString(),
      icon: <AlertCircle className="h-6 w-6" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Avg Response Time',
      value: `${insights.performanceMetrics.avgResponseTime?.toFixed(2)}ms`,
      icon: <Clock className="h-6 w-6" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Environments',
      value: Object.keys(insights.environments).length.toString(),
      icon: <Server className="h-6 w-6" />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Error Types',
      value: Object.keys(insights.errorTypes).length.toString(),
      icon: <Layers className="h-6 w-6" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.bgColor} ${stat.textColor}`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}