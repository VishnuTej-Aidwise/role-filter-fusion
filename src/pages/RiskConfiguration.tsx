
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth, UserRole } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import FeatureConfigCard from '../components/FeatureConfigCard';
import RulesConfigCard from '../components/RulesConfigCard';
import { Button } from '../components/ui/button';
import { Save } from 'lucide-react';

interface RiskConfigurationParams {
  role: UserRole;
}

interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  rules?: Rule[];
}

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  featureId: string;
}

const RiskConfiguration: React.FC = () => {
  const { role } = useParams<{ role: string }>() as { role: UserRole };
  const { user, isAuthenticated } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([
    { 
      id: 'meta-data-analytics', 
      name: 'Meta Data Analytics', 
      enabled: true, 
      weight: 25 
    },
    { 
      id: 'entity-analytics', 
      name: 'Entity Analytics', 
      enabled: false, 
      weight: 0 
    },
    { 
      id: 'stamp-data-analytics', 
      name: 'Stamp Data Analytics', 
      enabled: true, 
      weight: 25 
    },
    { 
      id: 'class-mismatch', 
      name: 'Class Mismatch', 
      enabled: false, 
      weight: 1 
    },
    { 
      id: 'matchings', 
      name: 'Matchings', 
      enabled: false, 
      weight: 1 
    },
    { 
      id: 'tampering-analytics', 
      name: 'Tampering Analytics', 
      enabled: true, 
      weight: 25 
    }
  ]);

  const [selectedFeature, setSelectedFeature] = useState<string | null>('meta-data-analytics');
  const [rules, setRules] = useState<Rule[]>([
    { id: 'rule-1', name: 'Missing Creation Date', enabled: true, weight: 5, featureId: 'meta-data-analytics' },
    { id: 'rule-2', name: 'Missing Author', enabled: true, weight: 5, featureId: 'meta-data-analytics' },
    { id: 'rule-3', name: 'Missing Modification Date', enabled: true, weight: 5, featureId: 'meta-data-analytics' },
    { id: 'rule-4', name: 'Missing Title', enabled: true, weight: 5, featureId: 'meta-data-analytics' },
    { id: 'rule-5', name: 'Missing Creator', enabled: true, weight: 5, featureId: 'meta-data-analytics' },
    { id: 'rule-6', name: 'Missing Producer', enabled: true, weight: 5, featureId: 'meta-data-analytics' }
  ]);

  // Listen for sidebar expansion/collapse
  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('[class*="w-64"]');
      setSidebarExpanded(!!sidebar);
    };
    
    const observer = new MutationObserver(handleSidebarChange);
    const sidebarElement = document.querySelector('div[class*="flex flex-col h-screen fixed"]');
    
    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => observer.disconnect();
  }, []);

  // Calculate total configuration percentages
  const featuresTotal = features.reduce((sum, feature) => sum + feature.weight, 0);
  const selectedFeatureRules = rules.filter(rule => rule.featureId === selectedFeature);
  const rulesTotal = selectedFeatureRules.reduce((sum, rule) => sum + rule.weight, 0);

  const featuresTotalClass = featuresTotal === 100 ? "text-blue-600" : "text-red-600";
  const rulesTotalClass = rulesTotal === 100 ? "text-blue-600" : "text-red-600";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Make sure user can only access their role's dashboard
  if (user?.role !== role) {
    toast.error(`You don't have permission to access the ${role} dashboard`);
    return <Navigate to={`/dashboard/${user?.role}`} />;
  }

  // Handle feature toggle
  const handleFeatureToggle = (id: string) => {
    setFeatures(features.map(feature =>
      feature.id === id ? { ...feature, enabled: !feature.enabled, weight: !feature.enabled ? 25 : 0 } : feature
    ));
  };

  // Handle feature weight change
  const handleFeatureWeightChange = (id: string, weight: number) => {
    setFeatures(features.map(feature =>
      feature.id === id ? { ...feature, weight } : feature
    ));
  };

  // Handle rule toggle
  const handleRuleToggle = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled, weight: !rule.enabled ? 5 : 0 } : rule
    ));
  };

  // Handle rule weight change
  const handleRuleWeightChange = (id: string, weight: number) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, weight } : rule
    ));
  };

  // Handle feature selection to display its rules
  const handleFeatureSelect = (id: string) => {
    setSelectedFeature(id);
  };

  // Handle save
  const handleSave = () => {
    if (featuresTotal !== 100) {
      toast.error("Total configuration rules % for features must be 100!");
      return;
    }
    
    if (rulesTotal !== 100) {
      toast.error("Total configuration rules % for selected feature's rules must be 100!");
      return;
    }
    
    toast.success("Configuration saved successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-[50px]'}`}>
        <div className="p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Risk Configuration</h1>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save size={16} />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Configuration Features</h2>
              
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="font-medium text-gray-700">Feature Name</div>
                <div className="font-medium text-gray-700 text-right">Weightage</div>
              </div>
              
              <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                {features.map((feature) => (
                  <FeatureConfigCard
                    key={feature.id}
                    feature={feature}
                    onToggle={handleFeatureToggle}
                    onWeightChange={handleFeatureWeightChange}
                    onSelect={handleFeatureSelect}
                    isSelected={selectedFeature === feature.id}
                  />
                ))}
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className={`flex justify-between text-lg font-medium ${featuresTotalClass}`}>
                  <span>Total Config Rules %</span>
                  <span>{featuresTotal}</span>
                </div>
                {featuresTotal !== 100 && (
                  <div className="text-red-500 text-sm mt-1">
                    Total Config Rules % must be 100
                  </div>
                )}
              </div>
            </div>

            {/* Rules Section */}
            {selectedFeature && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-4">
                  {features.find(f => f.id === selectedFeature)?.name} Rules
                </h2>
                
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="font-medium text-gray-700">Rule Name</div>
                  <div className="font-medium text-gray-700 text-right">Weightage</div>
                </div>
                
                <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                  {selectedFeatureRules.map((rule) => (
                    <RulesConfigCard
                      key={rule.id}
                      rule={rule}
                      onToggle={handleRuleToggle}
                      onWeightChange={handleRuleWeightChange}
                    />
                  ))}
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className={`flex justify-between text-lg font-medium ${rulesTotalClass}`}>
                    <span>Total Config Rules %</span>
                    <span>{rulesTotal}</span>
                  </div>
                  {rulesTotal !== 100 && (
                    <div className="text-red-500 text-sm mt-1">
                      Total Config Rules % must be 100
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskConfiguration;
