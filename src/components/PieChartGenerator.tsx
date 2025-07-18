
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

const PieChartGenerator = () => {
  const [data, setData] = useState<DataRow[]>([
    { label: 'Category A', value: 35, color: '#3B82F6' },
    { label: 'Category B', value: 25, color: '#10B981' },
    { label: 'Category C', value: 20, color: '#F59E0B' },
    { label: 'Category D', value: 20, color: '#EF4444' }
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
      { label: 'Mobile', value: 42, color: '#3B82F6' },
      { label: 'Desktop', value: 35, color: '#10B981' },
      { label: 'Tablet', value: 18, color: '#F59E0B' },
      { label: 'Other', value: 5, color: '#EF4444' }
    ];
    setData(sampleData);
    toast({
      title: "Sample data loaded",
      description: "Device usage statistics have been loaded",
    });
  };

  const generateRandomData = () => {
    const labels = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E'];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const randomData = labels.slice(0, Math.floor(Math.random() * 4) + 2).map((label, index) => ({
      label,
      value: Math.floor(Math.random() * 40) + 10,
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
        type: 'pie',
        data,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Chart saved successfully",
        description: "Your pie chart has been saved to the database",
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

    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const total = d3.sum(data, d => d.value);
    const pie = d3.pie<DataRow>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<DataRow>>()
      .innerRadius(0)
      .outerRadius(radius);

    const labelArc = d3.arc<d3.PieArcDatum<DataRow>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Add pie slices
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add percentage labels
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.5)')
      .style('opacity', 0)
      .text(d => {
        const percentage = ((d.data.value / total) * 100).toFixed(1);
        return `${percentage}%`;
      })
      .transition()
      .delay(800)
      .duration(400)
      .style('opacity', 1);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => d.color)
      .attr('rx', 3);

    legendItems.append('text')
      .attr('x', 25)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.label);

    toast({
      title: "Chart generated",
      description: "Your pie chart has been created successfully",
    });
  };

  useEffect(() => {
    generateChart();
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pie Chart Generator</h1>
          <p className="text-gray-600">Create interactive pie charts with percentage displays and custom colors</p>
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
                <div className="bg-white p-4 rounded-lg border flex justify-center">
                  <svg ref={svgRef} className="max-w-full"></svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartGenerator;
