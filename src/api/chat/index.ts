import { Context, Hono } from "hono"

export const api = new Hono()

api.post("/llama", async (c: Context) => {
    const resp = await c.env.AI.run(
        "@cf/meta/llama-3-8b-instruct", {
            messages: [
                {
                    role: "user",
                    content: `Hello, world!`
                }
            ]
        }
    )
    return new Response(JSON.stringify(resp))
})
