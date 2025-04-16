'use client';

import { BarChart2, Clock, Layers, Server } from 'lucide-react';

interface NavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function NavTabs({ activeTab, setActiveTab }: NavTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4 mr-2" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="h-4 w-4 mr-2" /> },
    { id: 'logs', label: 'Error Logs', icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: 'details', label: 'Detailed Analysis', icon: <Server className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`py-3 px-4 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}