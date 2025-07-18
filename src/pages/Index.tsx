
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, PieChart, Database, Home } from 'lucide-react';
import BarChartGenerator from '../components/BarChartGenerator';
import PieChartGenerator from '../components/PieChartGenerator';
import SavedBarCharts from '../components/SavedBarCharts';
import SavedPieCharts from '../components/SavedPieCharts';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/bar-chart', label: 'Bar Chart', icon: BarChart3 },
    { path: '/pie-chart', label: 'Pie Chart', icon: PieChart },
    { path: '/saved-bar', label: 'Saved Bar Charts', icon: Database },
    { path: '/saved-pie', label: 'Saved Pie Charts', icon: Database },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Chart Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create beautiful bar and pie charts with dynamic data management and persistent storage
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link
            to="/bar-chart"
            className="group bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
              Bar Chart Generator
            </h3>
            <p className="text-gray-600 text-center">
              Create horizontal bar charts with custom colors, dynamic data input, and real-time visualization
            </p>
          </Link>

          <Link
            to="/pie-chart"
            className="group bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 mx-auto group-hover:bg-green-200 transition-colors">
              <PieChart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-center text-gray-900 mb-4">
              Pie Chart Generator
            </h3>
            <p className="text-gray-600 text-center">
              Generate pie charts with percentage displays, color customization, and interactive elements
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Persistence</h3>
              <p className="text-gray-600 text-sm">Save and load chart configurations with complete data management</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dynamic Data</h3>
              <p className="text-gray-600 text-sm">Add/remove data rows with real-time validation and updates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Charts</h3>
              <p className="text-gray-600 text-sm">Professional visualizations with hover effects and customization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bar-chart" element={<BarChartGenerator />} />
          <Route path="/pie-chart" element={<PieChartGenerator />} />
          <Route path="/saved-bar" element={<SavedBarCharts />} />
          <Route path="/saved-pie" element={<SavedPieCharts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Index;
