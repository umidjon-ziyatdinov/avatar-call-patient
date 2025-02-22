import { ArrowLeft, Plus } from "lucide-react";
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { PatientEditDialog } from "./PatientsEditDialog";
import { AvatarForm } from "@/components/AvatarEditForm";
import { Button } from "@/components/ui/button";
import { Avatar, User } from "@/lib/db/schema";
import AvatarList from "./AvatarList";
import QuickActions from "./QuickActions";
import { useState } from "react";
import CallHistoryScreen from "./CallHistoryScreen";

const AdminScreen = () => {
  const { data: patient, isLoading: patientLoading, mutate: refetchPatient } = useSWR<User>(`/api/patient`, fetcher);
  const { data: avatars, isLoading, mutate: refetchAvatars } = useSWR<Avatar[]>(`/api/avatar?isAdmin=true`, fetcher);
  const [openPatientDialog, setOpenDialog] = useState<boolean>(false);
  const [openCallDialog, setOpenCallDialog] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [openAvatarDialog, setOpenAvatarDialog] = useState<boolean>(false);

  const handleCloseAvatarDialog = () => {
    setSelectedAvatar(null);
    setOpenAvatarDialog(false);
    refetchAvatars();
  };
  

  return (
    <div className="flex flex-col gap-6 pb-[100px] h-full">
      <div className="max-w-4xl h-full w-full flex flex-col gap-6">
        <QuickActions
          onEditPatient={() => setOpenDialog(true)}
          onOpenCallDialog={() => {
            console.log('i  am ruunning')
            setOpenCallDialog(true)}}
          patientName={patient?.name}
        />
        
        <AvatarList
          avatars={avatars || []}
          onSelectAvatar={setSelectedAvatar}
        />
      </div>

<CallHistoryScreen  open ={ openCallDialog} setOpen={setOpenCallDialog}/>
      {/* Avatar Edit Dialog */}
      <Dialog 
        open={selectedAvatar !== null} 
        onOpenChange={(open) => !open && handleCloseAvatarDialog()}
      >
        <DialogContent className="h-svh w-full max-w-full sm:max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-0">
           <div className="sticky w-full max-w-full top-[-1px] bg-background z-10 shadow-md p-4 flex items-center border-b-1 justify-between">
             <Button 
             variant="ghost"
               onClick={() => { setSelectedAvatar(null); refetchAvatars(); }} 
               className="text-sm font-medium hover:underline"
             >
         <ArrowLeft className="size-4 mr-2" />
         Go Back
             </Button>
             <DialogTitle className="text-md  font-semibold">
               Edit {selectedAvatar?.name}&apos;s background
             </DialogTitle>
           </div>
          {selectedAvatar && (
            <AvatarForm 
              avatar={selectedAvatar}
              onClose={handleCloseAvatarDialog}
              setAvatar={(value: Avatar) => setSelectedAvatar(value)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New Avatar Dialog */}
      <Dialog 
        open={openAvatarDialog} 
        onOpenChange={(open) => {if(!open) handleCloseAvatarDialog()}}
      >
        <DialogTrigger asChild>
          <Button
          onClick={() => setOpenAvatarDialog(true)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 shadow-lg flex items-center gap-2 px-8"
            size="lg"
          >
            <Plus className="size-5" />
            New Avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="h-svh sm:max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-0">
        <div className="sticky top-[-1px] bg-background z-10 shadow-md p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setOpenAvatarDialog(false);
              refetchAvatars();
            }}
            className="text-sm font-medium hover:underline"
          >
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
          <DialogTitle className="text-lg font-semibold">
            Create Avatar
          </DialogTitle>
        </div>
          <AvatarForm onClose={handleCloseAvatarDialog} />
        </DialogContent>
      </Dialog>

      {/* Patient Edit Dialog */}
      {openPatientDialog && patient && (
        <PatientEditDialog
          patient={patient}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  );
};

export default AdminScreen;