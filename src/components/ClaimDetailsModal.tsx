
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, MessageSquare, Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
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
      setOpenCombobox(false);
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
        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-auto p-0">
          <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10">
            <DialogTitle className="text-xl font-bold text-center">Claim Details and Fraud Findings</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row">
            {/* Left side - Document viewer placeholder - Made smaller */}
            <div className="w-full md:w-2/5 p-6 bg-gray-100 min-h-[500px] flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <p className="font-medium text-lg">Document Viewer</p>
                <p className="text-sm">Yet to be implemented</p>
              </div>
            </div>
            
            {/* Right side - Fraud findings - Made larger */}
            <div className="w-full md:w-3/5 p-8 bg-white">
              <h3 className="text-lg font-bold mb-6">Fraud Findings</h3>
              
              <div className="border rounded-lg overflow-hidden shadow-sm">
                {/* Table header */}
                <div className="grid grid-cols-12 bg-blue-900 text-white py-4 px-6">
                  <div className="col-span-4 font-medium text-left">Finding</div>
                  <div className="col-span-5 font-medium text-center">Action</div>
                  <div className="col-span-3 font-medium text-center">Remarks</div>
                </div>
                
                {/* Table rows */}
                <div className="max-h-[350px] overflow-y-auto">
                  {findings.map((finding) => (
                    <div 
                      key={finding.id} 
                      className="grid grid-cols-12 border-t py-5 px-6 hover:bg-gray-50 items-center"
                    >
                      <div className="col-span-4 flex items-center font-medium text-gray-700 text-left pr-2">
                        {finding.description}
                      </div>
                      <div className="col-span-5 flex items-center justify-center gap-3">
                        <Button 
                          size="sm"
                          variant={finding.status === 'accepted' ? 'success' : 'outline'}
                          className={`px-3 py-1 h-9 text-sm rounded-md shadow-sm ${
                            finding.status === 'accepted' ? 'bg-green-500 text-white' : ''
                          }`}
                          onClick={() => updateFindingStatus(finding.id, 'accepted')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm"
                          variant={finding.status === 'declined' ? 'destructive' : 'outline'}
                          className={`px-3 py-1 h-9 text-sm rounded-md shadow-sm ${
                            finding.status === 'declined' ? 'bg-red-500 text-white' : ''
                          }`}
                          onClick={() => updateFindingStatus(finding.id, 'declined')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <Button 
                          size="sm"
                          variant="default"
                          className="h-8 px-3 py-1 text-xs rounded-md shadow-sm bg-blue-500"
                          onClick={() => openRemarksSheet(finding.id)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {finding.remarks ? "Edit" : "Add"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* New finding input row with improved search */}
                <div className="grid grid-cols-12 border-t py-5 px-6 bg-gray-50 items-center">
                  <div className="col-span-9">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="w-full justify-between bg-white border-gray-300 text-gray-700 font-normal h-11"
                          onClick={() => setOpenCombobox(true)}
                        >
                          {selectedFinding || "Enter New Finding..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start" side="bottom" sideOffset={5}>
                        <Command>
                          <CommandInput placeholder="Search findings..." className="h-10" />
                          <CommandEmpty>No finding found.</CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {availableFindings.filter(finding => !selectedFinding || 
                              finding.toLowerCase().includes(selectedFinding.toLowerCase())).map((finding) => (
                              <CommandItem
                                key={finding}
                                value={finding}
                                onSelect={(currentValue) => {
                                  setSelectedFinding(currentValue);
                                  setOpenCombobox(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    selectedFinding === finding ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                {finding}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="col-span-3 flex items-center justify-center pl-3">
                    <Button 
                      size="sm"
                      variant="default"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 shadow-sm font-medium w-full h-10"
                      onClick={handleAddFinding}
                      disabled={!selectedFinding}
                    >
                      Add Finding
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Footer button */}
              <div className="flex justify-end mt-8">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-2 h-10"
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
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Remarks</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Textarea 
              placeholder="Enter your remarks here..."
              className="min-h-[200px] resize-none"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsRemarksOpen(false)}>Cancel</Button>
            <Button onClick={saveRemarks} className="ml-2">Save Remarks</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Alert Dialog for Remarks */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Remarks</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea 
                placeholder="Enter your remarks here..."
                className="min-h-[150px] mt-2 resize-none"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveRemarks}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClaimDetailsModal;
