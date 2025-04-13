import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all with /api
  
  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const parsedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(parsedData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ message: "User created successfully", user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Failed to create user", error: String(error) });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ message: "Login successful", user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error: String(error) });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let products;
      
      if (category) {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllProducts();
      }
      
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error: String(error) });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product", error: String(error) });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      let reviews;
      
      if (productId) {
        reviews = await storage.getReviewsByProduct(productId);
      } else {
        reviews = await storage.getAllReviews();
      }
      
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error: String(error) });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const parsedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(parsedData);
      res.status(201).json({ message: "Review created successfully", review });
    } catch (error) {
      res.status(400).json({ message: "Failed to create review", error: String(error) });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const cartItems = await storage.getCartItemsByUser(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items", error: String(error) });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: "User ID, product ID, and quantity are required" });
      }
      
      const cartItem = await storage.addToCart(userId, productId, quantity);
      res.status(201).json({ message: "Item added to cart", cartItem });
    } catch (error) {
      res.status(400).json({ message: "Failed to add item to cart", error: String(error) });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      await storage.removeFromCart(id);
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart", error: String(error) });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
