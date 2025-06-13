
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import { apiService } from '../services/api';

interface Fleet {
  fleet: string;
  ships: string[];
}

interface BasicFilterProps {
  onFilterChange: (filters: any) => void;
  currentFilters?: any;
}

const BasicFilter: React.FC<BasicFilterProps> = ({ onFilterChange, currentFilters = {} }) => {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [selectedFleets, setSelectedFleets] = useState<string[]>(currentFilters.fleets || []);
  const [selectedShips, setSelectedShips] = useState<string[]>(currentFilters.ships || []);
  const [fromDate, setFromDate] = useState(currentFilters.fromDate || '');
  const [toDate, setToDate] = useState(currentFilters.toDate || '');
  const [sailingNumbers, setSailingNumbers] = useState<string[]>(currentFilters.sailingNumbers || []);

  useEffect(() => {
    loadFleets();
  }, []);

  const loadFleets = async () => {
    try {
      const response = await apiService.getFleets();
      setFleets(response.data);
    } catch (error) {
      console.error('Error loading fleets:', error);
    }
  };

  const handleFleetChange = (fleet: string, checked: boolean) => {
    const updatedFleets = checked 
      ? [...selectedFleets, fleet]
      : selectedFleets.filter(f => f !== fleet);
    
    setSelectedFleets(updatedFleets);
    
    // Reset ships if fleet is deselected
    if (!checked) {
      const fleetShips = fleets.find(f => f.fleet === fleet)?.ships || [];
      setSelectedShips(prev => prev.filter(ship => !fleetShips.includes(ship)));
    }
  };

  const handleShipChange = (ship: string, checked: boolean) => {
    const updatedShips = checked 
      ? [...selectedShips, ship]
      : selectedShips.filter(s => s !== ship);
    
    setSelectedShips(updatedShips);
  };

  const getAvailableShips = () => {
    return fleets
      .filter(fleet => selectedFleets.includes(fleet.fleet))
      .flatMap(fleet => fleet.ships);
  };

  const handleApplyFilters = () => {
    const filters = {
      fleets: selectedFleets,
      ships: selectedShips,
      fromDate,
      toDate,
      sailingNumbers,
      filter_by: 'date'
    };
    onFilterChange(filters);
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Basic Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fleet Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Fleet Selection</Label>
          <div className="grid grid-cols-2 gap-2">
            {fleets.map((fleet) => (
              <div key={fleet.fleet} className="flex items-center space-x-2">
                <Checkbox
                  id={`fleet-${fleet.fleet}`}
                  checked={selectedFleets.includes(fleet.fleet)}
                  onCheckedChange={(checked) => 
                    handleFleetChange(fleet.fleet, checked as boolean)
                  }
                />
                <Label htmlFor={`fleet-${fleet.fleet}`} className="text-sm">
                  {capitalizeFirst(fleet.fleet)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Ship Selection */}
        {selectedFleets.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Ship Selection</Label>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableShips().map((ship) => (
                <div key={ship} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ship-${ship}`}
                    checked={selectedShips.includes(ship)}
                    onCheckedChange={(checked) => 
                      handleShipChange(ship, checked as boolean)
                    }
                  />
                  <Label htmlFor={`ship-${ship}`} className="text-sm">
                    {capitalizeFirst(ship)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromDate">Start Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate">End Date</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleApplyFilters}
          className="w-full"
          disabled={selectedFleets.length === 0 || !fromDate || !toDate}
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default BasicFilter;
