"use client";

import FormInput from "@/components/form-input";
import Message, { MessageProps } from "@/components/message";
import React, { FormEvent, useRef, useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { ArrowUp, Paperclip } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<MessageProps[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status == "unauthenticated") {
    return router.push("/login");
  }else {
    const sendMessage = async (e: FormEvent) => {
      e.preventDefault();
      setHistory([...history, { role: "user", message }]);
      setMessage("");

      try {
        const res = await fetch("http://localhost:8000/chat/", {
          method: "POST",
          body: JSON.stringify({ message }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aiResponse = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          aiResponse += decoder.decode(value, { stream: true });
          setHistory((prev) => {
            const lastMessage = prev[prev.length - 1];

            if (lastMessage?.role === "bot") {
              return [
                ...prev.slice(0, -1),
                { role: "bot", message: aiResponse },
              ];
            } else {
              return [...prev, { role: "bot", message: aiResponse }];
            }
          });
        }
      } catch (error) {
        console.error("Streaming error:", error);
      }
    };

    return (
      <main className="flex divide-x-2 h-screen">
        <aside className="max-w-[350px] w-full p-4">
          <h1 className="text-xl capitalize">{session?.user.username}</h1>
          <Button onClick={() => signOut()}>Sign out</Button>
        </aside>

        <section className="w-full p-4 pl-12 relative">
          <div className="max-w-5xl mx-auto">
            <div
              id="messages"
              className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            >
              {history.map((msg, index) => (
                <Message key={index} role={msg.role} message={msg.message} />
              ))}
            </div>

            <section className="flex gap-2 max-w-[820px] w-full items-start absolute bottom-5">
              <button className="rounded-xl text-base bg-purple-800 p-2">
                <Paperclip size={18} />
              </button>

              <form
                className="w-full flex items-end gap-2 bg-purple-900/20 rounded-2xl pr-2 pb-2"
                onSubmit={sendMessage}
              >
                <Textarea
                  // onKeyUp={() => handleKeyDown}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="p-2 h-fit max-h-[250px] overflow-y-auto"
                />

                <button type="submit" className="bg-purple-800 p-2 rounded-xl">
                  <ArrowUp size={18} />
                </button>
              </form>
            </section>
          </div>
        </section>
      </main>
    );
  }
}
