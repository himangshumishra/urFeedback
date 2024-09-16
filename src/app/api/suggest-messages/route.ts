import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = 
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.The questions should not be repetitive and must be unique. The goal is to spark interesting and enjoyable conversations between users.";
    
    const result = await model.generateContent(prompt);
    // console.log(result.response.candidates);

    let questions = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No questions generated";
    
    // const questions = result?.content?.text || "No questions generated";   

    // console.log("Questions:", questions);
    
    return NextResponse.json({
      success: true,
      questions,   
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong while generating question suggestions",
    });
  }
}
