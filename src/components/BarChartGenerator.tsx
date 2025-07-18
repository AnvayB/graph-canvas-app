
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, Save, RotateCcw, Shuffle } from 'lucide-react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveChart } from '../utils/chartStorage';

interface DataRow {
  label: string;
  value: number;
  color: string;
}

const BarChartGenerator = () => {
  const [data, setData] = useState<DataRow[]>([
    { label: 'Product A', value: 45, color: '#3B82F6' },
    { label: 'Product B', value: 32, color: '#10B981' },
    { label: 'Product C', value: 28, color: '#F59E0B' }
  ]);
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const addDataRow = () => {
    const colors = ['#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setData([...data, { label: '', value: 0, color: randomColor }]);
  };

  const removeDataRow = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const updateDataRow = (index: number, field: keyof DataRow, value: string | number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const generateSampleData = () => {
    const sampleData = [
      { label: 'Sales Q1', value: 85, color: '#3B82F6' },
      { label: 'Sales Q2', value: 92, color: '#10B981' },
      { label: 'Sales Q3', value: 76, color: '#F59E0B' },
      { label: 'Sales Q4', value: 88, color: '#EF4444' }
    ];
    setData(sampleData);
    toast({
      title: "Sample data loaded",
      description: "Quarterly sales data has been loaded",
    });
  };

  const generateRandomData = () => {
    const labels = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const randomData = labels.slice(0, Math.floor(Math.random() * 4) + 2).map((label, index) => ({
      label,
      value: Math.floor(Math.random() * 90) + 10,
      color: colors[index]
    }));
    setData(randomData);
    toast({
      title: "Random data generated",
      description: `Generated ${randomData.length} data points`,
    });
  };

  const saveChartData = async () => {
    try {
      await saveChart({
        type: 'bar',
        data,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Chart saved successfully",
        description: "Your bar chart has been saved to the database",
      });
    } catch (error) {
      toast({
        title: "Error saving chart",
        description: "Failed to save chart data",
        variant: "destructive",
      });
    }
  };

  const generateChart = () => {
    if (!svgRef.current || data.some(d => !d.label || d.value <= 0)) {
      toast({
        title: "Invalid data",
        description: "Please ensure all labels are filled and values are positive",
        variant: "destructive",
      });
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, height])
      .padding(0.1);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => yScale(d.label) || 0)
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .transition()
      .duration(800)
      .attr('width', d => xScale(d.value));

    // Add value labels
    g.selectAll('.value-label')
      .data(data)
      .enter().append('text')
      .attr('class', 'value-label')
      .attr('x', d => xScale(d.value) + 5)
      .attr('y', d => (yScale(d.label) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .style('font-weight', '500')
      .style('opacity', 0)
      .text(d => d.value)
      .transition()
      .delay(800)
      .duration(400)
      .style('opacity', 1);

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .style('font-size', '12px')
      .style('color', '#374151');

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .style('font-size', '12px')
      .style('color', '#374151');

    toast({
      title: "Chart generated",
      description: "Your bar chart has been created successfully",
    });
  };

  useEffect(() => {
    generateChart();
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bar Chart Generator</h1>
          <p className="text-gray-600">Create interactive horizontal bar charts with custom data and colors</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Data Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.map((row, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Data Point {index + 1}</Label>
                      {data.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDataRow(index)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`label-${index}`} className="text-xs text-gray-600">Label</Label>
                      <Input
                        id={`label-${index}`}
                        value={row.label}
                        onChange={(e) => updateDataRow(index, 'label', e.target.value)}
                        placeholder="Enter label"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`value-${index}`} className="text-xs text-gray-600">Value</Label>
                      <Input
                        id={`value-${index}`}
                        type="number"
                        value={row.value}
                        onChange={(e) => updateDataRow(index, 'value', parseFloat(e.target.value) || 0)}
                        placeholder="Enter value"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`color-${index}`} className="text-xs text-gray-600">Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          id={`color-${index}`}
                          type="color"
                          value={row.color}
                          onChange={(e) => updateDataRow(index, 'color', e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <Input
                          value={row.color}
                          onChange={(e) => updateDataRow(index, 'color', e.target.value)}
                          placeholder="#000000"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button onClick={addDataRow} className="flex-1" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button onClick={generateSampleData} variant="outline" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Load Sample Data
                  </Button>
                  <Button onClick={generateRandomData} variant="outline" className="w-full">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Generate Random Data
                  </Button>
                  <Button onClick={saveChartData} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Chart Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border">
                  <svg ref={svgRef} className="w-full"></svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartGenerator;
