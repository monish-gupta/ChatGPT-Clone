import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function POST(request) {
  try {
    const { chatLog } = await request.json();
    // console.log(chatLog);
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatLog,
      temperature: 0,
    });
    // console.log("chatgpt", chatCompletion.choices[0].message);
    let data = chatCompletion.choices[0].message;
    return NextResponse.json({ data });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ Failed: error });
  }
}
