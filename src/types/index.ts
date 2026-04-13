// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string | number
  disabled?: boolean
  external?: boolean
}

export interface NavGroup {
  title?: string
  items: NavItem[]
}

// ─── KPI / Stats ─────────────────────────────────────────────────────────────

export interface StatCard {
  id: string
  title: string
  value: string
  rawValue: number
  change: number
  changeLabel: string
  icon: string
  trend: "up" | "down" | "neutral"
  sparkline: number[]
  prefix?: string
  suffix?: string
}

// ─── Charts ──────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  date: string
  [key: string]: string | number
}

export interface DonutSegment {
  name: string
  value: number
  color: string
}

// ─── Deliveries ─────────────────────────────────────────────────────────────

export type DeliveryStatus = "in_transit" | "delivered" | "pending" | "failed" | "returned"
export type DeliveryPriority = "standard" | "express" | "same_day" | "next_day"

export interface Delivery {
  id: string
  trackingNumber: string
  date: string
  customer: string
  customerEmail: string
  origin: string
  destination: string
  status: DeliveryStatus
  priority: DeliveryPriority
  driver: string
  driverPhone: string
  eta: string
  actualDeliveryTime?: string
  weight: number // in kg
  dimensions: string
  value: number // package value in £
  notes?: string
}

// ─── Drivers ─────────────────────────────────────────────────────────────────

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  vehicleType: "van" | "truck" | "motorcycle" | "bicycle"
  licensePlate: string
  status: "active" | "on_break" | "off_duty"
  currentDeliveries: number
  todayDeliveries: number
  onTimeRate: number
  avgDeliveryTime: number // in minutes
  location: {
    lat: number
    lng: number
    address: string
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export interface Route {
  id: string
  driverId: string
  driverName: string
  date: string
  deliveries: string[] // delivery IDs
  startTime: string
  estimatedEndTime: string
  actualEndTime?: string
  totalDistance: number // in miles
  efficiency: number // percentage
  status: "planned" | "in_progress" | "completed" | "cancelled"
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "editor" | "viewer" | "billing"
export type UserStatus = "active" | "inactive" | "pending" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  joinedAt: string
  lastSeen: string
  plan: "starter" | "pro" | "enterprise"
  revenue: number
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface PageAnalytics extends Record<string, string | number> {
  path: string
  title: string
  views: number
  uniqueVisitors: number
  avgDuration: number
  bounceRate: number
  change: number
}

export interface TrafficSource {
  source: string
  visitors: number
  percentage: number
  change: number
}

export interface DailyAnalytics extends Record<string, string | number> {
  date: string
  pageViews: number
  uniqueVisitors: number
  sessions: number
  bounceRate: number
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export type ActivityType =
  | "delivery_dispatched"
  | "delivery_completed"
  | "delivery_failed"
  | "route_optimized"
  | "driver_assigned"
  | "package_picked_up"
  | "delivery_delayed"
  | "customer_notification"
  | "exception_reported"
  | "driver_break"

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  driver?: {
    name: string
    avatar?: string
  }
  delivery?: {
    trackingNumber: string
    customer: string
  }
  metadata?: Record<string, string | number>
}

// ─── Global App State ─────────────────────────────────────────────────────────

export interface AppState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  commandMenuOpen: boolean
  setCommandMenuOpen: (open: boolean) => void
}
