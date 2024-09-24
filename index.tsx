import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { renderer } from "./renderer";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { Ai } from "@cloudflare/workers-types";

type Bindings = {
  AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <>
      <div className="flex h-screen bg-gray-200">
        <div
          className="flex flex-col flex-grow"
          style="max-width: calc(100% - 20rem)"
        >
          <div
            id="chat-history"
            className="flex flex-col-reverse flex-1 p-6 overflow-y-auto bg-white space-y-4 messages-container"
          ></div>
          <div className="px-6 py-2 bg-white shadow-up">
            <form className="flex items-center" id="chat-form">
              <textarea
                id="message-input"
                className="flex-grow p-2 m-2 border rounded border-chat-border shadow-sm placeholder-chat-placeholder"
                placeholder="Type a message..."
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 m-2 text-black rounded bg-chat-button hover:bg-gray-300"
              >
                Send
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500">
              <p className="model-display">-</p>
              <input
                type="hidden"
                class="message-user message-assistant message-model"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between p-6 shadow-xl w-80 bg-chat-settings">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Chat Settings</h2>
              <p className="mt-1 text-sm text-chat-helpertext">
                Try out different models and configurations for your chat
                application
              </p>
            </div>
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-black">
                  Model
                </label>
                <select
                  id="model-select"
                  className="w-full px-3 py-2 leading-tight text-black border rounded border-chat-border focus:outline-none focus:shadow-outline"
                ></select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-black">
                  System Message
                </label>
                <p className="mb-2 text-sm text-chat-helpertext">
                  Guides the tone of the response
                </p>
                <textarea
                  id="system-message"
                  className="w-full px-3 py-2 leading-tight text-black border rounded border-chat-border focus:outline-none focus:shadow-outline"
                  placeholder="Enter system message..."
                ></textarea>
              </div>
              <button
                id="apply-chat-settings"
                className="w-full px-4 py-2 text-white rounded bg-chat-apply hover:bg-gray-800 focus:outline-none focus:shadow-outline"
              >
                Apply Changes
              </button>
            </form>
          </div>
          <div className="flex items-center justify-center mt-4 text-sm text-center text-gray-500">
            <span className="pt-2 mr-2">Powered by</span>
            <a
              href="https://developers.cloudflare.com/workers-ai/"
              target="_blank"
            >
              <img
                src="/static/cloudflare-logo.png"
                alt="Cloudflare Logo"
                className="inline h-6"
              />
            </a>
          </div>
        </div>
      </div>
      <script src="/static/script.js"></script>
    </>
  );
});

app.post("/api/chat", async (c) => {
  const payload = await c.req.json();
  const messages = [...payload.messages];
  // Prepend the systemMessage
  if (payload?.config?.systemMessage) {
    messages.unshift({ role: "system", content: payload.config.systemMessage });
  }
  //console.log("Model", payload.config.model);
  //console.log("Messages", JSON.stringify(messages));
  let eventSourceStream;
  let retryCount = 0;
  let successfulInference = false;
  let lastError;
  const MAX_RETRIES = 3;
  while (successfulInference === false && retryCount < MAX_RETRIES) {
    try {
      eventSourceStream = (await c.env.AI.run(payload.config.model, {
        messages,
        stream: true,
      })) as ReadableStream;
      successfulInference = true;
    } catch (err) {
      lastError = err;
      retryCount++;
      console.error(err);
      console.log(`Retrying #${retryCount}...`);
    }
  }
  if (eventSourceStream === undefined) {
    if (lastError) {
      throw lastError;
    }
    throw new Error(`Problem with model`);
  }
  // EventSource stream is handy for local event sources, but we want to just stream text
  const tokenStream = eventSourceStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream());

  return streamText(c, async (stream) => {
    for await (const msg of tokenStream) {
      if (msg.data !== "[DONE]") {
        const data = JSON.parse(msg.data);
        stream.write(data.response);
      }
    }
  });
});

export default app;
