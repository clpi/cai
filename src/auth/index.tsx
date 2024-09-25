import { Hono } from "hono";

const auth = new Hono();

auth.get("/login", (c) => {
    return c.text("Login");
})

export { auth };