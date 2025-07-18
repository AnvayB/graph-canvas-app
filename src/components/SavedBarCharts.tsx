import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Trash2, BarChart3, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { loadCharts, deleteChart } from '../utils/chartStorage';
import Navigation from './Navigation';

interface ChartData {
  id: string;
  name: string;
  data: { label: string; value: number; color: string }[];
  xAxisLabel: string;
  yAxisLabel: string;
}

const SavedBarCharts = () => {
  const [savedCharts, setSavedCharts] = useState<ChartData[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCharts = async () => {
      const charts = await loadCharts('bar');
      setSavedCharts(charts);
    };

    fetchCharts();
  }, []);

  const handleChartSelect = (chart: ChartData) => {
    setSelectedChart(chart);
  };

  const handleChartDelete = async (id: string) => {
    await deleteChart(id, 'bar');
    setSavedCharts(savedCharts.filter((chart) => chart.id !== id));
    setSelectedChart(null);
    toast({
      title: "Chart deleted",
      description: "The chart has been successfully deleted.",
    });
  };

  const handleGoBack = () => {
    setSelectedChart(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedChart ? (
          <div>
            <div className="mb-4">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Saved Charts
              </button>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">{selectedChart.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Chart Details</p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Chart Data</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {selectedChart.data.map((item, index) => (
                          <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <BarChart3 className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                              <span className="ml-2 flex-1 w-0 truncate">{item.label}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <span className="text-gray-500">Value: {item.value}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">X-Axis Label</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedChart.xAxisLabel}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Y-Axis Label</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedChart.yAxisLabel}</dd>
                  </div>
                </dl>
              </div>
              <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end">
                <button
                  onClick={() => handleChartDelete(selectedChart.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <Trash2 className="w-4 h-4 mr-2 inline-block" />
                  Delete Chart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Saved Bar Charts
                </h2>
              </div>
              <div className="mt-4 flex md:mt-0">
                <Link
                  to="/bar-chart"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <BarChart3 className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
                  Create New Bar Chart
                </Link>
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedCharts.map((chart) => (
                <li key={chart.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                  <div className="w-full flex items-center justify-between p-6 space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-gray-900 text-sm font-medium truncate">{chart.name}</h3>
                      </div>
                      <p className="mt-1 text-gray-500 text-sm truncate">
                        X-Axis: {chart.xAxisLabel}, Y-Axis: {chart.yAxisLabel}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="w-0 flex-1 flex">
                        <button
                          onClick={() => handleChartSelect(chart)}
                          className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                        >
                          <Eye className="w-5 h-5 text-gray-400" aria-hidden="true" />
                          <span className="ml-3">View</span>
                        </button>
                      </div>
                      <div className="-ml-px w-0 flex-1 flex">
                        <button
                          onClick={() => handleChartDelete(chart.id)}
                          className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400" aria-hidden="true" />
                          <span className="ml-3">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBarCharts;
