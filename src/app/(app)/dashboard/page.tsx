'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { MessageCard } from '@/components/MessageCard';
import UsernameAdder from '@/components/UsernameAdder';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
// console.log(session?.user);

  // if(!session?.user.username){
  //   return <>
  //   <UsernameAdder name={session?.user?.name??"Hero"} mail={session?.user?.email??"demo@5v1.pw"}/>
  //   </>
  // }
  
  

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      // console.log(session);
      
      const response = await axios.get<ApiResponse>('/api/accept-message');      
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div>Error</div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
      <div className="my-8 md:mx-8 lg:mx-auto p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-lg shadow-lg max-w-4xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          User Dashboard
        </h1>
    
        {/* Copy Link Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Copy Your Unique Link</h2>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 shadow-md">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-3 rounded-md text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={copyToClipboard}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-200"
            >
              Copy
            </Button>
          </div>
        </div>
    
        {/* Accept Messages Switch */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="transform scale-110"
            />
            <span className="ml-4 text-lg font-medium text-gray-700">
              Accept Messages:{" "}
              <span className={`font-bold ${acceptMessages ? 'text-green-600' : 'text-red-600'}`}>
                {acceptMessages ? 'On' : 'Off'}
              </span>
            </span>
          </div>
        </div>
    
        {/* Divider */}
        <Separator className="my-6 border-gray-300" />
    
        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-5 w-5" />
            )}
          </Button>
        </div>
    
        {/* Messages Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
                // className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages to display.</p>
          )}
        </div>
      </div>
    );
    
}

export default UserDashboard;