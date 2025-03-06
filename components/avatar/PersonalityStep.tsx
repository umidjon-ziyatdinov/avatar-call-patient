import React, { useState, useMemo } from "react";
import { Plus, Trash2, Info, ChevronRight, Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Full list of personalization questions
const PERSONALIZATION_QUESTIONS = [
  "What is the avatar's full name, and does the patient have a special nickname for them?",
  "What are some of the patient's fondest memories with this avatar?",
  "What was the avatar like as a child, and how did the patient describe their personality growing up?",
  "What special activities did the patient and avatar love doing together?",
  "Can you share a specific heartwarming or funny story about the patient and the avatar?",
  "Has the avatar and the patient ever shared an inside joke, funny phrase, or unique way of communicating?",
  "What life milestones has the avatar reached that the patient was proud of?",
  "How did the patient express love, pride, or concern for this avatar?",
  "Where does the avatar live now, and how has their life changed over time?",
  "What pets does the avatar have, and did the patient ever meet them?",
  "What are the avatar's passions, hobbies, or interests that the patient might like to hear about?",
  "If the avatar could spend one perfect day with the patient, what would it look like?",
  "What are some major challenges or struggles the avatar has gone through, and how did the patient support them?",
  "How does the avatar typically greet the patient or start conversations?",
  "What are some traditions or routines they had together?",
  "What is one piece of wisdom or advice the patient gave to the avatar that they will never forget?",
  "Has the avatar and the patient ever traveled together?",
  "If the avatar could send a message to the patient right now, what would it be?",
];

interface PersonalizationQuestion {
  question: string;
  answer: string;
}

interface PersonalityTraits {
  memoryEngagement: number;
  anxietyManagement: number;
  activityEngagement: number;
  socialConnection: number;
}

interface PersonalizationData {
  selectedPrompts?: PersonalizationQuestion[];
  personality?: PersonalityTraits;
  initialPrompt?: string;
  voiceId?: VoiceType;
}

interface PersonalizationScreenProps {
  data: PersonalizationData;
  updateData: (
    updater: (prev: PersonalizationData) => PersonalizationData
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// Add these constants
const Voices = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse",
] as const;
type VoiceType = (typeof Voices)[number];

const VoiceGenders: Record<VoiceType, string> = {
  alloy: "Male",
  ash: "Male",
  ballad: "Female",
  coral: "Female",
  echo: "Male",
  sage: "Male",
  shimmer: "Female",
  verse: "Female",
};

const VoiceDescriptions: Record<VoiceType, string> = {
  alloy: "Balanced and clear",
  ash: "Deep and thoughtful",
  ballad: "Soft and melodic",
  coral: "Warm and friendly",
  echo: "Confident and direct",
  sage: "Calm and measured",
  shimmer: "Bright and expressive",
  verse: "Gentle and soothing",
};

const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({
  data,
  updateData,
  nextStep,
  prevStep,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<
    PersonalizationQuestion[]
  >(data.selectedPrompts || []);
  const [personalityValues, setPersonalityValues] = useState<PersonalityTraits>(
    data.personality || {
      memoryEngagement: 50,
      anxietyManagement: 50,
      activityEngagement: 50,
      socialConnection: 50,
    }
  );
  const [selectedVoice, setSelectedVoice] = useState<VoiceType>(
    data.voiceId || "coral"
  );

  const [initialPrompt, setInitialPrompt] = useState<string>(
    data.initialPrompt || ""
  );
  const handleVoiceChange = (value: VoiceType) => {
    setSelectedVoice(value);
  };

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] =
    useState<boolean>(false);
  const [isPersonalityHelpOpen, setIsPersonalityHelpOpen] =
    useState<boolean>(false);

  const availableQuestions = useMemo(
    () =>
      PERSONALIZATION_QUESTIONS.filter(
        (q) => !selectedQuestions.some((selected) => selected.question === q)
      ),
    [selectedQuestions]
  );

  const handleAddQuestion = (question: string) => {
    setSelectedQuestions((prev) => [...prev, { question, answer: "" }]);
    setIsQuestionDialogOpen(false);
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    setSelectedQuestions((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const newQuestions = [...selectedQuestions];
    newQuestions[index].answer = answer;
    setSelectedQuestions(newQuestions);
  };

  const handlePersonalityChange = (
    trait: keyof PersonalityTraits,
    value: number[]
  ) => {
    setPersonalityValues((prev) => ({
      ...prev,
      [trait]: value[0],
    }));
  };

  const handleInitialPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInitialPrompt(e.target.value);
  };

  const handleSubmit = () => {
    updateData((prev) => ({
      ...prev,
      promptAnswers: selectedQuestions,
      personality: personalityValues,
      initialPrompt: initialPrompt,
      openaiVoice: selectedVoice,
    }));
    nextStep();
  };

  return (
    <div className="container mx-auto px-0 py-6 space-y-6">
      {/* Questions Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Creating Your Personalized Digital Companion
        </h2>
        <div className="space-y-3 text-blue-700">
          <p>
            Help us create your digital companion by answering questions about
            your shared memories and experiences.
          </p>
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-2">Key Benefits:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Creates authentic interactions</li>
              <li>Preserves important memories</li>
              <li>Ensures personalized responses</li>
            </ul>
          </div>
          <p className="italic">
            💡 More detailed answers will result in better personalization.
          </p>
        </div>
      </Card>

      {/* Initial Prompt Section */}
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Initial Greeting</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPersonalityHelpOpen(true)}
          >
            <Info className="h-4 w-4 mr-2" /> Help
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Add a custom greeting that your avatar will use when starting
            conversations. This sets the tone for your interactions.
          </p>
          <Textarea
            placeholder="E.g., 'Hi Mom! It's so good to see you today. How are you feeling?'"
            value={initialPrompt}
            onChange={handleInitialPromptChange}
            rows={3}
            className="placeholder-gray-400"
          />
        </div>
      </Card>
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Avatar Voice</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // Play voice sample functionality would go here in a real implementation
              alert(`This would play a sample of the ${selectedVoice} voice`);
            }}
          >
            <Volume2 className="h-4 w-4 mr-2" /> Preview
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose a voice that best represents your avatar's personality and
            sound.
          </p>

          <Select value={selectedVoice} onValueChange={handleVoiceChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {Voices.map((voice) => (
                <SelectItem key={voice} value={voice} className="relative pl-8">
                  <span className="font-medium">
                    {voice.charAt(0).toUpperCase() + voice.slice(1)}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {VoiceGenders[voice]} • {VoiceDescriptions[voice]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-3 gap-2">
            {Voices.map((voice) => (
              <div
                key={voice}
                className={`p-3 rounded-lg text-center cursor-pointer transition-colors
            ${
              selectedVoice === voice
                ? "bg-primary/10 border-2 border-primary"
                : "bg-accent/50 hover:bg-accent border border-accent"
            }`}
                onClick={() => handleVoiceChange(voice)}
              >
                <div className="flex justify-center items-center mb-1 h-6">
                  {selectedVoice === voice && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="font-medium truncate">
                  {voice.charAt(0).toUpperCase() + voice.slice(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {VoiceGenders[voice]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {/* Questions Section */}
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Personalization Questions</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsQuestionDialogOpen(true)}
            disabled={availableQuestions.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>

        {selectedQuestions.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-sm">{item.question}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveQuestion(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <Textarea
              placeholder="Share a detailed, heartfelt response that captures the essence of your relationship..."
              value={item.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              rows={3}
              className="placeholder-gray-400"
            />
          </div>
        ))}

        {selectedQuestions.length === 0 && (
          <p className="text-center text-gray-500">
            No questions selected. Click "Add Question" to begin personalizing
            your digital companion.
          </p>
        )}
      </Card>

      {/* Personality Traits Section */}
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Personality Traits</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPersonalityHelpOpen(true)}
          >
            <Info className="h-4 w-4 mr-2" /> About Traits
          </Button>
        </div>

        {Object.entries(personalityValues).map(([trait, value]) => (
          <div key={trait} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                {trait
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <span className="text-sm bg-accent px-2 py-1 rounded">
                {value}
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={(newValue) =>
                handlePersonalityChange(
                  trait as keyof PersonalityTraits,
                  newValue
                )
              }
              max={100}
              step={1}
            />
          </div>
        ))}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedQuestions.length === 0}
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Question Selection Dialog */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select a Question</DialogTitle>
            <DialogDescription>
              Choose a question to add to your avatar's personalization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {availableQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start whitespace-normal h-auto py-3"
                onClick={() => handleAddQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Personality Traits Help Dialog */}
      <Dialog
        open={isPersonalityHelpOpen}
        onOpenChange={setIsPersonalityHelpOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Understanding Personality Traits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Initial Greeting</h3>
              <p className="text-sm text-gray-600">
                This sets how your avatar will first engage with the user. A
                personalized greeting helps create an immediate emotional
                connection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Memory Engagement</h3>
              <p className="text-sm text-gray-600">
                How deeply the avatar connects with and recalls past experiences
                and memories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Anxiety Management</h3>
              <p className="text-sm text-gray-600">
                The avatar's ability to handle stress, provide calm, and support
                emotional well-being.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Activity Engagement</h3>
              <p className="text-sm text-gray-600">
                The avatar's enthusiasm and involvement in interactions and
                activities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Social Connection</h3>
              <p className="text-sm text-gray-600">
                The avatar's capacity for empathy, understanding, and building
                emotional rapport.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalizationScreen;
