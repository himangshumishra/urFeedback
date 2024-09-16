"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-black text-white">
        {/* Main content */}
        <main className="flex-grow relative flex flex-col items-center justify-center mx-auto text-center w-full px-4 py-12">
          {/* Full-screen background */}
          <div className="absolute inset-0 min-w-fit min-h-screen bg-[linear-gradient(to_right,#000000_1px,transparent_5px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-80"></div>

          <section className="mb-8 md:mb-10 relative z-10 pt-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-600 leading-tight">
              <span className="block">Dive into the</span>
              <span className="block">World of</span>
              <span className="block">Anonymous Feedback</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-300">
              True Feedback - Where your identity remains a secret.
            </p>
          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-lg md:max-w-xl mb-4 relative z-10"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-xl rounded-lg hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-cyan-300">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center justify-center space-x-3 space-y-3">
                      <Mail className="w-6 h-6 text-cyan-400" />
                      <div>
                        <p className="text-gray-200">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <Carousel
  plugins={[Autoplay({ delay: 3000 })]}
  className="w-full max-w-lg md:max-w-xl mb-4 relative z-10"
>
  <CarouselContent>
    {messages.slice().reverse().map((message, index) => (
      <CarouselItem key={index} className="p-4">
        <Card className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-xl rounded-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-cyan-300">
              {message.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-center space-x-3 space-y-3">
            <Mail className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-gray-200">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.received}
              </p>
            </div>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
        </main>

        {/* Footer */}
        <footer className="w-full p-4 md:p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-400 text-center mt-auto">
          <p className="text-sm md:text-base">
            © 2023 True Feedback. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
