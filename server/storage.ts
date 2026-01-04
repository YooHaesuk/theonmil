import { getDb } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  reviews, type Review, type InsertReview,
  userAddresses, type UserAddress, type InsertUserAddress,
  sessions, accounts, verifications
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  insertProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Review operations
  createReview(review: any): Promise<Review>;
  getAllReviews(): Promise<Review[]>;

  // Address operations
  getUserAddresses(userId: string): Promise<UserAddress[]>;
  addAddress(address: InsertUserAddress): Promise<UserAddress>;
  deleteAddress(id: number): Promise<void>;

  // Order operations
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getStores(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await getDb().select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await getDb().select().from(users);
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    const [user] = await getDb()
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await getDb()
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await getDb().select().from(users).where(eq(users.name, username));
    return user;
  }

  async createUser(user: any): Promise<User> {
    const [newUser] = await getDb().insert(users).values(user).returning();
    return newUser;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await getDb().select().from(products).where(eq(products.id, id));
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return await getDb().select().from(products);
  }

  async insertProduct(product: any): Promise<Product> {
    const [newProduct] = await getDb().insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const [updatedProduct] = await getDb()
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    if (!updatedProduct) throw new Error("Product not found");
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await getDb().delete(products).where(eq(products.id, id));
  }

  async createReview(review: any): Promise<Review> {
    const [newReview] = await getDb().insert(reviews).values(review).returning();
    return newReview;
  }

  async getAllReviews(): Promise<Review[]> {
    return await getDb().select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    return await getDb().select().from(userAddresses).where(eq(userAddresses.userId, userId));
  }

  async addAddress(address: InsertUserAddress): Promise<UserAddress> {
    const [newAddress] = await getDb().insert(userAddresses).values(address).returning();
    return newAddress;
  }

  async deleteAddress(id: number): Promise<void> {
    await getDb().delete(userAddresses).where(eq(userAddresses.id, id));
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await getDb().select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await getDb()
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getStores(): Promise<any[]> {
    return [
      { id: 1, name: "강남점", address: "서울특별시 강남구 테헤란로 123", phone: "02-123-4567" },
      { id: 2, name: "성수점", address: "서울특별시 성동구 아차산로 456", phone: "02-456-7890" },
      { id: 3, name: "잠실점", address: "서울특별시 송파구 올림픽로 789", phone: "02-789-0123" },
      { id: 4, name: "홍대점", address: "서울특별시 마포구 양화로 101", phone: "02-101-2345" }
    ];
  }
}

export const storage = new DatabaseStorage();
