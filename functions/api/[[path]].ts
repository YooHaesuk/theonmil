import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { getAuth } from "../../server/auth";
import { storage } from "../../server/storage";
import { insertUserAddressSchema } from "../../shared/schema";
import { setRuntimeEnv } from "../../server/lib/env";

const app = new Hono().basePath("/api");

// Middleware to inject environment variables for Edge compatibility
app.use("*", async (c, next) => {
    // Inject c.env into our custom env utility and process.env polyfill
    setRuntimeEnv(c.env);
    await next();
});

// Error handling for better diagnostics in Cloudflare logs
app.onError((err, c) => {
    console.error(`[Edge API Error]: ${err.message}`);
    console.error(err.stack);
    return c.json({
        error: "Internal Server Error",
        message: err.message,
        path: c.req.path
    }, 500);
});

// Better Auth - Using getAuth() inside the handler call
app.all("/auth/*", (c) => {
    return getAuth().handler(c.req.raw);
});

// User Profile & Addresses
app.patch("/users/profile", async (c) => {
    try {
        const body = await c.req.json();
        const { id, ...data } = body;
        if (!id) return c.json({ error: "User ID required" }, 400);
        const user = await storage.updateUser(id, data);
        return c.json(user);
    } catch (error) {
        return c.json({ error: "Failed to update profile" }, 500);
    }
});

app.get("/users/addresses/:userId", async (c) => {
    const addresses = await storage.getUserAddresses(c.req.param("userId"));
    return c.json(addresses);
});

app.post("/users/addresses", async (c) => {
    try {
        const body = await c.req.json();
        const parsedData = insertUserAddressSchema.parse(body);
        const address = await storage.addAddress(parsedData);
        return c.json(address);
    } catch (error) {
        return c.json({ error: "Failed to add address" }, 500);
    }
});

app.delete("/users/addresses/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    await storage.deleteAddress(id);
    return c.json({ success: true });
});

// Orders
app.get("/orders/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const order = await storage.getOrderById(id);
    if (!order) return c.json({ error: "Order not found" }, 404);
    return c.json(order);
});

app.get("/orders/user/:userId", async (c) => {
    const orders = await storage.getOrdersByUser(c.req.param("userId"));
    return c.json(orders);
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

// Reviews
app.get("/reviews", async (c) => {
    const reviews = await storage.getAllReviews();
    return c.json(reviews);
});

// Health
app.get("/health", async (c) => {
    try {
        // Test database connection
        const usersCount = await storage.getUsers();
        return c.json({
            status: "ok",
            runtime: "cloudflare-pages",
            database: "connected",
            userCount: usersCount.length,
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
