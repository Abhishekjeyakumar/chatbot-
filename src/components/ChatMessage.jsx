import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import "./ChatMessage.css";

export function ChatMessage({
  message,
  sender,
  time,
  type,
}) {

  return (

    <div
      className={
        sender === "user"
          ? "message-row user-message-row"
          : "message-row bot-message-row"
      }
    >

      <div
        className={
          sender === "user"
            ? "message user-message"
            : "message bot-message"
        }
      >

        {type === "image" ? (

         <img
  src={
    type === "image"
      ? message
      : JSON.parse(message).url
  }
  alt="uploaded"
  className="chat-image"
/>

        ) : (

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{

              code({
                inline,
                className,
                children,
                ...props
              }) {

                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                return !inline &&
                  match ? (

                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >

                    {String(children)
                      .replace(/\n$/, "")}

                  </SyntaxHighlighter>

                ) : (

                  <code
                    className={className}
                    {...props}
                  >
                    {children}
                  </code>

                );
              },
            }}
          >

            {message}

          </ReactMarkdown>

        )}

        <div className="message-time">
          {time}
        </div>

      </div>

    </div>
  );
}