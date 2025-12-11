import React, { useState, useEffect } from 'react';
import { DailyRecord } from '../types';
import { getRecord, saveRecord } from '../services/storageService';

interface InputViewProps {
  onSave: (message: string) => void;
}

const InputView: React.FC<InputViewProps> = ({ onSave }) => {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [todayStr, setTodayStr] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const now = new Date();
    
    // Format: YYYY-MM-DD for storage key
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    setTodayStr(dateKey);

    // Format: 2025 年 12 月 11 日（四） for display
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'short' 
    };
    // Customize to match "2025 年 12 月 11 日（四）" broadly (browser dependent, but close enough)
    // Custom formatting to match exactly the requested style
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const formatted = `${yyyy} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日（${dayNames[now.getDay()]}）`;
    setDisplayDate(formatted);

    // Check for existing record
    const existing = getRecord(dateKey);
    if (existing) {
      setWeight(existing.weight);
      setBodyFat(existing.bodyFat);
      setIsUpdate(true);
    }
  }, []);

  const handleSave = () => {
    if (!weight && !bodyFat) return;

    const record: DailyRecord = {
      date: todayStr,
      weight,
      bodyFat
    };

    saveRecord(record);
    
    if (isUpdate) {
      onSave('已更新今天的紀錄');
    } else {
      onSave('已儲存今天的紀錄');
      setIsUpdate(true);
    }
  };

  const handleNumberInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pt-4 pb-24 px-4">
      {/* Date Header */}
      <h2 className="text-white text-xl font-medium mb-1 drop-shadow-md">每日紀錄</h2>
      <p className="text-white/90 text-lg mb-6 drop-shadow-sm font-light tracking-wide">{displayDate}</p>

      {/* Input Card */}
      <div className="bg-white w-full rounded-3xl p-6 shadow-xl shadow-rose-900/10 flex flex-col gap-6">
        <h3 className="text-text-main text-lg font-bold text-center mb-2">今天的紀錄</h3>

        {/* Weight Input */}
        <div>
          <label className="block text-text-sub text-sm font-medium mb-2">體重</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={handleNumberInput(setWeight)}
              placeholder="請輸入體重"
              className="flex-1 bg-gray-50 border border-gray-200 text-text-main text-xl font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 transition-all"
            />
            <span className="bg-gray-100 text-text-sub text-sm font-bold px-3 py-3 rounded-xl min-w-[3rem] text-center select-none">kg</span>
          </div>
        </div>

        {/* Body Fat Input */}
        <div>
          <label className="block text-text-sub text-sm font-medium mb-2">體脂</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={bodyFat}
              onChange={handleNumberInput(setBodyFat)}
              placeholder="請輸入體脂"
              className="flex-1 bg-gray-50 border border-gray-200 text-text-main text-xl font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 transition-all"
            />
            <span className="bg-gray-100 text-text-sub text-sm font-bold px-3 py-3 rounded-xl min-w-[3rem] text-center select-none">%</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-2">
          <button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all text-white font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/30"
          >
            儲存今天的紀錄
          </button>
          <p className="text-center text-xs text-text-sub mt-4 leading-relaxed">
            每天只會保留一筆紀錄，<br/>重新儲存會覆蓋當天舊資料。
          </p>
        </div>
      </div>
      
      {!isUpdate && (
         <p className="text-white/80 text-sm mt-8 text-center font-light">
           從今天開始記錄，看看自己的變化。
         </p>
      )}
    </div>
  );
};

export default InputView;