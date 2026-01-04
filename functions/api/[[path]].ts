import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { getAuth } from "../../server/auth";
import { storage } from "../../server/storage";
import { setRuntimeEnv } from "../../server/lib/env";

const app = new Hono().basePath("/api");

// Global error handler for Hono
app.onError((err, c) => {
    console.error(`[Hono Edge Error]: ${err.message}`);
    const envKeys = c.env ? Object.keys(c.env).join(", ") : "none";
    return c.text(`Hono Edge Error:\nMessage: ${err.message}\nStack: ${err.stack}\nEnv Keys: ${envKeys}`, 500);
});

// Middleware to inject environment variables
app.use("*", async (c, next) => {
    setRuntimeEnv(c.env);
    await next();
});

// Better Auth - Request-scoped initialization
app.all("/auth/*", async (c) => {
    try {
        const authInstance = getAuth(c.env);
        console.log(`[Edge Auth Request]: ${c.req.method} ${c.req.path}`);
        const res = await authInstance.handler(c.req.raw);
        return res;
    } catch (error: any) {
        console.error(`[Auth Logic Error]: ${error.message}\nStack: ${error.stack}`);
        const envKeys = c.env ? Object.keys(c.env).join(", ") : "none";
        return c.text(`CRITICAL AUTH ERROR:\nMessage: ${error.message}\nStack: ${error.stack}\nEnv Keys: ${envKeys}`, 500);
    }
});

// --- User Profile & Addresses ---

// Get addresses for a specific user
app.get("/users/addresses/:userId", async (c) => {
    const userId = c.req.param("userId");
    const addresses = await storage.getUserAddresses(userId, c.env);
    return c.json(addresses);
});

// Get addresses (legacy/generic path)
app.get("/users/addresses", async (c) => {
    const auth = getAuth(c.env);
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const addresses = await storage.getUserAddresses(session.user.id, c.env);
    return c.json(addresses);
});

app.post("/users/addresses", async (c) => {
    const auth = getAuth(c.env);
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const body = await c.req.json();
    const address = await storage.addAddress({ ...body, userId: session.user.id }, c.env);
    return c.json(address);
});

app.patch("/api/users/profile", async (c) => {
    const body = await c.req.json();
    const { id, ...data } = body;
    if (!id) return c.json({ error: "User ID required" }, 400);
    const user = await storage.updateUser(id, data, c.env);
    return c.json(user);
});

app.delete("/users/addresses/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    await storage.deleteAddress(id, c.env);
    return c.json({ success: true });
});

// --- Orders ---

// Get orders by user ID
app.get("/orders/user/:userId", async (c) => {
    const userId = c.req.param("userId");
    const orders = await storage.getOrdersByUser(userId, c.env);
    return c.json(orders);
});

// Get specific order
app.get("/orders/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const order = await storage.getOrderById(id, c.env);
    if (!order) return c.json({ error: "Order not found" }, 404);
    return c.json(order);
});

// --- Products ---

app.get("/products", async (c) => {
    const products = await storage.getAllProducts(c.env);
    return c.json(products);
});

app.get("/products/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const product = await storage.getProduct(id, c.env);
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
});

// --- Stores ---

app.get("/stores", async (c) => {
    const stores = await storage.getStores(c.env);
    return c.json(stores);
});

// --- Reviews ---

app.get("/reviews", async (c) => {
    const reviews = await storage.getAllReviews(c.env);
    return c.json(reviews);
});

app.post("/reviews", async (c) => {
    const body = await c.req.json();
    const review = await storage.createReview(body, c.env);
    return c.json(review);
});

// --- Health Check ---

app.get("/health", async (c) => {
    try {
        const users = await storage.getUsers(c.env);
        return c.json({
            status: "ok",
            runtime: "cloudflare-pages",
            database: "connected (http)",
            userCount: users.length,
            envKeys: Object.keys(c.env || {}),
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return c.json({
            status: "error",
            database: "failed",
            error: error.message,
            envKeys: Object.keys(c.env || {}),
            timestamp: new Date().toISOString()
        }, 500);
    }
});

/**
 * Bare-Metal Entry Point Entry
 */
const honoHandler = handle(app);

export const onRequest = async (context: any) => {
    try {
        return await honoHandler(context);
    } catch (err: any) {
        console.error(`[Bare-Metal Crash]: ${err.message}`);
        return new Response(
            `BARE-METAL WORKER CRASH:\nMessage: ${err.message}\nStack: ${err.stack}\nEnv Keys: ${context.env ? Object.keys(context.env).join(", ") : "none"}`,
            {
                status: 500,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            }
        );
    }
};
