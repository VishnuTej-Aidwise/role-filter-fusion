import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth, UserRole } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import FeatureConfigCard from '../components/FeatureConfigCard';
import RulesConfigCard from '../components/RulesConfigCard';
import { Button } from '../components/ui/button';
import { ArrowLeft, ChevronDown, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '../components/ui/accordion';

interface RiskConfigurationParams {
  role: UserRole;
}

interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  category: string;
  subCategory: string;
  rules?: Rule[];
}

interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  featureId: string;
}

interface HistoryItem {
  name: string;
  weight: number;
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
      weight: 25,
      category: 'Clinical',
      subCategory: 'Claims Related'
    },
    { 
      id: 'entity-analytics', 
      name: 'Entity Analytics', 
      enabled: false, 
      weight: 0,
      category: 'Clinical',
      subCategory: 'Claims Related'
    },
    { 
      id: 'stamp-data-analytics', 
      name: 'Stamp Data Analytics', 
      enabled: true, 
      weight: 25,
      category: 'Clinical',
      subCategory: 'Policy Related'
    },
    { 
      id: 'class-mismatch', 
      name: 'Class Mismatch', 
      enabled: false, 
      weight: 0,
      category: 'Clinical',
      subCategory: 'Entity Related'
    },
    { 
      id: 'matchings', 
      name: 'Matchings', 
      enabled: false, 
      weight: 0,
      category: 'Non-Clinical',
      subCategory: 'Claims Related'
    },
    { 
      id: 'tampering-analytics', 
      name: 'Tampering Analytics', 
      enabled: true, 
      weight: 25,
      category: 'Non-Clinical',
      subCategory: 'Policy Related'
    },
    { 
      id: 'data-verification', 
      name: 'Data Verification', 
      enabled: true, 
      weight: 25,
      category: 'Non-Clinical',
      subCategory: 'Entity Related'
    }
  ]);

  const [selectedFeature, setSelectedFeature] = useState<string | null>('meta-data-analytics');
  const [rules, setRules] = useState<Rule[]>([
    { id: 'rule-1', name: 'Missing Creation Date', enabled: true, weight: 15, featureId: 'meta-data-analytics' },
    { id: 'rule-2', name: 'Missing Author', enabled: true, weight: 15, featureId: 'meta-data-analytics' },
    { id: 'rule-3', name: 'Missing Modification Date', enabled: true, weight: 15, featureId: 'meta-data-analytics' },
    { id: 'rule-4', name: 'Missing Title', enabled: true, weight: 15, featureId: 'meta-data-analytics' },
    { id: 'rule-5', name: 'Missing Creator', enabled: true, weight: 20, featureId: 'meta-data-analytics' },
    { id: 'rule-6', name: 'Missing Producer', enabled: true, weight: 20, featureId: 'meta-data-analytics' },
    
    { id: 'rule-7', name: 'Invalid Entity Type', enabled: true, weight: 25, featureId: 'entity-analytics' },
    { id: 'rule-8', name: 'Entity Format Error', enabled: true, weight: 25, featureId: 'entity-analytics' },
    { id: 'rule-9', name: 'Missing Entity ID', enabled: true, weight: 25, featureId: 'entity-analytics' },
    { id: 'rule-10', name: 'Invalid Entity Status', enabled: true, weight: 25, featureId: 'entity-analytics' },
    
    { id: 'rule-11', name: 'Invalid Stamp Format', enabled: true, weight: 20, featureId: 'stamp-data-analytics' },
    { id: 'rule-12', name: 'Missing Stamp Date', enabled: true, weight: 20, featureId: 'stamp-data-analytics' },
    { id: 'rule-13', name: 'Invalid Stamp Authority', enabled: true, weight: 20, featureId: 'stamp-data-analytics' },
    { id: 'rule-14', name: 'Expired Stamp', enabled: true, weight: 20, featureId: 'stamp-data-analytics' },
    { id: 'rule-15', name: 'Stamp Verification Failed', enabled: true, weight: 20, featureId: 'stamp-data-analytics' },
    
    { id: 'rule-16', name: 'Class Definition Error', enabled: true, weight: 33, featureId: 'class-mismatch' },
    { id: 'rule-17', name: 'Class Type Mismatch', enabled: true, weight: 33, featureId: 'class-mismatch' },
    { id: 'rule-18', name: 'Invalid Class Reference', enabled: true, weight: 34, featureId: 'class-mismatch' },
    
    { id: 'rule-19', name: 'Field Match Error', enabled: true, weight: 25, featureId: 'matchings' },
    { id: 'rule-20', name: 'Record Match Failed', enabled: true, weight: 25, featureId: 'matchings' },
    { id: 'rule-21', name: 'Entity Match Exception', enabled: true, weight: 25, featureId: 'matchings' },
    { id: 'rule-22', name: 'Match Timeout', enabled: true, weight: 25, featureId: 'matchings' },
    
    { id: 'rule-23', name: 'Document Alteration Detected', enabled: true, weight: 20, featureId: 'tampering-analytics' },
    { id: 'rule-24', name: 'Signature Tampering', enabled: true, weight: 20, featureId: 'tampering-analytics' },
    { id: 'rule-25', name: 'Data Inconsistency', enabled: true, weight: 20, featureId: 'tampering-analytics' },
    { id: 'rule-26', name: 'Metadata Tampering', enabled: true, weight: 20, featureId: 'tampering-analytics' },
    { id: 'rule-27', name: 'Historical Record Altered', enabled: true, weight: 20, featureId: 'tampering-analytics' },
    
    { id: 'rule-28', name: 'Format Validation Failed', enabled: true, weight: 25, featureId: 'data-verification' },
    { id: 'rule-29', name: 'Data Source Verification', enabled: true, weight: 25, featureId: 'data-verification' },
    { id: 'rule-30', name: 'Checksum Validation Failed', enabled: true, weight: 25, featureId: 'data-verification' },
    { id: 'rule-31', name: 'Cross-Reference Error', enabled: true, weight: 25, featureId: 'data-verification' }
  ]);

  // Mock history data
  const [historyItems] = useState<HistoryItem[]>([
    { name: 'Meta Data Analytics', weight: 25 },
    { name: 'Stamp Data Analytics', weight: 25 },
    { name: 'Tampering Analytics', weight: 25 },
    { name: 'Data Verification', weight: 25 }
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
        <div className="p-4 h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Link to={`/risk-management/${role}`} className="text-blue-600 hover:text-blue-700">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl font-semibold">Risk Configuration</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} className="flex items-center gap-1 text-sm py-1.5 px-3 h-auto">
                <Save size={14} />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-base font-medium mb-3">Configuration Features</h2>
              
              <div className="mb-3 grid grid-cols-2 gap-4">
                <div className="text-sm font-medium text-gray-700">Feature Name</div>
                <div className="text-sm font-medium text-gray-700 text-right">Weightage</div>
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
              
              <div className="mt-4 border-t border-gray-200 pt-3">
                <div className={`flex justify-between text-base font-medium ${featuresTotalClass}`}>
                  <span>Total Config Rules %</span>
                  <span>{featuresTotal}</span>
                </div>
                {featuresTotal !== 100 && (
                  <div className="text-red-500 text-xs mt-1">
                    Total Config Rules % must be 100
                  </div>
                )}
              </div>
            </div>

            {/* Rules Section */}
            {selectedFeature && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-base font-medium mb-3">
                  {features.find(f => f.id === selectedFeature)?.name} Rules
                </h2>
                
                <div className="mb-3 grid grid-cols-2 gap-4">
                  <div className="text-sm font-medium text-gray-700">Rule Name</div>
                  <div className="text-sm font-medium text-gray-700 text-right">Weightage</div>
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
                
                <div className="mt-4 border-t border-gray-200 pt-3">
                  <div className={`flex justify-between text-base font-medium ${rulesTotalClass}`}>
                    <span>Total Config Rules %</span>
                    <span>{rulesTotal}</span>
                  </div>
                  {rulesTotal !== 100 && (
                    <div className="text-red-500 text-xs mt-1">
                      Total Config Rules % must be 100
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pt-0 pb-2">
                  <CardTitle className="text-base font-medium">History</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="default-history" className="border-b-0">
                      <AccordionTrigger className="py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 font-medium text-sm">
                        Default
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 mt-2">
                          {historyItems.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-md p-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                <span className="text-sm">{item.weight}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskConfiguration;
