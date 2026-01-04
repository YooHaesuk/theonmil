import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  reviews, type Review, type InsertReview,
  userAddresses, type UserAddress, type InsertUserAddress
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  insertProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Cart operations
  getCartItemsByUser(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(userId: string, productId: number, quantity: number): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;

  // Review operations
  getAllReviews(): Promise<any[]>;
  getReviewsByProduct(productId: number): Promise<any[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Address operations
  getUserAddresses(userId: string): Promise<UserAddress[]>;
  addAddress(address: InsertUserAddress): Promise<UserAddress>;
  updateAddress(id: number, address: Partial<InsertUserAddress>): Promise<UserAddress>;
  deleteAddress(id: number): Promise<void>;

  // Aliases for routes.ts compatibility
  insertUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  insertReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<any[]>;
  getStores(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async insertUser(user: InsertUser): Promise<User> {
    return this.createUser(user);
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async insertProduct(product: InsertProduct): Promise<Product> {
    const [newItem] = await db.insert(products).values(product).returning();
    return newItem;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedItem] = await db.update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedItem;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Cart operations
  async getCartItemsByUser(userId: string): Promise<(CartItem & { product: Product })[]> {
    const results = await db.select({
      cartItem: cartItems,
      product: products
    })
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .innerJoin(products, eq(cartItems.productId, products.id));

    return results.map(r => ({ ...r.cartItem, product: r.product }));
  }

  async addToCart(userId: string, productId: number, quantity: number): Promise<CartItem> {
    const [item] = await db.insert(cartItems).values({
      userId,
      productId,
      quantity
    } as InsertCartItem).returning();
    return item;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const [item] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  // Order operations
  async createOrder(orderData: InsertOrder, itemsData: InsertOrderItem[]): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();

    for (const item of itemsData) {
      await db.insert(orderItems).values({ ...item, orderId: order.id });
    }

    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select({
      orderItem: orderItems,
      product: products
    })
      .from(orderItems)
      .where(eq(orderItems.orderId, id))
      .innerJoin(products, eq(orderItems.productId, products.id));

    return {
      ...order,
      items: items.map(i => ({ ...i.orderItem, product: i.product }))
    };
  }

  // Review operations
  async getAllReviews(): Promise<any[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async getReviewsByProduct(productId: number): Promise<any[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async insertReview(review: InsertReview): Promise<Review> {
    return this.createReview(review);
  }

  async getReviews(): Promise<any[]> {
    return this.getAllReviews();
  }

  // Address operations
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    return await db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
  }

  async addAddress(address: InsertUserAddress): Promise<UserAddress> {
    const [newItem] = await db.insert(userAddresses).values(address).returning();
    return newItem;
  }

  async updateAddress(id: number, address: Partial<InsertUserAddress>): Promise<UserAddress> {
    const [updatedItem] = await db.update(userAddresses).set(address).where(eq(userAddresses.id, id)).returning();
    return updatedItem;
  }

  async deleteAddress(id: number): Promise<void> {
    await db.delete(userAddresses).where(eq(userAddresses.id, id));
  }

  async getStores(): Promise<any[]> {
    return [];
  }
}

export const storage = new DatabaseStorage();
