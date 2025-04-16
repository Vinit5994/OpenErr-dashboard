'use client';

interface DeviceStatsProps {
  devices: { [key: string]: number };
  totalErrors: number;
}

export default function DeviceStats({ devices, totalErrors }: DeviceStatsProps) {
  const sortedDevices = Object.entries(devices)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Device Types</h2>
      <div className="space-y-3">
        {sortedDevices.map(([device, count]) => (
          <div key={device} className="flex items-center">
            <div className="w-32 font-medium text-gray-700 truncate pr-2">{device}</div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${(count / totalErrors) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="pl-2 text-gray-600 text-sm w-16 text-right">
              {((count / totalErrors) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}