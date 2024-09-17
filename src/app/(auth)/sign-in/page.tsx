"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signinSchema } from "@/schemas/signinSchema";
import Image from "next/image";

export default function SignInForm() {
  const router = useRouter();
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setLoadingSignIn(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    setLoadingSignIn(false);

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const handleGithubSignIn = () => {
    setLoadingGithub(true);
    signIn("github", {
      redirect: false,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 m-4 border rounded-lg shadow-lg transform transition-all hover:scale-100">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-600">
            Welcome Back to urFeedback
          </h1>
          <p className="mb-6 text-gray-400">
            Sign in to continue your secret conversations
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Email/Username
                  </FormLabel>
                  <Input
                    {...field}
                    className="bg-gray-800 border border-gray-600 text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="bg-gray-800 border border-gray-600 text-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-colors"
              type="submit"
              disabled={loadingSignIn}
            >
              {loadingSignIn ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <Button
          className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white transition-colors"
          onClick={handleGithubSignIn}
          disabled={loadingGithub}
        >
          {loadingGithub ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            <div className="flex items-center space-x-2">
               <Image src="/github.svg" alt="GitHub" width={24} height={24} />
              <span>Sign in with GitHub</span>
            </div>
          )}
        </Button>
        <div className="text-center mt-4">
          <p className="text-gray-400">
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
