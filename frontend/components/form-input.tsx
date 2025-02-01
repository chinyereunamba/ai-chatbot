import React from "react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { ArrowUp, Paperclip } from "lucide-react";

interface FormProps {
  submitHandler: () => void;
  message: string;
  setMessage: () => void;
}

export default function FormInput({
  submitHandler,
  message,
  setMessage,
}: FormProps) {
  return (
    <section className="flex gap-2 max-w-[820px] w-full items-start absolute bottom-5">
      <div>
        <button className="rounded-xl text-base bg-purple-800 p-2">
          <Paperclip size={18} />
        </button>
      </div>
      <form
        className="w-full flex items-end gap-2 bg-purple-900/20 rounded-2xl pr-2 pb-2"
        onSubmit={submitHandler}
      >
        <Textarea
          value={message}
          onChange={setMessage}
          placeholder="Type your message here..."
          className="p-2  h-fit max-h-[250px] overflow-scroll"
        />
        <button type="submit" className="bg-purple-800 p-2 rounded-xl">
          <ArrowUp size={18} />
        </button>
      </form>
    </section>
  );
}
