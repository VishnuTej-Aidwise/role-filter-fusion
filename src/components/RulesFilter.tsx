
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
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium mb-1">Status</label>
        <Select onValueChange={(value) => handleChange('status', value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium mb-1">Category</label>
        <Select onValueChange={(value) => handleChange('category', value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.category.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium mb-1">Sub Category</label>
        <Select onValueChange={(value) => handleChange('subCategory', value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Sub Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.subCategory.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs font-medium mb-1">Trigger</label>
        <Select onValueChange={(value) => handleChange('trigger', value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.trigger.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleFilter} size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3 w-3" /> Search
        </Button>
        <Button onClick={handleReset} variant="secondary" size="sm" className="h-8 text-xs">
          <RotateCcw className="mr-1 h-3 w-3" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default RulesFilter;
