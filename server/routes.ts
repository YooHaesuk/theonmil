import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReviewSchema, type InsertUser, type InsertReview, insertProductSchema, insertUserAddressSchema } from "@shared/schema";
import { checkCloudinaryConfig, uploadImage, deleteImage, getImageUrl } from "./cloudinary";
import multer from 'multer';
import nodemailer from 'nodemailer';

export function registerRoutes(app: Express): Server {
  // Cloudinary 설정 확인
  checkCloudinaryConfig();

  // Multer 설정 (메모리 저장)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB 제한
    },
    fileFilter: (req, file, cb) => {
      // 이미지 파일만 허용
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('이미지 파일만 업로드 가능합니다.'));
      }
    }
  });

  // Auth 상태 확인 API
  app.get("/api/auth/status", (req, res) => {
    res.json({
      message: "Better Auth를 사용합니다.",
      authProvider: "better-auth"
    });
  });

  // User Profile & Addresses
  app.patch("/api/users/profile", async (req, res) => {
    try {
      const { id, ...data } = req.body;
      if (!id) return res.status(400).json({ error: "User ID required" });
      const user = await storage.updateUser(id, data);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/users/addresses/:userId", async (req, res) => {
    try {
      const addresses = await storage.getUserAddresses(req.params.userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch addresses" });
    }
  });

  app.post("/api/users/addresses", async (req, res) => {
    try {
      const parsedData = insertUserAddressSchema.parse(req.body);
      const address = await storage.addAddress(parsedData as any);
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: "Failed to add address" });
    }
  });

  app.delete("/api/users/addresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAddress(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete address" });
    }
  });

  // Order routes
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrderById(parseInt(req.params.id));
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Admin routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/users/:id/role", async (req, res) => {
    try {
      const { role } = req.body;
      const user = await storage.updateUserRole(req.params.id, role);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const parsedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(parsedData as any);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const parsedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(parsedData as any);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const parsedData = insertProductSchema.parse(req.body);
      const product = await storage.insertProduct(parsedData as any);
      res.json({
        success: true,
        message: "상품이 성공적으로 등록되었습니다.",
        product
      });
    } catch (error) {
      res.status(500).json({
        error: "상품 등록에 실패했습니다.",
        message: error instanceof Error ? error.message : "알 수 없는 오류"
      });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      res.json({
        success: true,
        message: "상품이 성공적으로 수정되었습니다.",
        product
      });
    } catch (error) {
      res.status(500).json({
        error: "상품 수정에 실패했습니다.",
        message: error instanceof Error ? error.message : "알 수 없는 오류"
      });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true, message: "상품이 삭제되었습니다." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Store routes
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stores" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      authProvider: "better-auth"
    });
  });

  // 🖼️ 이미지 업로드 API
  app.post("/api/images/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
      }

      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await uploadImage(base64Image, {
        folder: 'theonmil-bakery/products',
        public_id: `product_${Date.now()}`
      });

      res.json({
        success: true,
        message: '이미지 업로드 성공',
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        }
      });
    } catch (error) {
      res.status(500).json({ error: '이미지 업로드 실패' });
    }
  });

  app.delete("/api/images/:public_id", async (req, res) => {
    try {
      const { public_id } = req.params;
      const result = await deleteImage(public_id);
      res.json({ success: result.success, public_id });
    } catch (error) {
      res.status(500).json({ error: '이미지 삭제 실패' });
    }
  });

  app.post("/api/images/url", async (req, res) => {
    try {
      const { public_id, width, height, quality, format } = req.body;
      const url = getImageUrl(public_id, { width, height, quality, format });
      res.json({ success: !!url, url, public_id });
    } catch (error) {
      res.status(500).json({ error: 'URL 생성 실패' });
    }
  });

  // 📧 SMTP 메일 전송 API
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html } = req.body;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || 'yhs85844@gmail.com',
          pass: process.env.SMTP_PASS || 'pvmwqkqjtrgctmwn'
        }
      });
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER || 'yhs85844@gmail.com',
        to, subject, html
      });
      res.json({ success: true, messageId: info.messageId });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
