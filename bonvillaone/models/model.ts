import mongoose, { Schema, Document, Types, model, models } from "mongoose";

/* ═══════════════════════════
   DATABASE CONNECTION
═══════════════════════════ */
let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

/* ═══════════════════════════
   CATEGORY
═══════════════════════════ */
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string; // single thumbnail for CategoryStrip
  heroImages: string[]; // 1 = static hero, 2+ = carousel
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    imageUrl: { type: String },
    heroImages: [{ type: String }], // Firebase URLs
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

/* ═══════════════════════════
   PRODUCT
═══════════════════════════ */
export interface IColorVariant {
  name: string;
  hex: string;
  images: string[];
  stock: number;
}
export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  description: string;
  tagline?: string;
  originalPrice: number;
  discountedPrice: number;
  badge?: "Bestseller" | "New" | "Sale";
  sizes: string[];
  colorVariants: IColorVariant[];
  features: string[];
  rating: number;
  reviewCount: number;
  totalOrders: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ColorVariantSchema = new Schema<IColorVariant>(
  {
    name: String,
    hex: String,
    images: [String],
    stock: { type: Number, default: 0 },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    tagline: { type: String },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    badge: { type: String, enum: ["Bestseller", "New", "Sale"] },
    sizes: [String],
    colorVariants: [ColorVariantSchema],
    features: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
ProductSchema.index({ totalOrders: -1 });
ProductSchema.index({ category: 1, isActive: 1 });
export const Product =
  models.Product || model<IProduct>("Product", ProductSchema);

/* ═══════════════════════════
   ORDER
═══════════════════════════ */
export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}
export interface IOrder extends Document {
  orderNumber: string;
  user?: Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    postCode: string;
    country: string;
  };
  paymentRef?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    color: String,
    size: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
  },
  { _id: false },
);
const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: String,
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    shippingAddress: {
      fullName: String,
      line1: String,
      line2: String,
      city: String,
      postCode: String,
      country: String,
    },
    paymentRef: String,
    notes: String,
  },
  { timestamps: true },
);
export const Order = models.Order || model<IOrder>("Order", OrderSchema);

/* ═══════════════════════════
   USER
═══════════════════════════ */
export interface IActivity {
  type: "login" | "view_product" | "add_to_cart" | "purchase" | "wishlist";
  ref?: string;
  timestamp: Date;
  ip?: string;
}
export interface IUser extends Document {
  email: string;
  name: string;
  role: "customer" | "admin" | "super_admin";
  passwordHash?: string;
  provider?: string;
  wishlist: Types.ObjectId[];
  totalSpend: number;
  orderCount: number;
  activity: IActivity[];
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ["login", "view_product", "add_to_cart", "purchase", "wishlist"],
      required: true,
    },
    ref: String,
    timestamp: { type: Date, default: Date.now },
    ip: String,
  },
  { _id: false },
);
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["customer", "admin", "super_admin"],
      default: "customer",
    },
    passwordHash: { type: String, select: false },
    provider: String,
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    totalSpend: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    activity: { type: [ActivitySchema], default: [] },
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const User = models.User || model<IUser>("User", UserSchema);

/* ═══════════════════════════
   PAGE BLOCK TYPES
   The building blocks for all editable pages.
═══════════════════════════ */

/**
 * Block types and their value shapes:
 *
 * hero        → { heading, subtext, images: string[], label? }
 * heading     → { text }
 * subheading  → { text }  (section-label style)
 * body        → { text }  (richtext, rendered as <p>)
 * image_grid  → { title?, caption?, images: string[] }
 * features    → { items: [{title, sub}] }  (the 3-col feature strip)
 * cta         → { label, href }
 * divider     → {}
 */
export type BlockType =
  | "hero"
  | "heading"
  | "subheading"
  | "body"
  | "image_grid"
  | "features"
  | "cta"
  | "divider";

export interface IPageBlock {
  _id?: string;
  type: BlockType;
  order: number;
  value: Record<string, unknown>; // flexible JSON per block type
}

/* ═══════════════════════════
   SITE PAGE (page builder)
   One document per editable page (both built-in and custom).
═══════════════════════════ */
export interface ISitePage extends Document {
  slug: string; // url slug — e.g. "about", "meet-the-team"
  title: string; // display title shown in CMS sidebar
  kind: "builtin" | "custom";
  // For built-in pages we keep simple key/value blocks for the
  // existing fields (hero_headline, etc.) alongside rich blocks.
  simpleBlocks: {
    key: string;
    label: string;
    type: "text" | "richtext" | "image";
    value: string;
  }[];
  // For both built-in and custom pages, rich page-builder blocks:
  blocks: IPageBlock[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SimpleBlockSchema = new Schema(
  {
    key: String,
    label: String,
    type: { type: String, enum: ["text", "richtext", "image"] },
    value: { type: String, default: "" },
  },
  { _id: false },
);
const PageBlockSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "hero",
        "heading",
        "subheading",
        "body",
        "image_grid",
        "features",
        "cta",
        "divider",
      ],
      required: true,
    },
    order: { type: Number, default: 0 },
    value: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true },
);
const SitePageSchema = new Schema<ISitePage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    kind: { type: String, enum: ["builtin", "custom"], default: "custom" },
    simpleBlocks: [SimpleBlockSchema],
    blocks: [PageBlockSchema],
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export const SitePage =
  models.SitePage || model<ISitePage>("SitePage", SitePageSchema);

/* ═══════════════════════════
   NAV LINK
   Header & footer dynamic links managed by admins.
═══════════════════════════ */
export interface INavLink extends Document {
  label: string;
  href: string;
  placement: "header" | "footer_shop" | "footer_company" | "footer_help";
  order: number;
  isActive: boolean;
}
const NavLinkSchema = new Schema<INavLink>(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    placement: {
      type: String,
      enum: ["header", "footer_shop", "footer_company", "footer_help"],
      required: true,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const NavLink =
  models.NavLink || model<INavLink>("NavLink", NavLinkSchema);
