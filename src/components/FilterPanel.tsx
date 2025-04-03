
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    provider: '',
    pathologist: '',
    pharmacy: '',
    doctor: '',
    trigger: ''
  });
  
  const [selectedFilters, setSelectedFilters] = useState<Array<{key: string, value: string, label: string}>>([]);

  const filterOptions = {
    provider: [
      { value: 'provider1', label: 'Provider 1' },
      { value: 'provider2', label: 'Provider 2' },
      { value: 'provider3', label: 'Provider 3' },
    ],
    pathologist: [
      { value: 'path1', label: 'Pathologist 1' },
      { value: 'path2', label: 'Pathologist 2' },
      { value: 'path3', label: 'Pathologist 3' },
    ],
    pharmacy: [
      { value: 'pharm1', label: 'Pharmacy 1' },
      { value: 'pharm2', label: 'Pharmacy 2' },
      { value: 'pharm3', label: 'Pharmacy 3' },
    ],
    doctor: [
      { value: 'doctor1', label: 'Doctor 1' },
      { value: 'doctor2', label: 'Doctor 2' },
      { value: 'doctor3', label: 'Doctor 3' },
    ],
    trigger: [
      { value: 'ai', label: 'AI' },
      { value: 'manual', label: 'Manual' },
    ],
  };

  const handleFilterChange = (name: string, value: string) => {
    if (value) {
      const option = filterOptions[name as keyof typeof filterOptions].find(opt => opt.value === value);
      if (option) {
        // Add to selected filters if not already there
        if (!selectedFilters.some(f => f.key === name && f.value === value)) {
          setSelectedFilters([...selectedFilters, {
            key: name,
            value: value,
            label: option.label
          }]);
        }
      }
    }

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveFilter = (key: string, value: string) => {
    setSelectedFilters(selectedFilters.filter(f => !(f.key === key && f.value === value)));
    
    // If we're removing the current value, reset it in the filters state
    if (filters[key as keyof typeof filters] === value) {
      setFilters(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const handleClearAll = () => {
    setFilters({
      provider: '',
      pathologist: '',
      pharmacy: '',
      doctor: '',
      trigger: ''
    });
    setSelectedFilters([]);
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-auto animate-fade-in glass-effect">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {selectedFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Selected Filters</span>
              <button 
                onClick={handleClearAll}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                CLEAR ALL
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter, index) => (
                <div 
                  key={index}
                  className="bg-gray-200 rounded-md py-1 px-3 flex items-center gap-1.5 text-sm"
                >
                  <span>{filter.label}</span>
                  <button 
                    onClick={() => handleRemoveFilter(filter.key, filter.value)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
                {filterOptions.provider.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
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
                {filterOptions.pathologist.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
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
                {filterOptions.pharmacy.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
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
                {filterOptions.doctor.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
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
                {filterOptions.trigger.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <Button onClick={handleApplyFilters}>
            Apply now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
