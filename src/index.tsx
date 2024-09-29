import { Context, Hono } from "hono";
import { Button, Textarea, Select, Input } from "@headlessui/react";
import { streamText } from "hono/streaming";
import {} from "react-icons/hi";
import { renderer } from "./renderer";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { Ai, Queue } from "@cloudflare/workers-types";
import {
  getAssetFromKV,
  serveSinglePageApp,
} from "@cloudflare/kv-asset-handler";
import { R2Bucket, D1Database } from "@cloudflare/workers-types";
import { HTTPResponseError } from "hono/types";



export declare type Bindings = {
  readonly CJQ: Queue;
  readonly CJO: DurableObjectNamespace;
  readonly AI: Ai;
  readonly KV: KVNamespace;
  readonly AE: AnalyticsEngineDataset;
  readonly ID: Vectorize;
  readonly R2: R2Bucket;
  readonly D1: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <div>
      <title>{c.req.path + " " + c.req.url}</title>

      <div className="flex h-screen bg-gray-100">
        <div
          className="flex-grow flex flex-col"
          style="max-width: calc(100% - 20rem)"
        >
          <div
            id="chat-history"
            className="transition-all duration-300 flex-1 overflow-y-auto p-6 space-y-4  flex flex-col-reverse messages-container animate-in slide-up animate-out slide-up "
          ></div>
          <div className="px-6 py-3 bg-white shadow-up border-slate-200  border-solid border-t">
            <form className="flex items-center" id="chat-form">
              <textarea
                id="message-input"
                  className="appearance-none border border-chat-border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 focus:border-green-500 focus:ring-green-500 placeholder-chat-placeholder caret-green-300 hover:bg-gray-100 focus:shadow-outline text-sm shadow-sm form-textarea decoration-green-300"
                placeholder="Type a message..."
              ></textarea>

              <button
                type="submit"
                className="m-2 px-4 py-2 bg-green-50 border-1 ring-1 ring-inset  border-green-500 ring-green-500 text-green-500  hover:bg-green-100 rounded text-sm"
              >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
Send

              </button>
            </form>
            <div className="text-xs text-gray-500 mt-2">
              <input
                type="hidden"
                class="form-input message-user message-assistant message-model transition-all duration-300 animate-in slide-in-from-right animate-out"
              />
              <p className="model-display transition-all duration-300 text-slate-400 font-regular animate-in animate-out fade-in fade-out">-</p>
            </div>
          </div>
        </div>
        <div className="w-80 bg-chat-settings p-6 flex flex-col justify-between border-slate-200 border border-solid">
          <div className="flex flex-col">
            <div className="mb-4 items-center ">

          <ol class="flex items-center whitespace-nowrap">
  <li class="inline-flex items-center">
    <a class="flex items-center  text-gray-500 stroke-green-500 hover:text-green-600 focus:outline-none focus:text-green-600 dark:text-neutral-500 dark:hover:text-green-500 dark:focus:text-green-500 text-xs" href="#">
      <svg class="shrink-0 me-2 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      Home
    </a>
    <svg class="shrink-0 mx-1 size-3 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  </li>
  <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">

  </div>

  <li class="inline-flex items-center">
    <a class="flex items-center text-xs text-gray-500 hover:text-green-600 focus:outline-none focus:text-green-600 dark:text-neutral-500 dark:hover:text-green-500 dark:focus:text-green-500" href="#">
      <svg class="shrink-0 mx-2 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="7" height="7" x="14" y="3" rx="1"></rect>
        <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path>
      </svg>
      App
      <svg class="shrink-0 mx-2 size-3 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </a>
  </li>
  <li class="inline-flex items-center text-xs font-semibold text-gray-800 truncate dark:text-neutral-200" aria-current="page">
    Chat
  </li>
</ol>
              <h1 className="text-xl font-extralight">
                ill.st</h1>
            <a href="https://ill.st" target="_blank">
              <span class="font-regular inline-flex items-center rounded-md bg-green-50 px-1 py-1 text-xs text-green-500 ring-1 ring-inset ring-green-500 hover:bg-green-100">
<span class="relative flex h-2 w-2  shadow mr-1">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
</span>
                chat 
                </span>
            </a>
              <p className="text-xs text-chat-helpertext mt-1">
                Try out different models!
              </p>
            </div>
            <form>
              <div className="mb-4 divide">
                <label className="uppercase block text-gray-500 text-xs font-semibold mb-2">
                  Model
                </label>
              <p className="text-xs text-chat-helpertext mt-0 mb-2">
                Try out different models!
              </p>
                <select data-hs-select='{
  "placeholder": "Select option...",
  "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
  "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-neutral-600",
  "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
  "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
  "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-green-600 dark:text-green-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
  "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
}' className=" focus:border-green-300 focus:ring-green-300 form-select border border-chat-border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline outline-none caret-green-300 "
id="model-select"
></select>
              </div>
              <div className="mb-4">
                <label className="uppercase block text-gray-500 text-xs font-semibold mb-2">
                  System Message
                </label>
                <p className="text-xs text-chat-helpertext mb-2">
                  Guides the tone of the response
                </p>
                <textarea
                  id="system-message"
                  className="appearance-none border border-chat-border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 focus:border-green-500 focus:ring-green-500 caret-green-300 hover:bg-gray-100 focus:shadow-outline text-sm"
                  placeholder="Enter system message..."
                ></textarea>
              </div>
              <button
                id="apply-chat-settings"
                type="submit"
                className="w-full px-4 py-2 bg-chat-apply bg-green-50 border-1 border-green-500 ring-green-500 text-green-500 hover:bg-green-100 focus:outline-none focus:shadow-outline rounded ring-1 ring-inset text-sm"
              >
                Apply
              </button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">

            <a href="https://ill.st" target="_blank">
              <span class="font-regular inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs text-green-400 ring-1 ring-inset ring-green-500 hover:bg-green-100">

<span class="relative flex h-2 w-2  shadow mr-1">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
</span>
                ill.st</span>
            </a>
          </div>
        </div>
      </div>
      <script src="/static/script.js"></script>
    </div>,
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

app.onError((err: Error | HTTPResponseError, c: Context<{ Bindings: Bindings }>) => {
  return c.json({ error: err.message }, 500)
})
export default app;

