'use client';

import { ErrorInsights } from '../../utils/types';
import StatsCards from '../StatsCards';
import ErrorTypesChart from '../charts/ErrorTypeChart';
import EnvironmentChart from '../charts/EnvironmentChart';
import BrowserStats from '../charts/BrowserStats';
import DeviceStats from '../charts/DeviceStats';

interface OverviewProps {
  insights: ErrorInsights;
}

export default function Overview({ insights }: OverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <StatsCards insights={insights} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorTypesChart errorTypes={insights.errorTypes} />
        <EnvironmentChart environments={insights.environments} />
      </div>

      {/* Browser & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrowserStats browsers={insights.browsers} totalErrors={insights.totalErrors} />
        <DeviceStats devices={insights.devices} totalErrors={insights.totalErrors} />
      </div>
    </div>
  );
}