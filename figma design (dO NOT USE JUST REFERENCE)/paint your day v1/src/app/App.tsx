import { useState, useEffect } from 'react';
import { AppData } from './types';
import { loadData, saveData } from './utils/storage';
import { TodayScreen } from './components/TodayScreen';
import { MosaicView } from './components/MosaicView';
import { CategoriesScreen } from './components/CategoriesScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { Navigation } from './components/Navigation';

export default function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [activeScreen, setActiveScreen] = useState('today');

  const handleUpdateData = (newData: AppData) => {
    setData(newData);
    saveData(newData);
  };

  useEffect(() => {
    saveData(data);
  }, [data]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 max-w-md mx-auto">
      <main className="flex-1 overflow-hidden">
        {activeScreen === 'today' && (
          <TodayScreen data={data} onUpdateData={handleUpdateData} />
        )}
        {activeScreen === 'mosaic' && <MosaicView data={data} />}
        {activeScreen === 'categories' && (
          <CategoriesScreen data={data} onUpdateData={handleUpdateData} />
        )}
        {activeScreen === 'insights' && <InsightsScreen data={data} />}
      </main>

      <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
    </div>
  );
}