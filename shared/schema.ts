import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  detailAddress: text("detail_address"),
  zipCode: text("zip_code"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameKorean: text("name_korean").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  isBestseller: boolean("is_bestseller").default(false),
  isNew: boolean("is_new").default(false),
  isPopular: boolean("is_popular").default(false),
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"),
  total: integer("total").notNull(),
  shippingAddress: text("shipping_address"),
  shippingDetailAddress: text("shipping_detail_address"),
  shippingZipCode: text("shipping_zip_code"),
  recipientName: text("recipient_name"),
  recipientPhone: text("recipient_phone"),
  message: text("message"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);

export const insertProductSchema = createInsertSchema(products);

export const insertCartItemSchema = createInsertSchema(cartItems);

export const insertOrderSchema = createInsertSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems);

export const insertReviewSchema = createInsertSchema(reviews);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
