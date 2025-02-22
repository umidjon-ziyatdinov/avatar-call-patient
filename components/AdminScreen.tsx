
"use client";
import React, { useRef, useState } from 'react';
import { Plus, UserCog, Users, Clock, ArrowLeft } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useSWR from 'swr';
import { Avatar, User } from '@/lib/db/schema';
import { fetcher } from '@/lib/utils';
import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { SubmitButton } from './submit-button';
import Image from 'next/image';
import { AvatarForm } from './AvatarEditForm';

interface PatientDetails {
  about?: string;
  age?: string;
  sex?: string;
  dateOfBirth?: string;
  location?: string;
  education?: string;
  work?: string;
  fallRisk?: string;
  likes?: string;
  dislikes?: string;
  symptoms?: string;
  [key: `prompt${number}`]: string;
}

interface AvatarSettings {
  id: string;
  name: string;
  role: string;
  avatar: string;
  openai_voice: string;
  openai_model: string;
  simli_faceid: string;
  initialPrompt: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

const PatientEditDialog = ({ patient, onClose }: { patient: User; onClose: () => void }) => {
  const [imagePreview, setImagePreview] = useState(patient.profilePicture);
  const [isPending, setIsPending] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const promptOptions = [
    { value: 'family', label: 'Family Conversation' },
    { value: 'hobbies', label: 'Hobbies & Interests' },
    { value: 'music', label: 'Music & Entertainment' },
    { value: 'daily', label: 'Daily Activities' },
    { value: 'memories', label: 'Past Memories' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
  
    try {
      formData.append('id', patient.id);
  
      // Only append profilePicture if a new image is uploaded
      if (newImageFile) {
        formData.append('profilePicture', newImageFile);
      }
  
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save patient data');
      }
  
      // Show success toast
      toast.success('Patient Information Updated', {
        description: `${patient.name}'s details have been successfully updated.`,
        duration: 3000,
      });
  
      onClose();
    } catch (error) {
      // Show error toast
      toast.error('Update Failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 3000,
      });
      console.error('Error saving patient data:', error);
    } finally {
      setIsPending(false);
    }
  }
  
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="sticky top-0 z-50 flex items-center h-16 px-6 border-b bg-background">
        <Button variant="ghost" size="sm" onClick={onClose} className="mr-4">
          <ArrowLeft className="size-4 mr-2" />
          Go Back
        </Button>
        <h2 className="text-lg font-semibold">Edit Patient Information</h2>
      </div>

      <div className="max-w-4xl py-6">
        <Card className="bg-card border-0">
          <CardContent className="p-6">
            <Form action={handleSubmit} className="flex flex-col space-y-6 w-full">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Patient" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground">No Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Patient Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={patient.name}
                      className="text-2xl font-bold"
                    />
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Label htmlFor="about">About / Fun Fact</Label>
                    <Textarea
                      id="about"
                      name="about"
                      defaultValue={patient.patientDetails?.about}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'age', label: 'Age' },
                  { id: 'sex', label: 'Sex' },
                  { id: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                  { id: 'location', label: 'Location' },
                  { id: 'education', label: 'Education' },
                  { id: 'work', label: 'Work' }
                ].map(field => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type || 'text'}
                      // @ts-ignore
                      defaultValue={patient.patientDetails?.[field.id]}
                    />
                  </div>
                ))}
              </div>

              {/* Fall Risk */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fallRisk">Fall Risk</Label>
                <Select name="fallRisk" defaultValue={patient.patientDetails?.fallRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fall risk status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompts */}
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col gap-2">
                  <Label htmlFor={`prompt${num}`}>Prompt {num}</Label>
                  <Select 
                    name={`prompt${num}`} 
                    // @ts-ignore
                    defaultValue={patient.patientDetails?.[`prompt${num}`]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select prompt ${num}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {promptOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Preferences and Medical */}
              {[
                { id: 'likes', label: 'Likes' },
                { id: 'dislikes', label: 'Dislikes / Triggers' },
                { id: 'symptoms', label: 'Symptoms / Pain / Complaints' }
              ].map(field => (
                <div key={field.id} className="flex flex-col gap-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Textarea
                    id={field.id}
                    name={field.id}
                    // @ts-ignore
                    defaultValue={patient.patientDetails?.[field.id]}
                    rows={2}
                  />
                </div>
              ))}

              {/* Submit Button */}
              <SubmitButton 
            
                loadingText="Saving" 
                className="w-full" 
                isLoading={isPending}
              >
                Save Patient Information
              </SubmitButton>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminScreen = () => {
  const { data: patient, isLoading:patientLoading, mutate: refetchPatient } = useSWR<User>(`/api/patient`, fetcher);
  const { data: avatars, isLoading, mutate: refetchAvatars } = useSWR<Avatar[] | []>(`/api/avatar?isAdmin=true`, fetcher);
  const [openPatientDialog, setOpenDialog] = useState<Boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [openAvatarDialog, setOpenAvatarDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);


  return (
    <>

      
      <div className="flex flex-col gap-6 pb-[100px]  h-full">
        <div className=" max-w-4xl h-full w-full flex flex-col gap-6">
          {/* Quick Actions Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setOpenDialog(true)}>
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-24">
                <Users className="size-5 text-primary" />
                <p className="text-sm font-medium">Manage {patient?.name}&apos;s Detail</p>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-24">
                <Clock className="size-5 text-primary" />
                <p className="text-sm font-medium">Call Logs</p>
              </CardContent>
            </Card>
          </div>

          {/* Avatar List Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Avatars</h3>
              <span className="text-sm text-muted-foreground">
                {avatars?.length} total
              </span>
            </div>

            <div className="grid gap-3 ">
              {avatars?.map((avatar) => (
                <Card 
                onClick={() => setSelectedAvatar(avatar)}
                  key={avatar.id} 
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-1 gap-4  items-center">
                    <Image
              src={avatar.avatarImage || '/default-avatar.png'}
              alt={avatar.name}
          width={48}
          height={48}
              className="rounded-full object-cover min-w-[48px] min-h-[48px]"
            />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-medium text-base sm:text-lg truncate">{avatar.name}</h3>
                            <p className="text-sm text-muted-foreground">{avatar.role}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="shrink-0">
                            <UserCog className="size-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <p className="truncate">
                            <span className="text-muted-foreground">Voice:</span> {avatar.openaiVoice}
                          </p>
                          
                          <p className="truncate">
                            <span className="text-muted-foreground">Face ID:</span> {avatar.simliFaceId}
                          </p>
                          {/* {avatar.lastMessageTime && (
                            <p className="truncate text-muted-foreground">
                              Last active: {avatar.lastMessageTime}
                            </p>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
    {/* Sticky New Avatar Button */}
    <Dialog 
  
  open={selectedAvatar !== null} 
  onOpenChange={(open) => {
    if (!open) {
      setSelectedAvatar(null);
      refetchAvatars(); // Refetch avatars when closing the dialog
    }
  }}

>
  <DialogContent className="h-svh w-full max-w-full sm:max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-0">
    {/* Sticky Header with Go Back Button */}
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

    {/* Avatar Form */}
    {selectedAvatar && (
      <AvatarForm 
        avatar={selectedAvatar}  
        onClose={() => { setSelectedAvatar(null); refetchAvatars(); } }
        setAvatar={(value: Avatar) => setSelectedAvatar(value)} 
      />
    )}
  </DialogContent>
</Dialog>





<Dialog open={openAvatarDialog} onOpenChange={(open) => {
      if (!open) {
        setOpenAvatarDialog(false);
        refetchAvatars();
      } else {
        setOpenAvatarDialog(true);
      }
    }}>
      <DialogTrigger asChild>
        <Button
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
        <AvatarForm onClose={() => {     setOpenAvatarDialog(false);
        refetchAvatars();}} />
      </DialogContent>
    </Dialog>
      </div>

      {/* Full Screen Patient Edit Dialog */}
      {openPatientDialog && (
        <PatientEditDialog 
        // @ts-ignore
          patient={patient} 
          onClose={() => setOpenDialog(false)} 
        />
      )}
    </>
  );
};

export default AdminScreen;