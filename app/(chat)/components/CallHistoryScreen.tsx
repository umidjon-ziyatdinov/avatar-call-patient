import React, { useState } from "react";
import { format } from "date-fns";
import useSWR from "swr";
import {
  Search,
  Filter,
  Clock,
  Phone,
  User,
  Calendar,
  ArrowUpRight,
  Pause,
  Play,
  Volume2,
  Download,
  ArrowRight,
  AlertTriangle,
  Heart,
  ArrowLeft,
  FileText,
  MessageSquare,
  Clock3,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetcher } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

// Type definitions based on the schema
interface QualityMetrics {
  audioQuality: number;
  videoQuality: number;
  networkLatency: number;
  dropouts: number;
}

interface ConversationMetrics {
  userSpeakingTime: number;
  avatarSpeakingTime: number;
  turnsCount: number;
  avgResponseTime: number;
}

interface TechnicalDetails {
  browserInfo: string;
  deviceType: string;
  networkType: string;
  osVersion: string;
}

interface ErrorLog {
  timestamp: string;
  error: string;
  context: string;
}

interface TimelinePoint {
  timestamp: string;
  discussion_points: string[];
}

interface AlertSummary {
  timestamp: string;
  alert_type: string;
  description: string;
  recommended_followup: string;
}

interface Sentiment {
  rating: string;
  description: string;
}

interface CallAnalysis {
  is_flagged: boolean;
  key_points: string[];
  call_summary: string;
  alert_summary?: AlertSummary;
  call_timeline: TimelinePoint[];
  overall_sentiment: Sentiment;
}

interface PatientInfo {
  name: string;
  email: string;
  age: number;
  sex: string;
  location: string;
  education: string;
  work: string;
  profilePicture: string;
  createdAt: string;
}

export interface CallData {
  id: string;
  createdAt: string;
  endedAt?: string;
  duration?: number;
  userId: string;
  avatarId: string;
  status: "active" | "completed" | "failed" | "missed";
  recordingUrl?: string;
  transcriptUrl: string;
  qualityMetrics: QualityMetrics;
  conversationMetrics: ConversationMetrics;
  technicalDetails: TechnicalDetails;
  errorLogs: ErrorLog[];
  avatarName: string;
  avatarRole: string;
  avatarImage: string;
  metadata: Record<string, unknown>;
  analysis?: CallAnalysis;
  patientName: string;
  patientEmail: string;
  patientAge: number;
  patientSex: string;
  patientLocation: string;
  patientEducation: string;
  patientWork: string;
  patientProfilePicture: string;
  patientCreatedAt: string;
}

// Props interfaces
interface CallCardProps {
  call: CallData;
  onClick: () => void;
}

interface CallDetailsProps {
  call: CallData;
  onClose: () => void;
}

const CallCard: React.FC<CallCardProps> = ({ call, onClick }) => {
  const getStatusColor = (status: CallData["status"]) => {
    const colors = {
      active: "bg-green-500 dark:bg-green-600",
      completed: "bg-blue-500 dark:bg-blue-600",
      failed: "bg-red-500 dark:bg-red-600",
      missed: "bg-yellow-500 dark:bg-yellow-600",
    };
    return colors[status] || "bg-gray-500 dark:bg-gray-600";
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isFlagged = call.analysis?.is_flagged;

  return (
    <Card
      onClick={onClick}
      className="mb-4 hover:shadow-md transition-shadow cursor-pointer border dark:border-gray-700"
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src={call.avatarImage || "/default-avatar.png"}
              alt={call.avatarName}
              width={100}
              height={100}
              className={`rounded-2xl size-[80px] sm:size-[80px] object-cover shadow-md dark:shadow-zinc-800/30`}
            />

            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-base sm:text-lg">
                  {call.avatarName}
                </h3>
                {isFlagged && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Action Required
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {call.avatarRole}
              </p>
              <div className="flex flex-1  w-full items-center mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="whitespace-nowrap">
                  {format(new Date(call.createdAt), "MMM dd, yyyy")}
                </span>
                <Clock className="h-3 w-3 ml-2 mr-1" />
                <span>{format(new Date(call.createdAt), "HH:mm")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={`${getStatusColor(call.status)} text-white`}>
              {call.status}
            </Badge>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {formatDuration(call.duration)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-1 h-6"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TimelineItem = ({ point }: { point: TimelinePoint }) => {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600"></div>
        <div className="w-0.5 h-full bg-blue-200 dark:bg-blue-800"></div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {point.timestamp}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <ul className="list-disc ml-4 text-sm">
            {point.discussion_points.map((point, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const CallDetails: React.FC<CallDetailsProps> = ({ call, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const getStatusColor = (status: CallData["status"]) => {
    const colors = {
      active: "bg-green-500 dark:bg-green-600",
      completed: "bg-blue-500 dark:bg-blue-600",
      failed: "bg-red-500 dark:bg-red-600",
      missed: "bg-yellow-500 dark:bg-yellow-600",
    };
    return colors[status] || "bg-gray-500 dark:bg-gray-600";
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getSentimentColor = (rating?: string) => {
    if (!rating) return "text-gray-500";
    const colors = {
      positive: "text-green-500 dark:text-green-400",
      neutral: "text-blue-500 dark:text-blue-400",
      negative: "text-red-500 dark:text-red-400",
    };
    return colors[rating as keyof typeof colors] || "text-gray-500";
  };

  const isFlagged = call?.analysis?.is_flagged;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl flex flex-col h-svh p-0 dark:bg-gray-900">
        <DialogHeader className="sticky w-full max-w-full top-[-1px] flex-nowrap flex-row bg-background z-10 shadow-md p-4 flex items-center border-b-1 justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClose();
            }}
            className="border-1 p-2"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle className="text-md font-semibold">
            Call Details
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="summary"
          className="w-full h-full"
          onValueChange={setActiveTab}
        >
          <div className="px-6">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="summary" className="flex-1">
                Summary
              </TabsTrigger>
              {call.analysis && (
                <TabsTrigger value="analysis" className="flex-1">
                  Analysis
                  {isFlagged && (
                    <AlertTriangle className="ml-1 h-4 w-4 text-red-500 " />
                  )}
                </TabsTrigger>
              )}
              <TabsTrigger value="patient" className="flex-1">
                Patient
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="px-6 pb-6">
              <TabsContent value="summary" className="space-y-4 mt-0">
                {/* Avatar and Call Info */}
                <Card className="border dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                      <Image
                        src={call.avatarImage || "/default-avatar.png"}
                        alt={call?.avatarName}
                        width={100}
                        height={100}
                        className={`rounded-2xl size-[80px] sm:size-[80px] object-cover shadow-md dark:shadow-zinc-800/30`}
                      />
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h2 className="text-xl font-bold">
                            {call.avatarName}
                          </h2>
                          <Badge
                            className={`${getStatusColor(
                              call.status
                            )} text-white`}
                          >
                            {call.status}
                          </Badge>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          {call.avatarRole}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call Basic Details */}
                <Card className="border dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span>
                        {format(new Date(call.createdAt), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span>
                        {format(new Date(call.createdAt), "HH:mm")} -{" "}
                        {call.endedAt
                          ? format(new Date(call.endedAt), "HH:mm")
                          : "Ongoing"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span>Duration: {formatDuration(call.duration)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span>Patient: {call.patientName}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recording Section */}
                {/* {call.recordingUrl && (
                  <Card className="border dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recording</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="dark:border-gray-700 dark:bg-gray-800"
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div className="h-2 bg-blue-500 dark:bg-blue-600 rounded-full w-1/3" />
                            </div>
                          </div>
                          <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full dark:border-gray-700 dark:bg-gray-800"
                          onClick={() =>
                            window.open(call.recordingUrl, "_blank")
                          }
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Recording
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )} */}

                {/* Conversation Stats */}
                <Card className="border dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Conversation Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Patient Speaking Time
                        </span>
                        <span className="font-medium">
                          {call.conversationMetrics.userSpeakingTime}s
                        </span>
                      </div>
                      <Separator className="dark:bg-gray-700" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Avatar Speaking Time
                        </span>
                        <span className="font-medium">
                          {call.conversationMetrics.avatarSpeakingTime}s
                        </span>
                      </div>
                      <Separator className="dark:bg-gray-700" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Conversation Turns
                        </span>
                        <span className="font-medium">
                          {call.conversationMetrics.turnsCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call Summary (if analysis exists) */}
                {call.analysis && (
                  <Card className="border dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Call Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <p className="text-gray-700 dark:text-gray-300">
                        {call.analysis.call_summary}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-0">
                {call.analysis && (
                  <>
                    {/* Alert Section if Flagged */}
                    {isFlagged && call.analysis.alert_summary && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>
                          Action Required -{" "}
                          {call.analysis.alert_summary.alert_type}
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                          <p className="mb-1">
                            {call.analysis.alert_summary.description}
                          </p>
                          <p className="font-semibold text-sm">
                            {call.analysis.alert_summary.timestamp}
                          </p>
                          <div className="mt-2 pt-2 border-t border-red-300 dark:border-red-700">
                            <span className="font-semibold">
                              Recommended Follow-up:
                            </span>{" "}
                            {call.analysis.alert_summary.recommended_followup}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Key Points */}
                    <Card className="border dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Key Points</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <ul className="list-disc pl-5 space-y-1">
                          {call.analysis.key_points.map((point, index) => (
                            <li
                              key={index}
                              className="text-gray-700 dark:text-gray-300"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Overall Sentiment */}
                    <Card className="border dark:border-gray-700">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">
                          Patient Sentiment
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`${getSentimentColor(
                            call.analysis.overall_sentiment.rating
                          )}`}
                        >
                          {call.analysis.overall_sentiment.rating
                            ?.charAt(0)
                            ?.toUpperCase() +
                            call.analysis.overall_sentiment.rating.slice(1)}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <p className="text-gray-700 dark:text-gray-300">
                          {call.analysis.overall_sentiment.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Call Timeline */}
                    <Card className="border dark:border-gray-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Call Timeline</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <div className="space-y-2">
                          {call.analysis.call_timeline.map((point, index) => (
                            <TimelineItem key={index} point={point} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="patient" className="space-y-4 mt-0">
                {/* Patient Profile */}
                <Card className="border dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <Avatar className="w-24 h-24 border dark:border-gray-700">
                        <AvatarImage
                          src={call.patientProfilePicture || ""}
                          alt={call.patientName}
                        />
                        <AvatarFallback>
                          {call?.patientName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold">
                          {call?.patientName}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                          {call.patientEmail}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                          <Badge variant="secondary">
                            Age: {call.patientAge}
                          </Badge>
                          <Badge variant="secondary">
                            Gender: {call.patientSex}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Patient Details */}
                <Card className="border dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Location
                        </p>
                        <p>{call.patientLocation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Education
                        </p>
                        <p>{call.patientEducation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Occupation
                        </p>
                        <p>{call.patientWork}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const CallHistoryScreen = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCall, setSelectedCall] = useState<CallData | null>(null);

  // Fetch calls data
  const { data: calls, isLoading, mutate } = useSWR("/api/calls", fetcher);

  // Filter calls based on search query and status
  const filteredCalls = React.useMemo(() => {
    if (!calls?.data) return [];

    return calls.data.filter((call: CallData) => {
      const matchesSearch =
        searchQuery === "" ||
        call.avatarName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.patientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || call.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [calls, searchQuery, statusFilter]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (open) setOpen(false);
      }}
    >
      <DialogContent className="max-w-4xl flex flex-col h-svh sm:max-h-[90vh] p-0 dark:bg-gray-900">
        <DialogHeader className="sticky w-full h-[60px] max-w-full top-[-1px] flex-nowrap flex-row bg-background z-10 shadow-md p-4 flex items-center border-b-1 justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
            }}
            className="border-1 p-2"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <DialogTitle className="text-md font-semibold">
            Call History
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter Section */}
        {/* <div className="px-6 py-2 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search patients or avatars..."
              className="pl-8 dark:bg-gray-800 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Flagged Calls Section */}
        {filteredCalls.some((call: CallData) => call.analysis?.is_flagged) && (
          <div className="px-4 py-2">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                One or more calls require your attention. Please review flagged
                calls.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Calls List */}
        <ScrollArea className="flex-1 px-4 pt-2 pb-6 h-[calc(90vh-10rem)]">
          <div className="space-y-2 h-full flex flex-col justify-start">
            {isLoading ? (
              <div className="flex w-full h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredCalls.length > 0 ? (
              filteredCalls.map((call: CallData) => (
                <CallCard
                  key={call.id}
                  call={call}
                  onClick={() => setSelectedCall(call)}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <h3 className="mt-4 text-lg font-medium">No calls found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter"
                    : "You don't have any calls recorded yet."}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Call Details Dialog */}
        {selectedCall && (
          <CallDetails
            call={selectedCall}
            onClose={() => setSelectedCall(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallHistoryScreen;
