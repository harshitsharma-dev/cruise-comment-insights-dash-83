
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import BasicFilter from '@/components/BasicFilter';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('semantic');
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [mealTime, setMealTime] = useState('all');
  const [numResults, setNumResults] = useState(10);
  const [cutOff, setCutOff] = useState([7]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available sheets
  const { data: sheetsData } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => apiService.getSheets(),
  });

  const handleSearch = async (filterData: any) => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const searchData = {
        query,
        fleets: filterData.fleets || [],
        ships: filterData.ships || [],
        filter_params: filterData.filters || {},
        sheet_names: selectedSheets,
        meal_time: mealTime === 'all' ? undefined : mealTime,
        semanticSearch: searchType === 'semantic',
        similarity_score_range: searchType === 'semantic' ? [cutOff[0] / 10, 1.0] : [0, 1],
        num_results: numResults
      };

      const response = await apiService.semanticSearch(searchData);
      setResults(response.results || []);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2">Search through guest comments and feedback</p>
      </div>

      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Search Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BasicFilter onFilterChange={handleSearch} />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="search-query">Search Query</Label>
              <Input
                id="search-query"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Search Type</Label>
                <RadioGroup value={searchType} onValueChange={setSearchType} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semantic" id="semantic" />
                    <Label htmlFor="semantic">Semantic/AI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="keyword" id="keyword" />
                    <Label htmlFor="keyword">Keyword</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Sheet Names</Label>
                <Select value={selectedSheets[0] || ''} onValueChange={(value) => setSelectedSheets([value])}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select sheet..." />
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

              <div>
                <Label>Meal Time</Label>
                <Select value={mealTime} onValueChange={setMealTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Number of Results: {numResults}</Label>
                <Slider
                  value={[numResults]}
                  onValueChange={(value) => setNumResults(value[0])}
                  max={100}
                  min={5}
                  step={5}
                  className="mt-2"
                />
              </div>

              {searchType === 'semantic' && (
                <div>
                  <Label>Cut-Off Score: {cutOff[0]}</Label>
                  <Slider
                    value={cutOff}
                    onValueChange={setCutOff}
                    max={10}
                    min={1}
                    step={0.5}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </div>

          <Button onClick={() => handleSearch({})} disabled={isLoading} className="w-full">
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {result.metadata?.fleet}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {result.metadata?.ship}
                      </span>
                      {result.sheet_name && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {result.sheet_name}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {result.metadata?.sailing_number}
                    </span>
                  </div>
                  <p className="text-gray-800">{result.comment}</p>
                  {result.meal_time && (
                    <p className="text-sm text-gray-600 mt-2">
                      Meal Time: {result.meal_time}
                    </p>
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
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      )}
    </div>
  );
};

export default Search;
