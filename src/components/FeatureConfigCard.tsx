
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
}

interface FeatureConfigCardProps {
  feature: Feature;
  onToggle: (id: string) => void;
  onWeightChange: (id: string, weight: number) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const FeatureConfigCard: React.FC<FeatureConfigCardProps> = ({
  feature,
  onToggle,
  onWeightChange,
  onSelect,
  isSelected
}) => {
  return (
    <div 
      className={`border rounded-md p-3 grid grid-cols-12 items-center gap-4 cursor-pointer transition-all
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
      onClick={() => onSelect(feature.id)}
    >
      <div className="col-span-1">
        <Switch
          checked={feature.enabled}
          onCheckedChange={() => onToggle(feature.id)}
          className={`data-[state=checked]:bg-orange-500`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div className="col-span-7 font-medium">
        {feature.name}
      </div>
      
      <div className="col-span-3">
        <input
          type="number"
          className="w-full rounded border-gray-300 px-3 py-1 text-right"
          value={feature.weight}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            onWeightChange(feature.id, value);
          }}
          disabled={!feature.enabled}
          min="0"
          max="100"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div className="col-span-1 flex justify-center">
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default FeatureConfigCard;
