
import React from 'react';
import { Switch } from "@/components/ui/switch";

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  featureId: string;
}

interface RulesConfigCardProps {
  rule: Rule;
  onToggle: (id: string) => void;
  onWeightChange: (id: string, weight: number) => void;
}

const RulesConfigCard: React.FC<RulesConfigCardProps> = ({
  rule,
  onToggle,
  onWeightChange,
}) => {
  return (
    <div className="border rounded-md p-3 grid grid-cols-12 items-center gap-2 hover:bg-gray-50">
      <div className="col-span-1 flex items-center justify-center">
        <Switch
          checked={rule.enabled}
          onCheckedChange={() => onToggle(rule.id)}
          className="data-[state=checked]:bg-orange-500"
        />
      </div>
      
      <div className="col-span-7 text-sm font-medium pl-1">
        {rule.name}
      </div>
      
      <div className="col-span-4">
        <input
          type="number"
          className="w-full rounded border border-gray-300 px-2 py-1 text-right text-sm"
          value={rule.weight}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            onWeightChange(rule.id, value);
          }}
          disabled={!rule.enabled}
          min="0"
          max="100"
        />
      </div>
    </div>
  );
};

export default RulesConfigCard;
