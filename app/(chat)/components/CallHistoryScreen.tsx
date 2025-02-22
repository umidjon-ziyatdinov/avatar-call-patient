import React, { useState } from 'react';
import { format } from 'date-fns';
import useSWR from 'swr';
import { Search, Filter, Clock, Phone, User, Calendar, ArrowUpRight, Pause, Play, Volume2, Download, ArrowRight } from 'lucide-react';
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetcher } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';



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
  
  interface CallData {
    id: string;
    createdAt: string;
    endedAt?: string;
    duration?: number;
    userId: string;
    avatarId: string;
    status: 'active' | 'completed' | 'failed' | 'missed';
    recordingUrl?: string;
    transcriptUrl: string;
    qualityMetrics: QualityMetrics;
    conversationMetrics: ConversationMetrics;
    technicalDetails: TechnicalDetails;
    errorLogs: ErrorLog[];
    avatarName: string;
    avatarRole: string ;
    avatarImage: string;
    metadata: Record<string, unknown>;
    
  }
  
  // Props interfaces
  interface CallCardProps {
    call: CallData;
  }
  
  interface CallDetailsProps {
    call: CallData;
    onClose: () => void;
  }
  
  const CallCard: React.FC<CallCardProps> = ({ call }) => {
    const getStatusColor = (status: CallData['status']) => {
      const colors = {
        active: 'bg-green-500',
        completed: 'bg-blue-500',
        failed: 'bg-red-500',
        missed: 'bg-yellow-500'
      };
      return colors[status] || 'bg-gray-500';
    };
  
    return (
      <Card className="mb-4 hover:shadow-lg transition-shadow group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Image
                    src={call.avatarImage || '/default-avatar.png'}
                    alt={call.avatarName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover size-[48px]"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{call.avatarName}</h3>
                <p className="text-sm text-gray-500">{call.avatarRole}</p>
                <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(call.createdAt), 'MMM dd, yyyy')}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{format(new Date(call.createdAt), 'HH:mm')}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={`${getStatusColor(call.status)} text-white`}>
                {call.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
      
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
};
  
  const CallDetails: React.FC<CallDetailsProps> = ({ call, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
  
    const getStatusColor = (status: CallData['status']) => {
      const colors = {
        active: 'bg-green-500',
        completed: 'bg-blue-500',
        failed: 'bg-red-500',
        missed: 'bg-yellow-500'
      };
      return colors[status] || 'bg-gray-500';
    };
  
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-svh sm:max-h-[90vh] p-0">
          <DialogHeader className="p-6">
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full">
            <div className="space-y-6 p-6">
              {/* Avatar Card */}
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {call.avatarImage ? (
                        <img 
                          src={call.avatarImage} 
                          alt={call.avatarName}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <Badge 
                        className={`${getStatusColor(call.status)} absolute -bottom-2 right-0 px-2 py-1`}
                      >
                        {call.status}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{call.avatarName}</h2>
                      <p className="text-gray-500">{call.avatarRole}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Call Details Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span>{format(new Date(call.createdAt), 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>{format(new Date(call.createdAt), 'HH:mm')} - {call.endedAt ? format(new Date(call.endedAt), 'HH:mm') : 'Ongoing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Duration:</span>
                      <span>{call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Device:</span>
                      <span>{call.technicalDetails.deviceType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              {/* Audio Player Section */}
              {call.recordingUrl && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Recording</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <div className="flex-1 mx-4">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full w-1/3" />
                          </div>
                        </div>
                        <Volume2 className="h-4 w-4 text-gray-500" />
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => window.open(call.recordingUrl, '_blank')}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Recording
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
  
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conversation Metrics */}
                <Card className="h-full">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Conversation Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Your Speaking Time</span>
                        <span className="font-medium">{call.conversationMetrics.userSpeakingTime}s</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Avatar Speaking Time</span>
                        <span className="font-medium">{call.conversationMetrics.avatarSpeakingTime}s</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Conversation Turns</span>
                        <span className="font-medium">{call.conversationMetrics.turnsCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  
                {/* Quality Metrics */}
                <Card className="h-full">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Call Quality</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Audio Quality</span>
                          <span className="font-medium">{call.qualityMetrics.audioQuality}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${call.qualityMetrics.audioQuality}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Video Quality</span>
                          <span className="font-medium">{call.qualityMetrics.videoQuality}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${call.qualityMetrics.videoQuality}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Network Latency</span>
                          <span className="font-medium">{call.qualityMetrics.networkLatency}ms</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-yellow-500 rounded-full" 
                            style={{ width: `${Math.min((call.qualityMetrics.networkLatency / 200) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

const CallHistoryScreen = ({open, setOpen }: {open: boolean,     setOpen: (value:boolean) => void;}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedCall, setSelectedCall] = useState<CallData | null>(null);
  // Fetch calls data
  const { data: calls, isLoading, mutate } = useSWR('/api/calls', fetcher);

  const getStatusColor = (status:  CallData['status'] ) => {
    const colors = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      failed: 'bg-red-500',
      missed: 'bg-yellow-500'
    };
    return colors[status] || 'bg-gray-500';
  };


  return (
    <Dialog open={open} onOpenChange={() => {
        if(open) setOpen(false)
    }}>
      <DialogContent className="max-w-4xl h-svh sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Call History</DialogTitle>
        </DialogHeader>
        
        {/* Search and Filter Section */}
        <div className="flex gap-4 p-4 border-b">
          <div className="flex-1 relative">
            {/* <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search calls..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calls List */}
        <ScrollArea className="flex-1 px-0" >
          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="flex w-full h-40 items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )  : calls?.data?.map((call: CallData) => (
              <div key={call.id} onClick={() => setSelectedCall(call)}>
                <CallCard call={call} />
              </div>
            ))}
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