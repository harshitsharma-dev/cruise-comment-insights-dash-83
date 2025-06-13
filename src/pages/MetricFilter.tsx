
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import BasicFilter from '@/components/BasicFilter';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const MetricFilter = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [filterBelow, setFilterBelow] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available metrics
  const { data: metricsData } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => apiService.getMetrics(),
  });

  const handleSearch = async (filterData: any) => {
    if (!selectedMetric) {
      alert('Please select a metric');
      return;
    }

    setIsLoading(true);
    try {
      const searchData = {
        ...filterData,
        metric: selectedMetric,
        filterBelow: filterBelow,
        compareToAverage: true
      };

      const response = await apiService.getMetricRating(searchData);
      setResults(response.results || []);
    } catch (error) {
      console.error('Error fetching metric data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Metric Filter</h1>
        <p className="text-gray-600 mt-2">Filter and analyze specific metrics across sailings</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BasicFilter onFilterChange={handleSearch} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a metric..." />
                </SelectTrigger>
                <SelectContent>
                  {metricsData?.data?.map((metric: string) => (
                    <SelectItem key={metric} value={metric}>
                      {metric}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Filter Below Rating: {filterBelow || 'None'}
              </label>
              <Slider
                value={[filterBelow || 5]}
                onValueChange={(value) => setFilterBelow(value[0])}
                max={10}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedMetric} Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{result.ship}</h3>
                      <p className="text-gray-600">Sailing: {result.sailingNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.averageRating}
                      </div>
                      <p className="text-sm text-gray-600">
                        {result.ratingCount} ratings
                      </p>
                    </div>
                  </div>

                  {result.filteredReviews && result.filteredReviews.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {result.filteredCount} reviews below {filterBelow}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {result.filteredReviews.slice(0, 3).map((review: string, idx: number) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded text-sm">
                            {review}
                          </div>
                        ))}
                        {result.filteredReviews.length > 3 && (
                          <p className="text-sm text-gray-600">
                            +{result.filteredReviews.length - 3} more reviews
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading results...</p>
        </div>
      )}
    </div>
  );
};

export default MetricFilter;
