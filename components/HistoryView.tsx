import React, { useState, useMemo } from 'react';
import { getAllRecords } from '../services/storageService';
import { DailyRecord, HistoryPeriod, MetricType } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HistoryViewProps {
  onNavigateToInput: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onNavigateToInput }) => {
  const [period, setPeriod] = useState<HistoryPeriod>('7D');
  const [metric, setMetric] = useState<MetricType>('weight');

  const allRecords = useMemo(() => getAllRecords(), []);

  const filteredData = useMemo(() => {
    if (allRecords.length === 0) return [];
    
    const now = new Date();
    // Reset time part to ensure full day coverage
    now.setHours(23, 59, 59, 999);
    
    let daysToSubtract = 7;
    if (period === '14D') daysToSubtract = 14;
    if (period === '1M') daysToSubtract = 30;
    if (period === '6M') daysToSubtract = 180;
    if (period === '1Y') daysToSubtract = 365;

    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - daysToSubtract);

    return allRecords.filter(r => {
      const rDate = new Date(r.date);
      // Parse record date properly (assuming YYYY-MM-DD)
      const [y, m, d] = r.date.split('-').map(Number);
      const recordDate = new Date(y, m - 1, d);
      return recordDate >= cutoffDate && recordDate <= now;
    }).map(r => ({
      ...r,
      value: metric === 'weight' ? parseFloat(r.weight) : parseFloat(r.bodyFat),
      // Short date for chart: MM/DD
      shortDate: r.date.slice(5).replace('-', '/')
    })).filter(r => !isNaN(r.value));
  }, [allRecords, period, metric]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    const values = filteredData.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { avg: avg.toFixed(1), min: min.toFixed(1), max: max.toFixed(1) };
  }, [filteredData]);

  const formatDateLabel = (dateStr: string) => {
    // Convert YYYY-MM-DD to MM/DD (Day)
    const date = new Date(dateStr);
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const w = dayNames[date.getDay()];
    return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')} (${w})`;
  };

  const Periods: HistoryPeriod[] = ['7D', '14D', '1M', '6M', '1Y'];
  const PeriodLabels: Record<HistoryPeriod, string> = {
    '7D': '7天', '14D': '14天', '1M': '1個月', '6M': '6個月', '1Y': '12個月'
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pt-4 pb-24 px-4">
      {/* Header */}
      <h2 className="text-white text-xl font-medium mb-6 drop-shadow-md">歷程回顧</h2>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto w-full pb-2 no-scrollbar justify-between sm:justify-center">
        {Periods.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              period === p 
                ? 'bg-primary border-primary text-white shadow-md' 
                : 'bg-white border-primary text-primary'
            }`}
          >
            {PeriodLabels[p]}
          </button>
        ))}
      </div>

      {/* Chart Card */}
      <div className="bg-white w-full rounded-3xl p-5 shadow-xl shadow-rose-900/10 mb-6 min-h-[320px]">
        {/* Metric Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setMetric('weight')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              metric === 'weight' ? 'bg-white text-primary shadow-sm' : 'text-text-sub'
            }`}
          >
            體重
          </button>
          <button
            onClick={() => setMetric('bodyFat')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              metric === 'bodyFat' ? 'bg-white text-primary shadow-sm' : 'text-text-sub'
            }`}
          >
            體脂
          </button>
        </div>

        {filteredData.length > 0 ? (
          <>
            {/* Stats */}
            <div className="flex justify-between text-xs text-text-sub mb-4 px-1">
               <span>區間平均：<strong className="text-text-main text-sm">{stats?.avg}</strong> {metric === 'weight' ? 'kg' : '%'}</span>
               <div className="flex gap-3">
                 <span>最低：{stats?.min}</span>
                 <span>最高：{stats?.max}</span>
               </div>
            </div>

            {/* Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="shortDate" 
                    tick={{fill: '#999', fontSize: 10}} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    hide={true} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#F43F5E', fontWeight: 'bold' }}
                    cursor={{ stroke: '#FECDD3', strokeWidth: 2 }}
                    formatter={(value: number) => [`${value} ${metric === 'weight' ? 'kg' : '%'}`, metric === 'weight' ? '體重' : '體脂']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F43F5E" 
                    strokeWidth={3} 
                    dot={{ fill: '#F43F5E', stroke: '#fff', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-text-sub">
            <p className="mb-4">此區間尚無紀錄</p>
            <button 
              onClick={onNavigateToInput}
              className="text-primary text-sm font-bold border border-primary px-4 py-2 rounded-full hover:bg-rose-50"
            >
              前往輸入
            </button>
          </div>
        )}
      </div>

      {/* List View */}
      {filteredData.length > 0 && (
        <div className="w-full bg-white rounded-3xl p-4 shadow-lg shadow-rose-900/5">
           {filteredData.slice().reverse().map((record) => (
             <div key={record.date} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
               <span className="text-text-sub font-medium text-sm">{formatDateLabel(record.date)}</span>
               <div className="flex gap-4 text-sm">
                 <span className="font-medium text-text-main">
                   <span className="text-xs text-text-sub mr-1">體重</span>
                   {record.weight} kg
                 </span>
                 <span className="font-medium text-text-main">
                   <span className="text-xs text-text-sub mr-1">體脂</span>
                   {record.bodyFat} %
                 </span>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;