
import React, { useState } from 'react';
import { categories } from '../utils/mockRiskData';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from 'lucide-react';

interface RulesFilterProps {
  onFilter: (filters: any) => void;
}

const RulesFilter: React.FC<RulesFilterProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    status: '',
    category1: '',
    category2: '',
    category3: '',
  });

  const handleChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      category1: '',
      category2: '',
      category3: '',
    });
    onFilter({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <Select onValueChange={(value) => handleChange('status', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category 1</label>
        <Select onValueChange={(value) => handleChange('category1', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Category 1" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.category1.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category 2</label>
        <Select onValueChange={(value) => handleChange('category2', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Category 2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.category2.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category 3</label>
        <Select onValueChange={(value) => handleChange('category3', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Category 3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.category3.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-4 flex justify-end space-x-3">
        <Button onClick={handleFilter} className="bg-blue-500 hover:bg-blue-600">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        <Button onClick={handleReset} variant="secondary">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default RulesFilter;
