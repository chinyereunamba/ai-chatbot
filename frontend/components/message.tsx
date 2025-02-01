import cn from "@/utils/cn";
import React from "react";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import TeX from "@matejmazur/react-katex";

import DOMPurify from "dompurify";

export interface MessageProps {
  role: "bot" | "user";
  message: string;
  className?: string;
}

export default function Message({ role, message, className }: MessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2 items-start",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "bot" && (
        <div className="bg-purple-900 text-white p-3 rounded-full text-xs font-medium">
          AI
        </div>
      )}
      <div
        className={cn(
          " p-4",
          role === "user"
            ? "bg-purple-900/20 rounded-2xl max-w-[500px] w-fit"
            : "w-fit",
          className
        )}
      >
        {/* <Markdown
          options={{
            overrides: {
              code: ({ children, className, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                if (match && match[1] === "latex") {
                  return <TeX as="div">{String.raw`${children}`}</TeX>;
                }
                return (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match ? match[1] : "plaintext"}
                    PreTag="div"
                    wrapLines={true}
                  >
                    {String(children).trim()}
                  </SyntaxHighlighter>
                );
              },
            },
          }}
        >
          {message}
        </Markdown> */}

        <ReactMarkdown remarkPlugins={[gfm]}>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
