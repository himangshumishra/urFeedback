"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (suggestions: any): string[] => {
  return typeof suggestions === "string"
    ? suggestions
        .trim()
        .split(specialChar)
        .map((suggestion) => (suggestion as string).replace(/^'|'$/g, ""))
    : [];
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState(initialMessageString);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const SkeletonCard = () => (
    <div className="w-full py-12 px-4 border border-gray-300 rounded-lg bg-gray-200 animate-pulse"></div>
  );
  const fetchSuggestedMessages = async () => {
    try {
      setIsLoading(true);
      setSuggestions(""); // Clear current suggestions
      const response = await axios.get<ApiResponse>("/api/suggest-messages", {
        headers: {
          "Cache-Control": "no-cache", // this line is saved me after hours of debugging
        },
      });

      // console.log(response.data);

      const resSuggestions = response.data?.questions;
      setSuggestions(resSuggestions);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="container max-w-2xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Public Profile Link
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-700">
                    Send Anonymous Message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none p-4 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button
                  disabled
                  className="flex items-center justify-center py-3 px-6 bg-gray-400 text-white font-semibold rounded-lg"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 ease-in-out"
                  disabled={isLoading || !messageContent}
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 mt-8">
          <div className="space-y-2 text-center">
            <Button
              onClick={fetchSuggestedMessages}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition duration-200"
              disabled={isLoading}
            >
              Suggest Messages
            </Button>
            <p className="text-sm text-gray-500">
              Click on any message below to select it.
            </p>
          </div>
          <Card className="bg-white shadow-sm rounded-lg border">
            <CardHeader>
              <h3 className="text-2xl font-semibold text-center text-gray-700">
                Messages
              </h3>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : isLoading ? (
                // <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                parseStringMessages(suggestions).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full py-12 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-wrap"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="text-center space-y-4">
          <p className="text-gray-600">Want your own message board?</p>
          <Link href={"/sign-up"}>
            <Button className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
