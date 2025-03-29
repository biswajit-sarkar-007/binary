interface StressData {
    stressLevel: number;
    sleepHours: number;
    screenTime: number;
    timestamp: Date;
  }
  
  const STORAGE_KEY = 'stressTrackerData';
  
  export const saveData = (data: StressData) => {
    const existingData = getData();
    const newData = [...existingData, data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    
    // Trigger update event for other tabs
    window.dispatchEvent(new Event('stressDataUpdated'));
    
    return newData;
  };
  
  export const getData = (): StressData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  };
  
  export const clearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('stressDataUpdated'));
  }; 