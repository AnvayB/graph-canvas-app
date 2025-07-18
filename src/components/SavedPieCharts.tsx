import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Trash2, PieChart, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { loadCharts, deleteChart } from '../utils/chartStorage';
import Navigation from './Navigation';

interface PieChartData {
  id: string;
  title: string;
  data: { label: string; value: number; color: string }[];
}

const SavedPieCharts = () => {
  const [savedCharts, setSavedCharts] = useState<PieChartData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const charts = await loadCharts<PieChartData>('pie-charts');
        setSavedCharts(charts);
      } catch (error) {
        toast({
          title: 'Error loading charts',
          description: 'Failed to load saved pie charts.',
          variant: 'destructive',
        });
      }
    };

    fetchCharts();
  }, [toast]);

  const handleDeleteChart = async (id: string) => {
    try {
      await deleteChart('pie-charts', id);
      setSavedCharts(savedCharts.filter((chart) => chart.id !== id));
      toast({
        title: 'Chart deleted',
        description: 'The pie chart has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error deleting chart',
        description: 'Failed to delete the pie chart.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Saved Pie Charts</h2>

        {savedCharts.length === 0 ? (
          <div className="text-gray-500">No saved pie charts yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCharts.map((chart) => (
              <div key={chart.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{chart.title}</h3>
                <div className="flex justify-end space-x-2">
                  <Link to={`/pie-chart?chartId=${chart.id}`}>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteChart(chart.id)}
                    className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPieCharts;
