
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, MessageSquare } from 'lucide-react';

interface Finding {
  id: string;
  description: string;
  status?: 'accepted' | 'declined' | 'pending';
  remarks?: string;
}

export interface ClaimDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimData: any;
}

const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({
  isOpen,
  onClose,
  claimData
}) => {
  const [findings, setFindings] = useState<Finding[]>([
    { id: '1', description: 'Duplicate Claim Detected', status: 'pending' },
    { id: '2', description: 'Billing Error', status: 'pending' }
  ]);
  const [newFinding, setNewFinding] = useState('');

  const handleAddFinding = () => {
    if (newFinding.trim()) {
      setFindings([
        ...findings,
        { 
          id: Date.now().toString(),
          description: newFinding,
          status: 'pending'
        }
      ]);
      setNewFinding('');
    }
  };

  const updateFindingStatus = (id: string, status: 'accepted' | 'declined') => {
    setFindings(findings.map(finding => 
      finding.id === id ? { ...finding, status } : finding
    ));
  };

  const addRemarks = (id: string) => {
    // This would show a remarks input dialog in a real application
    console.log(`Adding remarks to finding ${id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-auto p-0">
        <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold">Claim Details and Fraud Findings</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row">
          {/* Left side - Document viewer placeholder */}
          <div className="w-full md:w-1/2 p-6 bg-gray-200 min-h-[500px] flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <p className="font-medium text-lg">Document Viewer</p>
              <p className="text-sm">Yet to be implemented</p>
            </div>
          </div>
          
          {/* Right side - Fraud findings */}
          <div className="w-full md:w-1/2 p-6">
            <h3 className="text-lg font-bold mb-4">Fraud Findings</h3>
            
            <div className="border rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-blue-900 text-white p-2">
                <div className="col-span-1 font-medium">Finding</div>
                <div className="col-span-1 font-medium text-center">Action</div>
                <div className="col-span-1 font-medium text-center">Remarks</div>
              </div>
              
              {/* Table rows */}
              {findings.map((finding) => (
                <div key={finding.id} className="grid grid-cols-3 border-t p-2">
                  <div className="col-span-1">{finding.description}</div>
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    <Button 
                      size="sm"
                      variant={finding.status === 'accepted' ? 'success' : 'outline'}
                      className="px-3 py-1 h-8"
                      onClick={() => updateFindingStatus(finding.id, 'accepted')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm"
                      variant={finding.status === 'declined' ? 'destructive' : 'outline'}
                      className="px-3 py-1 h-8"
                      onClick={() => updateFindingStatus(finding.id, 'declined')}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button 
                      size="sm"
                      variant="default"
                      className="px-3 py-1 h-8 bg-blue-500 hover:bg-blue-600"
                      onClick={() => addRemarks(finding.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Add Remarks
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* New finding input row */}
              <div className="grid grid-cols-3 border-t p-2">
                <div className="col-span-1">
                  <Input 
                    placeholder="Enter New Finding" 
                    value={newFinding}
                    onChange={(e) => setNewFinding(e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="px-3 py-1 h-8"
                    disabled={!newFinding.trim()}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="px-3 py-1 h-8"
                    disabled={!newFinding.trim()}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button 
                    size="sm"
                    variant="default"
                    className="px-3 py-1 h-8 bg-blue-500 hover:bg-blue-600"
                    disabled={!newFinding.trim()}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add Remarks
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Footer buttons */}
            <div className="flex justify-between mt-4">
              <Button 
                size="sm"
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-100"
                onClick={handleAddFinding}
                disabled={!newFinding.trim()}
              >
                Add Finding
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimDetailsModal;
