
// Mock storage system - In a real app, this would connect to a backend API
export interface ChartData {
  id?: string;
  type: 'bar' | 'pie';
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  timestamp: string;
}

const STORAGE_KEY_BAR = 'saved-bar-charts';
const STORAGE_KEY_PIE = 'saved-pie-charts';

export const saveChart = async (chartData: ChartData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const storageKey = chartData.type === 'bar' ? STORAGE_KEY_BAR : STORAGE_KEY_PIE;
      const existingCharts = getChartsFromStorage(storageKey);
      
      const newChart = {
        ...chartData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      
      const updatedCharts = [newChart, ...existingCharts];
      localStorage.setItem(storageKey, JSON.stringify(updatedCharts));
      
      // Simulate network delay
      setTimeout(() => resolve(), 500);
    } catch (error) {
      setTimeout(() => reject(error), 500);
    }
  });
};

export const loadCharts = async (type: 'bar' | 'pie'): Promise<ChartData[]> => {
  return new Promise((resolve) => {
    const storageKey = type === 'bar' ? STORAGE_KEY_BAR : STORAGE_KEY_PIE;
    const charts = getChartsFromStorage(storageKey);
    
    // Simulate network delay
    setTimeout(() => resolve(charts), 300);
  });
};

export const deleteChart = async (id: string, type: 'bar' | 'pie'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const storageKey = type === 'bar' ? STORAGE_KEY_BAR : STORAGE_KEY_PIE;
      const existingCharts = getChartsFromStorage(storageKey);
      const updatedCharts = existingCharts.filter(chart => chart.id !== id);
      
      localStorage.setItem(storageKey, JSON.stringify(updatedCharts));
      
      // Simulate network delay
      setTimeout(() => resolve(), 300);
    } catch (error) {
      setTimeout(() => reject(error), 300);
    }
  });
};

const getChartsFromStorage = (storageKey: string): ChartData[] => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
