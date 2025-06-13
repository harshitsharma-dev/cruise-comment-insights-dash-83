
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart3 } from 'lucide-react';
import { apiService } from '../services/api';
import BasicFilter from './BasicFilter';

const RatingSummary = () => {
  const [ratingsData, setRatingsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const ratingGroups = {
    'overall': {
      title: 'Overall & Pre/Post',
      metrics: ['Overall Holiday', 'Embarkation/Disembarkation', 'Value for Money', 'Pre-Cruise Hotel Accommodation']
    },
    'accommodation': {
      title: 'Onboard Accommodation',
      metrics: ['Cabins', 'Cabin Cleanliness', 'Crew Friendliness', 'Ship Condition/Cleanliness (Public Areas)']
    },
    'food': {
      title: 'Food & Beverage',
      metrics: ['F&B Quality', 'F&B Staff Service', 'Bar Service', 'Drinks Offerings and Menu']
    },
    'activities': {
      title: 'Activities & Services',
      metrics: ['Entertainment', 'Excursions', 'Prior Customer Service', 'Flight', 'App Booking']
    }
  };

  const handleFilterChange = async (newFilters: any) => {
    setFilters(newFilters);
    setLoading(true);
    
    try {
      const filtersPayload = {
        filter_by: 'date',
        filters: {
          fromDate: newFilters.fromDate,
          toDate: newFilters.toDate
        }
      };
      
      const response = await apiService.getRatingSummary(filtersPayload);
      setRatingsData(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Implementation for Excel export
    console.log('Exporting to Excel...');
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-100 text-green-800';
    if (rating >= 6) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rating Summary</h1>
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <BasicFilter onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading ratings data...</p>
                </div>
              </CardContent>
            </Card>
          ) : ratingsData.length > 0 ? (
            <Tabs defaultValue="overall" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {Object.entries(ratingGroups).map(([key, group]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {group.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(ratingGroups).map(([key, group]) => (
                <TabsContent key={key} value={key}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{group.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-2 text-left">Ship</th>
                              <th className="border border-gray-300 p-2 text-left">Sailing</th>
                              <th className="border border-gray-300 p-2 text-left">Fleet</th>
                              {group.metrics.map(metric => (
                                <th key={metric} className="border border-gray-300 p-2 text-center text-xs">
                                  {metric}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {ratingsData.map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 p-2 font-medium">
                                  {row['Ship Name']}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {row['Sailing Number']}
                                </td>
                                <td className="border border-gray-300 p-2">
                                  {row['Fleet']}
                                </td>
                                {group.metrics.map(metric => (
                                  <td key={metric} className="border border-gray-300 p-2 text-center">
                                    {row[metric] !== undefined && row[metric] !== null ? (
                                      <Badge 
                                        className={getRatingColor(parseFloat(row[metric]))}
                                        variant="secondary"
                                      >
                                        {parseFloat(row[metric]).toFixed(1)}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400">N/A</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select filters and apply to view rating data</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
