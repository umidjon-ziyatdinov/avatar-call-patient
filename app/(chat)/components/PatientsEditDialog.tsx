// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";


import { User } from '@/lib/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import Form from 'next/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubmitButton } from '@/components/submit-button';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

// Type for prompt
type Prompt = {
  id: string;
  question: string;
};

// Type for prompt answer
type PromptAnswer = {
  promptId: string;
  question: string;
  answer: string;
};

export const PatientEditDialog = ({ patient, onClose }: { patient: User; onClose: () => void }) => {
  const [imagePreview, setImagePreview] = useState(patient.profilePicture);
  const [isPending, setIsPending] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  
  // New state for prompts
  const {data: availablePrompts, isLoading, mutate: refetchPrompts} = useSWR<Prompt[]>("/api/patient/prompt", fetcher);
  const [selectedPrompts, setSelectedPrompts] = useState<PromptAnswer[]>(
    patient.patientDetails?.promptAnswers || []
  );

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
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

  // Handle prompt selection
// Replace the existing handlePromptSelect function with this updated version
const handlePromptSelect = (index: number, promptId: string) => {

  console.log('data', index, 'promptId', promptId )
  const prompt = availablePrompts?.find(p => p.id === promptId);
  if (!prompt) return;

  setSelectedPrompts(prev => {
    const newPrompts = [...prev];
    // Ensure the array has the correct length and preserve existing answers
    while (newPrompts.length <= index) {
      newPrompts.push({ promptId: 0, question: '', answer: '' });
    }
    // Preserve the existing answer if the same prompt is selected
    const existingAnswer = newPrompts[index]?.promptId === prompt.id ? newPrompts[index]?.answer : '';
    newPrompts[index] = {
      promptId: prompt.id,
      question: prompt.question,
      answer: existingAnswer
    };
    return newPrompts;
  });
};

  // Handle prompt answer change
  const handleAnswerChange = (index: number, answer: string) => {
    setSelectedPrompts(prev => {
      const newPrompts = [...prev];
      if (newPrompts[index]) {
        newPrompts[index] = {
          ...newPrompts[index],
          answer
        };
      }
      return newPrompts;
    });
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      // Add basic form data
      formData.append('id', patient.id);
      if (newImageFile) {
        formData.append('profilePicture', newImageFile);
      }


 
      formData.append('promptAnswers', JSON.stringify(selectedPrompts));

      const response = await fetch(`/api/patient?id=${patient?.id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to save patient data');
      }
      
      toast.success('Patient Information Updated');
      onClose();
    } catch (error) {
      toast.error('Update Failed');
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
              <div className="space-y-6 w-full">
  <h3 className="text-lg font-semibold">Patient Prompts</h3>
  {[0, 1, 2].map((index) => (
  <div key={index} className="space-y-4 w-full">
    <div className="flex flex-col gap-2 max-w-full relative w-full [&_.select-trigger]:whitespace-normal [&_.select-trigger]:break-words [&_.select-trigger]:min-h-[60px] [&_.select-content]:break-words [&_.select-content]:whitespace-normal">
      <Label>Prompt {index + 1}</Label>
      <Select 
        onValueChange={(value) => handlePromptSelect(index, value)}
        value={selectedPrompts[index]?.promptId}
    
      >
        <SelectTrigger className='max-w-full py-2'>
          <SelectValue placeholder={`Select prompt ${index + 1}`} className='max-w-full py-4 h-auto'>
            {selectedPrompts[index] && (
              <span className="max-w-full py-2 line-clamp-2 whitespace-pre-line break-words text-left">
                {selectedPrompts[index].question}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className='max-w-[350px] w-full line-clamp-2 whitespace-pre-line break-words text-left'>
          {availablePrompts?.map((prompt, index) => (
            <SelectItem 
              key={prompt.id} 
              className='max-w-full line-clamp-2 whitespace-pre-line break-words text-left'
              value={prompt.id}
            >
              <span className=" max-w-full line-clamp-2 whitespace-pre-line break-words text-left min-h-[2.5rem]">
                {index + 1 }.{' '} {prompt.question}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    
  

  <div className="flex flex-col gap-2">
 
    <Textarea
      value={selectedPrompts[index]?.answer}
      onChange={(e) => handleAnswerChange(index, e.target.value)}
      placeholder="Enter your answer..."
      rows={3}
    />
  </div>

  </div>
))}
</div>

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