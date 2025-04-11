
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, MessageSquare, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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

// Mock available findings that would come from the backend
const availableFindings = [
  "Duplicate Claim Detected",
  "Billing Error",
  "Gender And Diagnosis Mismatch",
  "Patient admitted early morning",
  "Reimbursement claims from Network Hospitals",
  "Claim in last month of policy expiration",
  "Large claim amount",
  "Patient travel more than 50 Km",
  "Claim during year end",
  "Claim during month end"
];

const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({
  isOpen,
  onClose,
  claimData
}) => {
  const [findings, setFindings] = useState<Finding[]>([
    { id: '1', description: 'Duplicate Claim Detected', status: 'pending' },
    { id: '2', description: 'Billing Error', status: 'pending' }
  ]);
  const [selectedFinding, setSelectedFinding] = useState("");
  const [isRemarksOpen, setIsRemarksOpen] = useState(false);
  const [activeFindingId, setActiveFindingId] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState("");
  const { toast } = useToast();

  const handleAddFinding = () => {
    if (selectedFinding) {
      setFindings([
        ...findings,
        { 
          id: Date.now().toString(),
          description: selectedFinding,
          status: 'pending'
        }
      ]);
      setSelectedFinding("");
      toast({
        title: "Finding Added",
        description: "New finding has been added successfully",
      });
    }
  };

  const updateFindingStatus = (id: string, status: 'accepted' | 'declined') => {
    setFindings(findings.map(finding => 
      finding.id === id ? { ...finding, status } : finding
    ));
    toast({
      title: `Finding ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
      description: `The finding has been ${status}`,
      variant: status === 'accepted' ? 'default' : 'destructive',
    });
  };

  const openRemarksSheet = (id: string) => {
    setActiveFindingId(id);
    const finding = findings.find(f => f.id === id);
    setRemarkText(finding?.remarks || "");
    setIsRemarksOpen(true);
  };

  const saveRemarks = () => {
    if (activeFindingId) {
      setFindings(findings.map(finding => 
        finding.id === activeFindingId ? { ...finding, remarks: remarkText } : finding
      ));
      setIsRemarksOpen(false);
      setActiveFindingId(null);
      toast({
        title: "Remarks Saved",
        description: "Your remarks have been saved successfully",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-auto p-0">
          <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10">
            <DialogTitle className="text-xl font-bold">Claim Details and Fraud Findings</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row">
            {/* Left side - Document viewer placeholder */}
            <div className="w-full md:w-1/2 p-6 bg-gray-100 min-h-[500px] flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <p className="font-medium text-lg">Document Viewer</p>
                <p className="text-sm">Yet to be implemented</p>
              </div>
            </div>
            
            {/* Right side - Fraud findings */}
            <div className="w-full md:w-1/2 p-6 bg-white">
              <h3 className="text-lg font-bold mb-4">Fraud Findings</h3>
              
              <div className="border rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-3 bg-blue-900 text-white p-3">
                  <div className="col-span-1 font-medium">Finding</div>
                  <div className="col-span-1 font-medium text-center">Action</div>
                  <div className="col-span-1 font-medium text-center">Remarks</div>
                </div>
                
                {/* Table rows */}
                <div className="max-h-[400px] overflow-y-auto">
                  {findings.map((finding) => (
                    <div key={finding.id} className="grid grid-cols-3 border-t p-3 hover:bg-gray-50">
                      <div className="col-span-1 flex items-center">{finding.description}</div>
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
                          className="px-3 py-1 h-8"
                          onClick={() => openRemarksSheet(finding.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {finding.remarks ? "Edit Remarks" : "Add Remarks"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* New finding dropdown row */}
                <div className="grid grid-cols-3 border-t p-3 bg-gray-50">
                  <div className="col-span-1">
                    <Select value={selectedFinding} onValueChange={setSelectedFinding}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select finding..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {availableFindings.map((finding) => (
                          <SelectItem key={finding} value={finding}>
                            {finding}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex items-center ml-4">
                    <Button 
                      size="sm"
                      variant="default"
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={handleAddFinding}
                      disabled={!selectedFinding}
                    >
                      Add Finding
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Footer button */}
              <div className="flex justify-end mt-4">
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

      {/* Remarks Sheet */}
      <Sheet open={isRemarksOpen} onOpenChange={setIsRemarksOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Remarks</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Textarea 
              placeholder="Enter your remarks here..."
              className="min-h-[200px]"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />
          </div>
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRemarksOpen(false)}>Cancel</Button>
            <Button onClick={saveRemarks}>Save Remarks</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ClaimDetailsModal;
