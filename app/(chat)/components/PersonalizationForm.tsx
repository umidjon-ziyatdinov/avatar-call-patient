import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Info,
  Search,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  PatientDetails,
  PromptTemplate,
  PromptAnswer,
} from "./PatientOnboarding";

interface PersonalizationFormProps {
  patientDetails: PatientDetails;
  setPatientDetails: React.Dispatch<React.SetStateAction<PatientDetails>>;
  availablePrompts: PromptTemplate[];
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

// Categories for organizing prompts better
const categories = [
  { id: "childhood", name: "Childhood & Family", icon: "👨‍👩‍👧‍👦" },
  { id: "career", name: "Career & Achievements", icon: "💼" },
  { id: "relationships", name: "Relationships", icon: "❤️" },
  { id: "hobbies", name: "Hobbies & Interests", icon: "🎨" },
  { id: "life", name: "Life Moments", icon: "🌟" },
  { id: "custom", name: "Custom Questions", icon: "✏️" },
];

// Map prompts to categories
const getPromptCategory = (promptId: string): string => {
  const id = parseInt(promptId);
  if (id <= 2) return "childhood";
  if (id <= 3 || (id >= 18 && id <= 19)) return "career";
  if (id <= 6) return "relationships";
  if ((id >= 8 && id <= 12) || id === 15) return "hobbies";
  return "life";
};

const PersonalizationForm: React.FC<PersonalizationFormProps> = ({
  patientDetails,
  setPatientDetails,
  availablePrompts,
  onNext,
  onPrevious,
  currentStep,
  totalSteps,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Handle adding a prompt to patient answers
  const handlePromptSelect = (promptId: string) => {
    const selectedPrompt = availablePrompts.find((p) => p.id === promptId);
    if (!selectedPrompt) return;

    // Check if this prompt is already in the answers
    const existingIndex = patientDetails.promptAnswers.findIndex(
      (a) => a.promptId === promptId
    );

    if (existingIndex === -1) {
      // Add new prompt
      setPatientDetails((prev) => ({
        ...prev,
        promptAnswers: [
          ...prev.promptAnswers,
          {
            promptId: promptId,
            question: selectedPrompt.question,
            answer: "",
          },
        ],
      }));
    }
  };

  // Handle adding a custom question
  const handleAddCustomQuestion = () => {
    if (!customQuestion.trim()) return;

    // Create a custom ID
    const customId = `custom-${Date.now()}`;

    setPatientDetails((prev) => ({
      ...prev,
      promptAnswers: [
        ...prev.promptAnswers,
        {
          promptId: customId,
          question: customQuestion,
          answer: "",
        },
      ],
    }));

    setCustomQuestion("");
  };

  // Handle changing an answer
  const handlePromptAnswerChange = (index: number, answer: string) => {
    setPatientDetails((prev) => {
      const updatedAnswers = [...prev.promptAnswers];
      if (updatedAnswers[index]) {
        updatedAnswers[index] = {
          ...updatedAnswers[index],
          answer,
        };
      }
      return { ...prev, promptAnswers: updatedAnswers };
    });
  };

  // Remove a prompt from patient answers
  const removePrompt = (index: number) => {
    setPatientDetails((prev) => {
      const updatedAnswers = [...prev.promptAnswers];
      updatedAnswers.splice(index, 1);
      return { ...prev, promptAnswers: updatedAnswers };
    });
  };

  // Filter prompts based on search and category
  const getFilteredPrompts = () => {
    let filtered = availablePrompts.filter(
      (prompt) =>
        !patientDetails.promptAnswers.some(
          (answer) => (answer.promptId as string) === prompt.id
        )
    );

    if (searchQuery) {
      filtered = filtered.filter((prompt) =>
        prompt.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== "all" && activeTab !== "custom") {
      filtered = filtered.filter(
        (prompt) => getPromptCategory(prompt.id) === activeTab
      );
    }

    return filtered;
  };

  // Count prompts by category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") {
      return availablePrompts.length - patientDetails.promptAnswers.length;
    }

    return availablePrompts.filter(
      (prompt) =>
        getPromptCategory(prompt.id) === categoryId &&
        !patientDetails.promptAnswers.some(
          (answer) => answer.promptId === prompt.id
        )
    ).length;
  };

  const handleFallRiskChange = (value: string) => {
    setPatientDetails((prev) => ({
      ...prev,
      fallRisk: value,
    }));
  };

  // Function to get category icon
  const getCategoryIcon = (promptId: string) => {
    const category = categories.find(
      (c) => c.id === getPromptCategory(promptId)
    );
    return category ? category.icon : "🌟";
  };

  return (
    <div className="min-h-full w-full bg-background flex flex-col p-0">
      {/* Main content */}
      <div className="flex-1 container border-none max-w-7xl px-0 py-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-semibold">Personalize Your Avatar</h2>
            <p className="text-muted-foreground">
              Share stories and memories that will help us create a more
              personally meaningful experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Available prompts */}
            <div className="space-y-4 lg:col-span-1">
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    Question Library
                  </CardTitle>
                  <CardDescription>
                    Choose questions that are meaningful to you
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="p-3 rounded-lg bg-muted/50 mb-4">
                    <div className="flex items-center mb-1">
                      <Info className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">
                        Recommendation
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We recommend answering at least 3-5 questions for the best
                      experience. Choose questions that contain meaningful
                      stories, memories, or details about yourself or your loved
                      one.
                    </p>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardContent>

                <div className="px-4">
                  <Tabs
                    defaultValue="all"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <div className="overflow-x-auto hide-scrollbar">
                      <TabsList className="w-full justify-start mb-2 flex-nowrap">
                        <TabsTrigger value="all" className="flex-shrink-0">
                          All ({getCategoryCount("all")})
                        </TabsTrigger>
                        {categories.slice(0, -1).map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className="flex-shrink-0"
                          >
                            <span>{category.icon}</span>
                            <span className="ml-1">
                              {getCategoryCount(category.id)}
                            </span>
                          </TabsTrigger>
                        ))}
                        <TabsTrigger value="custom" className="flex-shrink-0">
                          <span>✏️</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="custom" className="mt-0">
                      <div className="flex flex-col space-y-2 pt-2">
                        <Label htmlFor="customQuestion">
                          Add Your Own Question
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="customQuestion"
                            placeholder="Enter your own question..."
                            value={customQuestion}
                            onChange={(e) => setCustomQuestion(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && customQuestion.trim()) {
                                handleAddCustomQuestion();
                              }
                            }}
                          />
                          <Button
                            variant="default"
                            size="icon"
                            onClick={handleAddCustomQuestion}
                            disabled={!customQuestion.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Content for "all" and category tabs */}
                    {["all", ...categories.slice(0, -1).map((c) => c.id)].map(
                      (tabId) => (
                        <TabsContent key={tabId} value={tabId} className="mt-0">
                          <ScrollArea className="h-[calc(100vh-30rem)]">
                            <div className="space-y-2 pt-2">
                              {getFilteredPrompts().length > 0 ? (
                                getFilteredPrompts().map((prompt) => (
                                  <div
                                    key={prompt.id}
                                    className="group relative bg-card hover:bg-accent/40 transition-colors rounded-lg p-3 cursor-pointer shadow-sm border border-border/50 hover:border-primary/30"
                                    onClick={() =>
                                      handlePromptSelect(prompt.id)
                                    }
                                  >
                                    <div className="flex items-start">
                                      <span className="mr-2">
                                        {getCategoryIcon(prompt.id)}
                                      </span>
                                      <span className="text-sm flex-1">
                                        {prompt.question}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Plus className="h-4 w-4 text-primary" />
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-6 text-center rounded-lg bg-muted/20 border border-dashed">
                                  {searchQuery
                                    ? "No matching questions found"
                                    : "No more questions available in this category"}
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      )
                    )}
                  </Tabs>
                </div>

                <CardFooter className="pt-0 px-4 pb-3 text-xs text-muted-foreground">
                  <p>Click on a question to add it to your list</p>
                </CardFooter>
              </Card>
            </div>

            {/* Right column: Selected prompts and answers */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="shadow-md border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="text-primary mr-2">📝</span>
                    Your Selected Questions
                  </CardTitle>
                  <CardDescription>
                    {patientDetails.promptAnswers.length > 0
                      ? `You've selected ${
                          patientDetails.promptAnswers.length
                        } question${
                          patientDetails.promptAnswers.length > 1 ? "s" : ""
                        }`
                      : "Choose questions from the library and answer them to personalize your avatar"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[calc(100vh-18rem)]">
                  {patientDetails.promptAnswers.length > 0 ? (
                    <div className="space-y-4">
                      {patientDetails.promptAnswers.map((answer, index) => (
                        <div
                          key={answer.promptId}
                          className="bg-card rounded-lg p-4 shadow-sm relative group border-l-4 border-l-primary border-t border-r border-b hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start mb-2 pr-8">
                            <div className="flex-1">
                              <p className="font-medium text-base mb-1">
                                {answer.question}
                              </p>
                              {answer.promptId.startsWith("custom") && (
                                <Badge variant="outline" className="w-fit mb-2">
                                  Custom Question
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Textarea
                            value={answer.answer}
                            onChange={(e) =>
                              handlePromptAnswerChange(index, e.target.value)
                            }
                            placeholder="Share your story or experience here..."
                            rows={4}
                            className="resize-y focus:border-primary"
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePrompt(index);
                            }}
                            className="absolute top-3 right-3 text-muted-foreground transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-muted-foreground rounded-lg bg-muted/20">
                      <p className="text-muted-foreground mb-4 text-center">
                        Select questions from the library to personalize your
                        avatar experience.
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        The more questions you answer, the more personalized
                        your experience will be.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add this style to hide scrollbars but maintain scrolling functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          overflow-x: auto;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default PersonalizationForm;
