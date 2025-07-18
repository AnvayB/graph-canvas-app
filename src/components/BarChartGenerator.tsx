import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Plus, Minus, Save, BarChart3, Shuffle, FileText } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { saveChart } from '../utils/chartStorage';
import Navigation from './Navigation';

interface DataItem {
  label: string;
  value: number;
  color: string;
}

const initialData: DataItem[] = [
  { label: 'Category A', value: 30, color: '#2563eb' },
  { label: 'Category B', value: 50, color: '#3b82f6' },
  { label: 'Category C', value: 70, color: '#60a5fa' },
  { label: 'Category D', value: 40, color: '#93c5fd' },
];

const BarChartGenerator = () => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [chartTitle, setChartTitle] = useState('Interactive Bar Chart');
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [isChartSaved, setIsChartSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    drawChart();
  }, [data]);

  const drawChart = () => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 60, right: 30, bottom: 70, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .rangeRound([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(5);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label) || "0")
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => d.color)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 0.7);
        
        g.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.label) || "0" + x.bandwidth() / 2)
          .attr("y", y(d.value) - 5)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "black")
          .text(`${d.value}`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1);
        d3.select(".tooltip").remove();
      });

      // Chart title
      svg.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text(chartTitle);

      // X axis label
      svg.append("text")
        .attr("x", (width + margin.left + margin.right) / 2)
        .attr("y", height + margin.top + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Categories");

      // Y axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 10)
        .attr("x", -(height + margin.top + margin.bottom) / 2 + margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Value");
  };

  const addDataRow = () => {
    const newLabel = `Category ${String.fromCharCode(65 + data.length)}`;
    const newValue = Math.floor(Math.random() * 100);
    const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    setData([...data, { label: newLabel, value: newValue, color: newColor }]);
  };

  const removeDataRow = () => {
    if (data.length > 1) {
      setData(data.slice(0, -1));
    }
  };

  const randomizeData = () => {
    const newData = data.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 100),
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    }));
    setData(newData);
  };

  const handleSaveChart = async () => {
    setIsChartSaved(true);
    try {
      await saveChart('bar', chartTitle, data);
      toast({
        title: "Chart saved!",
        description: "Your bar chart has been successfully saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving chart",
        description: "Failed to save the bar chart.",
      });
    } finally {
      setTimeout(() => setIsChartSaved(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bar Chart Generator
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Customize your bar chart with dynamic data.
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">

            <div className="mb-4">
              <label htmlFor="chartTitle" className="block text-sm font-medium text-gray-700">
                Chart Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="chartTitle"
                  id="chartTitle"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4 flex space-x-2">
              <button
                onClick={addDataRow}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Data
              </button>
              <button
                onClick={removeDataRow}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Data
              </button>
              <button
                onClick={randomizeData}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize
              </button>
            </div>

            <div className="overflow-x-auto">
              <svg ref={chartRef} width="800" height="500"></svg>
            </div>

            <div className="mt-4">
              <button
                onClick={handleSaveChart}
                disabled={isChartSaved}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isChartSaved ? 'Saving...' : 'Save Chart'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartGenerator;
