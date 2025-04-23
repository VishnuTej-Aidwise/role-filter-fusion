
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
    category: '',
    subCategory: '',
    trigger: '',
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
      category: '',
      subCategory: '',
      trigger: '',
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
            <SelectItem value="Review">Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <Select onValueChange={(value) => handleChange('category', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.category.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Sub Category</label>
        <Select onValueChange={(value) => handleChange('subCategory', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Sub Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.subCategory.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Trigger</label>
        <Select onValueChange={(value) => handleChange('trigger', value)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select Trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.trigger.map(cat => (
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
