import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  reviews, type Review, type InsertReview
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Cart operations
  getCartItemsByUser(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(userId: number, productId: number, quantity: number): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  
  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  
  // Review operations
  getAllReviews(): Promise<(Review & { user: Pick<User, 'id' | 'username' | 'name'>, product: Pick<Product, 'id' | 'name' | 'nameKorean'> })[]>;
  getReviewsByProduct(productId: number): Promise<(Review & { user: Pick<User, 'id' | 'username' | 'name'> })[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private reviewIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.reviewIdCounter = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: "user", 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }
  
  // Cart operations
  async getCartItemsByUser(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId);
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product not found for cart item: ${item.id}`);
      }
      return { ...item, product };
    });
  }
  
  async addToCart(userId: number, productId: number, quantity: number): Promise<CartItem> {
    // Check if product exists
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }
    
    // Check if already in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.productId === productId
    );
    
    if (existingItem) {
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
    }
    
    // Add new cart item
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { id, userId, productId, quantity };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      throw new Error(`Cart item not found: ${id}`);
    }
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }
  
  // Order operations
  async createOrder(orderData: InsertOrder, itemsData: InsertOrderItem[]): Promise<Order> {
    const id = this.orderIdCounter++;
    const order: Order = {
      ...orderData,
      id,
      createdAt: new Date()
    };
    
    this.orders.set(id, order);
    
    // Create order items
    for (const itemData of itemsData) {
      const orderItemId = this.orderItemIdCounter++;
      const orderItem: OrderItem = {
        ...itemData,
        id: orderItemId,
        orderId: id
      };
      this.orderItems.set(orderItemId, orderItem);
    }
    
    return order;
  }
  
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getOrderById(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId);
        if (!product) {
          throw new Error(`Product not found for order item: ${item.id}`);
        }
        return { ...item, product };
      });
    
    return { ...order, items };
  }
  
  // Review operations
  async getAllReviews(): Promise<(Review & { user: Pick<User, 'id' | 'username' | 'name'>, product: Pick<Product, 'id' | 'name' | 'nameKorean'> })[]> {
    return Array.from(this.reviews.values()).map(review => {
      const user = this.users.get(review.userId);
      const product = this.products.get(review.productId);
      
      if (!user || !product) {
        throw new Error(`User or product not found for review: ${review.id}`);
      }
      
      return {
        ...review,
        user: {
          id: user.id,
          username: user.username,
          name: user.name
        },
        product: {
          id: product.id,
          name: product.name,
          nameKorean: product.nameKorean
        }
      };
    });
  }
  
  async getReviewsByProduct(productId: number): Promise<(Review & { user: Pick<User, 'id' | 'username' | 'name'> })[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.productId === productId)
      .map(review => {
        const user = this.users.get(review.userId);
        
        if (!user) {
          throw new Error(`User not found for review: ${review.id}`);
        }
        
        return {
          ...review,
          user: {
            id: user.id,
            username: user.username,
            name: user.name
          }
        };
      });
  }
  
  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = {
      ...reviewData,
      id,
      createdAt: new Date()
    };
    
    this.reviews.set(id, review);
    return review;
  }
  
  // Initialize with sample products
  private initializeProducts() {
    const sampleProducts: Omit<Product, 'id'>[] = [
      {
        name: 'Classic Croissant',
        nameKorean: '클래식 크로와상',
        description: '72시간 저온 발효로 완성한 바삭한 겉면과 부드러운 속',
        price: 4800,
        image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80',
        category: 'regular',
        tags: ['바삭함', '크로와상', '아침식사'],
        isBestseller: true,
        isNew: false,
        isPopular: false
      },
      {
        name: 'French Baguette',
        nameKorean: '프렌치 바게트',
        description: '국내산 밀과 천연 발효종으로 프랑스 정통 방식 재현',
        price: 5200,
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        category: 'regular',
        tags: ['바게트', '프랑스빵', '저녁식사'],
        isBestseller: false,
        isNew: false,
        isPopular: true
      },
      {
        name: 'Whole Wheat Bread',
        nameKorean: '통밀 식빵',
        description: '유기농 통밀과 꿀로 만든 건강한 식빵',
        price: 6800,
        image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=796&q=80',
        category: 'regular',
        tags: ['통밀', '건강빵', '샌드위치'],
        isBestseller: false,
        isNew: false,
        isPopular: false
      },
      {
        name: 'Special Chocolate Cake',
        nameKorean: '스페셜 초콜릿 케이크',
        description: '벨기에 초콜릿을 사용한 특별한 초콜릿 케이크',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80',
        category: 'custom',
        tags: ['케이크', '초콜릿', '생일'],
        isBestseller: false,
        isNew: false,
        isPopular: false
      },
      {
        name: 'Fresh Fruit Tart',
        nameKorean: '신선한 과일 타르트',
        description: '제철 과일로 장식한, 바닐라 커스터드가 가득한 타르트',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
        category: 'custom',
        tags: ['타르트', '과일', '디저트'],
        isBestseller: false,
        isNew: true,
        isPopular: false
      },
      {
        name: 'Anniversary Gift Set',
        nameKorean: '기념일 선물 세트',
        description: '특별한 날을 위한 케이크와 꽃, 메시지 카드가 포함된 선물 세트',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1901&q=80',
        category: 'gift',
        tags: ['선물', '케이크', '꽃', '기념일'],
        isBestseller: false,
        isNew: false,
        isPopular: false
      }
    ];
    
    sampleProducts.forEach(product => {
      const id = this.productIdCounter++;
      this.products.set(id, {
        ...product,
        id
      });
    });
  }
}

export const storage = new MemStorage();
