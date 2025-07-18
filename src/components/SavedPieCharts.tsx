
import React, { useState, useEffect } from 'react';
import { Eye, Trash, PieChart, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { loadCharts, deleteChart, ChartData } from '../utils/chartStorage';
import { useNavigate } from 'react-router-dom';

const SavedPieCharts = () => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<ChartData | null>(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState<ChartData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadSavedCharts = async () => {
    try {
      setLoading(true);
      const savedCharts = await loadCharts('pie');
      setCharts(savedCharts);
    } catch (error) {
      toast({
        title: "Error loading charts",
        description: "Failed to load saved pie charts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChart = async (id: string) => {
    const chartToDelete = charts.find(chart => chart.id === id);
    if (!chartToDelete) return;

    try {
      await deleteChart(id, 'pie');
      setCharts(charts.filter(chart => chart.id !== id));
      setRecentlyDeleted(chartToDelete);
      
      toast({
        title: "Chart deleted",
        description: "Pie chart has been deleted successfully",
        action: (
          <Button variant="outline" size="sm" onClick={() => handleUndoDelete(chartToDelete)}>
            <Undo2 className="w-4 h-4 mr-1" />
            Undo
          </Button>
        ),
      });

      // Clear undo option after 10 seconds
      setTimeout(() => setRecentlyDeleted(null), 10000);
    } catch (error) {
      toast({
        title: "Error deleting chart",
        description: "Failed to delete the chart",
        variant: "destructive",
      });
    }
  };

  const handleUndoDelete = async (chartData: ChartData) => {
    try {
      // In a real app, this would restore the chart to the database
      setCharts(prevCharts => [chartData, ...prevCharts]);
      setRecentlyDeleted(null);
      
      toast({
        title: "Chart restored",
        description: "Pie chart has been restored successfully",
      });
    } catch (error) {
      toast({
        title: "Error restoring chart",
        description: "Failed to restore the chart",
        variant: "destructive",
      });
    }
  };

  const handleGenerateChart = (chartData: ChartData) => {
    // Store the chart data in sessionStorage to load in the generator
    sessionStorage.setItem('loadChartData', JSON.stringify(chartData));
    navigate('/pie-chart');
    
    toast({
      title: "Chart loaded",
      description: "Chart data has been loaded in the generator",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSummary = (data: ChartData['data']) => {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    return `${data.length} items, Total: ${totalValue}`;
  };

  useEffect(() => {
    loadSavedCharts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading saved charts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Pie Charts</h1>
          <p className="text-gray-600">Manage your saved pie chart configurations</p>
        </div>

        {charts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved charts</h3>
              <p className="text-gray-600 mb-4">You haven't saved any pie charts yet.</p>
              <Button onClick={() => navigate('/pie-chart')}>
                Create Your First Chart
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Saved Charts ({charts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {charts.map((chart) => (
                  <div key={chart.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <PieChart className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">Chart #{chart.id?.slice(-8)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{formatDate(chart.timestamp)}</p>
                      <p className="text-sm text-gray-500">{getSummary(chart.data)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedChart(chart)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chart Data</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                              {JSON.stringify(selectedChart, null, 2)}
                            </pre>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateChart(chart)}
                      >
                        <PieChart className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => chart.id && handleDeleteChart(chart.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedPieCharts;
