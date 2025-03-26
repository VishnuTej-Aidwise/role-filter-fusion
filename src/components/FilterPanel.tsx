
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    provider: '',
    pathologist: '',
    pharmacy: '',
    doctor: '',
    trigger: ''
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearAll = () => {
    setFilters({
      provider: '',
      pathologist: '',
      pharmacy: '',
      doctor: '',
      trigger: ''
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-auto animate-fade-in glass-effect">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Provider:</label>
            <Select
              value={filters.provider}
              onValueChange={(value) => handleFilterChange('provider', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="provider1">Provider 1</SelectItem>
                <SelectItem value="provider2">Provider 2</SelectItem>
                <SelectItem value="provider3">Provider 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pathologist:</label>
            <Select
              value={filters.pathologist}
              onValueChange={(value) => handleFilterChange('pathologist', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Pathologist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="path1">Pathologist 1</SelectItem>
                <SelectItem value="path2">Pathologist 2</SelectItem>
                <SelectItem value="path3">Pathologist 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pharmacy:</label>
            <Select
              value={filters.pharmacy}
              onValueChange={(value) => handleFilterChange('pharmacy', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Pharmacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharm1">Pharmacy 1</SelectItem>
                <SelectItem value="pharm2">Pharmacy 2</SelectItem>
                <SelectItem value="pharm3">Pharmacy 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Doctor:</label>
            <Select
              value={filters.doctor}
              onValueChange={(value) => handleFilterChange('doctor', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor1">Doctor 1</SelectItem>
                <SelectItem value="doctor2">Doctor 2</SelectItem>
                <SelectItem value="doctor3">Doctor 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">AI/Manual Trigger:</label>
            <Select
              value={filters.trigger}
              onValueChange={(value) => handleFilterChange('trigger', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Trigger Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleClearAll}>
            Clear all
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
