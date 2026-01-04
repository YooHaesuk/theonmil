import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { getAuth } from "../../server/auth";
import { storage } from "../../server/storage";
import { setRuntimeEnv } from "../../server/lib/env";

const app = new Hono().basePath("/api");

// Global error handler - Move to top for maximum coverage
app.onError((err, c) => {
    console.error(`[Critical Edge Error]: ${err.message}`);
    return c.text(`Global Edge Error:\nMessage: ${err.message}\nStack: ${err.stack}`, 500);
});

// Middleware to inject environment variables at the start of every request
app.use("*", async (c, next) => {
    try {
        setRuntimeEnv(c.env);
    } catch (e: any) {
        console.error(`[Runtime Env Injection Failed]: ${e.message}`);
    }
    await next();
});

// Better Auth - Request-scoped initialization
app.all("/auth/*", async (c) => {
    try {
        const authInstance = getAuth(c.env);
        const res = await authInstance.handler(c.req.raw);
        return res;
    } catch (error: any) {
        console.error(`[Edge Auth Error]: ${error.message}`);
        // Diagnostic Mode: Surfacing the error reveals the hidden reason for 1101
        return c.text(`Authentication Crash Diagnostic:\nMessage: ${error.message}\nStack: ${error.stack}`, 500);
    }
});

// User Profile & Addresses
app.get("/user/addresses", async (c) => {
    const session = await getAuth(c.env).api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const addresses = await storage.getUserAddresses(session.user.id);
    return c.json(addresses);
});

app.post("/user/addresses", async (c) => {
    const session = await getAuth(c.env).api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const body = await c.req.json();
    const address = await storage.addAddress({ ...body, userId: session.user.id });
    return c.json(address);
});

app.delete("/user/addresses/:id", async (c) => {
    const session = await getAuth(c.env).api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: "Unauthorized" }, 401);
    const id = parseInt(c.req.param("id"));
    await storage.deleteAddress(id);
    return c.json({ success: true });
});

// Products
app.get("/products", async (c) => {
    const products = await storage.getAllProducts();
    return c.json(products);
});

app.get("/products/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const product = await storage.getProduct(id);
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
});

// Stores
app.get("/stores", async (c) => {
    const stores = await storage.getStores();
    return c.json(stores);
});

// Reviews
app.get("/reviews", async (c) => {
    const reviews = await storage.getAllReviews();
    return c.json(reviews);
});

app.post("/reviews", async (c) => {
    const body = await c.req.json();
    const review = await storage.createReview(body);
    return c.json(review);
});

// Health Check - Verify database connection in production
app.get("/health", async (c) => {
    try {
        const users = await storage.getUsers();
        return c.json({
            status: "ok",
            runtime: "cloudflare-pages",
            database: "connected",
            userCount: users.length,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return c.json({
            status: "error",
            database: "failed",
            error: error.message,
            timestamp: new Date().toISOString()
        }, 500);
    }
});

export const onRequest = handle(app);
