import { autoTrimTools, createToolsFromOpenAPISpec, validateArgsWithZod, runWithTools, Parameter, fetchSpec, tool} from "@cloudflare/ai-utils"
import { getAssetFromKV, serveSinglePageApp, mapRequestToAsset} from "@cloudflare/kv-asset-handler"
import { Context, Hono } from "hono"
import { } from "hono/streaming"
import { H, HandlerResponse } from "hono/types"

const app = new Hono()

app.get("/", async (c: Context, handler: H<any, any, {}, HandlerResponse<any>>) => {
    const sum = (args: {a: number, b: number}): Promise<string> => {
        const {a, b} = args;
        return Promise.resolve(`${(a+b).toString()}`)
    }
    const r = await runWithTools(c.env.AI,
        "@hf/nousresearch/hermes-2-pro-mistral-7b", {
            messages: [
                {
                    role: "user",
                    content: "Hello, world!",
                }
            ],
            tools: [
                {
                    name: "sum",
                    description: "Sum two numbers",
                    parameters: {
                        type: "object",
                        properties: {
                            a: {
                                type: "number",
                                description: "The first number",
                            },
                            b: {
                                type: "number",
                                description: "The second number",
                            },
                        },
                        required: ["a", "b"],
                    },
                    function: sum,
                }
            ]
        }

        )
        return new Response(JSON.stringify(r))

},) 

export default app satisfies ExportedHandler<Env>;