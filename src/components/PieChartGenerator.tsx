import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Plus, Minus, Save, PieChart, Shuffle, FileText } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { saveChart } from '../utils/chartStorage';
import Navigation from './Navigation';

interface PieChartData {
  label: string;
  value: number;
  color: string;
  id: string;
}

const initialData: PieChartData[] = [
  { label: 'Category A', value: 30, color: '#1f77b4', id: '1' },
  { label: 'Category B', value: 25, color: '#ff7f0e', id: '2' },
  { label: 'Category C', value: 15, color: '#2ca02c', id: '3' },
  { label: 'Category D', value: 20, color: '#d62728', id: '4' },
  { label: 'Category E', value: 10, color: '#9467bd', id: '5' },
];

const PieChartGenerator = () => {
  const [data, setData] = useState<PieChartData[]>(initialData);
  const [chartTitle, setChartTitle] = useState<string>('Sample Pie Chart');
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [nextId, setNextId] = useState(initialData.length + 1);
  const { toast } = useToast();

  useEffect(() => {
    drawChart();
  }, [data]);

  const drawChart = () => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal<string, string>()
      .domain(data.map(d => d.label))
      .range(data.map(d => d.color));

    const pie = d3.pie<PieChartData>().value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const outerArc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const g = svg.select('g')
      .selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data.label))
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7);
        toast({
          title: d.data.label,
          description: `Value: ${d.data.value}`,
        });
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1);
      });

    g.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(d => {
        const percentage = (d.data.value / d3.sum(data, d => d.value)) * 100;
        return percentage > 5 ? `${percentage.toFixed(1)}%` : '';
      })
      .style('fill', 'white')
      .style('font-size', '12px');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.5em')
      .text(chartTitle);

    svg.append('line')
      .attr('x1', width / 2 - 50)
      .attr('y1', 25)
      .attr('x2', width / 2 + 50)
      .attr('y2', 25)
      .style('stroke', 'currentColor')
      .style('stroke-width', '2px');

    svg.selectAll('.arc')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7);
        toast({
          title: d.data.label,
          description: `Value: ${d.data.value}`,
        });
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1);
      });
  };

  const addDataRow = () => {
    const newId = nextId.toString();
    setNextId(nextId + 1);
    const newData = [...data, { label: `Category ${String.fromCharCode(64 + nextId)}`, value: 10, color: getRandomColor(), id: newId }];
    setData(newData);
  };

  const removeDataRow = () => {
    if (data.length > 1) {
      const newData = [...data];
      newData.pop();
      setData(newData);
    } else {
      toast({
        title: 'Cannot remove',
        description: 'Pie chart must have at least one category.',
      });
    }
  };

  const randomizeData = () => {
    const newData = data.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 50) + 10,
    }));
    setData(newData);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSaveChart = async () => {
    if (!chartRef.current) {
      toast({
        title: 'Error',
        description: 'No chart to save.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const svgData = chartRef.current.outerHTML;
      await saveChart(chartTitle, svgData, 'pie');
      toast({
        title: 'Chart Saved',
        description: 'The chart has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save the chart.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pie Chart Generator</h2>
          <p className="text-gray-600">Customize your pie chart with dynamic data and save it for later use.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Chart Preview</h3>
            <div className="space-x-2">
              <button
                onClick={addDataRow}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-500 text-white hover:bg-green-500/90 h-9 px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </button>
              <button
                onClick={removeDataRow}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-500/90 h-9 px-4 py-2"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Row
              </button>
              <button
                onClick={randomizeData}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-500/90 h-9 px-4 py-2"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Randomize
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <svg ref={chartRef}></svg>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Chart Configuration</h3>

          <div className="mb-4">
            <label htmlFor="chartTitle" className="block text-sm font-medium text-gray-700">Chart Title</label>
            <input
              type="text"
              id="chartTitle"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
            />
          </div>

          <button
            onClick={handleSaveChart}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-purple-500 text-white hover:bg-purple-500/90 h-10 px-4 py-2 w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Chart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PieChartGenerator;
