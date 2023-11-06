"use client";
import { useState, useEffect } from "react";
import user from "../img/user-icon.jpg";
import gpt from "../img/chatgpt-icon.png";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (chatLog.length > 1 && chatLog[chatLog.length - 1].role !== "assistant")
      fetchResponse();
  }, [chatLog]);
  async function fetchResponse() {
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/api/chatgpt", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ chatLog }),
    });
    const msg = await response.json();
    // console.log(msg.data);
    setIsLoading(false);
    setChatLog((chatLog) => [...chatLog, msg.data]);
    // console.log({ message: chatLog });
  }
  function handleSubmit(e, message) {
    e.preventDefault();
    // console.log(message);
    setMessage("");
    setChatLog((chatLog) => [...chatLog, { role: "user", content: message }]);
  }
  // console.log(message);
  return (
    <section className="flex bg-aside-black w-full h-full text-md overflow-x-hidden">
      <aside className="w-1/6 h-screen flex-grow bg-aside-black text-white">
        <div className="flex justify-center mt-3">
          <button
            className="w-5/6 px-4 py-3 border border-aside-border rounded-md bg-transparent"
            onClick={(e) =>
              setChatLog([
                { role: "system", content: "You are a helpful assistant." },
              ])
            }
          >
            <p className="flex gap-3 items-center text-md font-semibold">
              <span>+</span>
              New Chat
            </p>
          </button>
        </div>
      </aside>
      <div className="relative pt-5 pb-20 text-white w-full flex-grow bg-chat-color">
        <div className="w-3/4">
          {chatLog &&
            chatLog.map(
              (chat, i) =>
                chat.role !== "system" && (
                  <div
                    key={i}
                    className="flex gap-4 items-center mb-5 mx-4 bg-input-color px-4 py-2 rounded w-fit"
                  >
                    {chat.role === "user" ? (
                      <Image
                        width={46}
                        height={46}
                        src={user}
                        alt="user"
                        className="rounded-full"
                      />
                    ) : (
                      <Image
                        width={50}
                        height={50}
                        src={gpt}
                        alt="chat-gpt"
                        className="rounded-full"
                      />
                    )}
                    <p className="text-md">{chat.content}</p>
                  </div>
                )
            )}
          {isLoading && <CircularProgress className="ml-5" />}
        </div>
        <section className=" absolute bottom-4 left-4 mb-3 w-full items-end">
          <input
            value={message}
            className="w-2/3 px-5 py-3 rounded bg-input-color outline-none"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the prompt"
            onKeyDown={(e) => e.code === "Enter" && handleSubmit(e, message)}
          />
        </section>
      </div>
    </section>
  );
}
