
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import BasicFilter from '@/components/BasicFilter';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const Issues = () => {
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [issuesData, setIssuesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available sheets
  const { data: sheetsData } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => apiService.getSheets(),
  });

  const handleAnalyze = async (filterData: any) => {
    setIsLoading(true);
    try {
      const requestData = {
        ...filterData,
        sheet_names: selectedSheets.length > 0 ? selectedSheets : undefined
      };

      const response = await apiService.getIssuesSummary(requestData);
      setIssuesData(response.data);
    } catch (error) {
      console.error('Error fetching issues data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issues Analysis</h1>
        <p className="text-gray-600 mt-2">Identify and track issues across sailings</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BasicFilter onFilterChange={handleAnalyze} />
          
          <div>
            <label className="block text-sm font-medium mb-2">Sheet Selection</label>
            <Select 
              value={selectedSheets[0] || 'all'} 
              onValueChange={(value) => setSelectedSheets(value === 'all' ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sheets to analyze..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sheets</SelectItem>
                {sheetsData?.data?.map((sheet: string) => (
                  <SelectItem key={sheet} value={sheet}>
                    {sheet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => handleAnalyze({})} disabled={isLoading} className="w-full">
            {isLoading ? 'Analyzing...' : 'Analyze Issues'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {issuesData && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{issuesData.total_issues || 0}</div>
                <p className="text-xs text-gray-600">Across all sailings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {issuesData.resolved_issues || 0}
                </div>
                <p className="text-xs text-gray-600">Successfully addressed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {issuesData.unresolved_issues || 0}
                </div>
                <p className="text-xs text-gray-600">Requiring attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Issues List */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Details by Sailing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock detailed issues - replace with actual data structure when available */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Ship Explorer - Sailing EX001</h3>
                      <p className="text-sm text-gray-600">March 15-22, 2024</p>
                    </div>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50 rounded">
                      <p className="text-sm font-medium text-red-800">Cabin Cleanliness Issues</p>
                      <p className="text-sm text-red-600">Multiple reports of inadequate cleaning</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded">
                      <p className="text-sm font-medium text-yellow-800">Food Service Delays</p>
                      <p className="text-sm text-yellow-600">Extended wait times reported</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Ship Discovery - Sailing DI002</h3>
                      <p className="text-sm text-gray-600">March 22-29, 2024</p>
                    </div>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-50 rounded">
                      <p className="text-sm font-medium text-yellow-800">Entertainment Equipment</p>
                      <p className="text-sm text-yellow-600">Technical issues with sound system</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trends Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Issues Trend Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Issue trends chart will be displayed here</p>
                  <p className="text-sm text-gray-500">Data visualization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Analyzing issues...</p>
        </div>
      )}
    </div>
  );
};

export default Issues;
