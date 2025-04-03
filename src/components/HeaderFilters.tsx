
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Filter } from 'lucide-react';
import FilterPanel from './FilterPanel';

interface HeaderFiltersProps {
  onFilter: (filters: any) => void;
  onExport: () => void;
}

const HeaderFilters: React.FC<HeaderFiltersProps> = ({ onFilter, onExport }) => {
  const [hospital, setHospital] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleFilterApply = (filters: any) => {
    setAppliedFilters(filters);
    onFilter({
      hospital,
      dateFrom,
      dateTo,
      ...filters
    });
  };

  const handleBasicFilterChange = () => {
    onFilter({
      hospital,
      dateFrom,
      dateTo,
      ...appliedFilters
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-end gap-2 flex-1">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Hospital Name:</label>
            <Select value={hospital} onValueChange={(value) => {
              setHospital(value);
              handleBasicFilterChange();
            }}>
              <SelectTrigger className="w-full md:w-[160px] h-8 text-xs">
                <SelectValue placeholder="Select Hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abc_hospital">ABC Hospital</SelectItem>
                <SelectItem value="vincent_hospital">Vincent Hospital</SelectItem>
                <SelectItem value="region_1">Region 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Date Range:</label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                placeholder="From"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  handleBasicFilterChange();
                }}
                className="w-full md:w-[125px] h-8 text-xs"
              />
              <span className="text-gray-500 text-xs">to</span>
              <Input
                type="date"
                placeholder="To"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  handleBasicFilterChange();
                }}
                className="w-full md:w-[125px] h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterPanelOpen(true)}
            className="flex items-center gap-1 h-7 text-xs"
          >
            <Filter size={12} />
            More Filters
          </Button>
          <Button 
            size="sm"
            onClick={onExport}
            className="flex items-center gap-1 h-7 text-xs bg-blue-500 hover:bg-blue-600"
          >
            <Download size={12} />
            Download Excel
          </Button>
        </div>
      </div>

      <FilterPanel 
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleFilterApply}
      />
    </>
  );
};

export default HeaderFilters;
