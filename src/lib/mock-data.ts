import { subDays, subMonths, format, subHours, subMinutes, addHours, addMinutes } from "date-fns"
import type {
  Delivery,
  Driver,
  Route,
  User,
  ActivityItem,
  DailyAnalytics,
  PageAnalytics,
  TrafficSource,
  DonutSegment,
} from "@/types"

// ─── Seeded random for reproducibility ────────────────────────────────────────

function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rng = seededRng(42)
const rand = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
const randFloat = (min: number, max: number) => Number((rng() * (max - min) + min).toFixed(2))
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)]

// ─── Delivery data (30 days) ──────────────────────────────────────────────────

export function generateDeliveryData() {
  const months = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return format(date, "MMM d")
  })

  return months.map((month, i) => {
    const base = 85 + Math.sin(i / 5) * 15 // Seasonal variation
    const completed = base + rand(-8, 12)
    return {
      date: month,
      completed,
      attempted: completed + rand(2, 8),
      failed: rand(0, 4),
    }
  })
}

// ─── Daily analytics (30 days) ────────────────────────────────────────────────

export function generateDailyAnalytics(): DailyAnalytics[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const base = 3200 + i * 180
    return {
      date: format(date, "MMM d"),
      pageViews: base + rand(-400, 600),
      uniqueVisitors: Math.floor((base + rand(-400, 600)) * 0.68),
      sessions: Math.floor((base + rand(-400, 600)) * 0.82),
      bounceRate: randFloat(32, 58),
    }
  })
}

// ─── Donut chart — delivery status ───────────────────────────────────────────

export const DELIVERY_STATUS: DonutSegment[] = [
  { name: "In Transit", value: 342, color: "#3b82f6" },
  { name: "Delivered", value: 423, color: "#10b981" },
  { name: "Pending", value: 67, color: "#f59e0b" },
  { name: "Failed", value: 12, color: "#ef4444" },
  { name: "Returned", value: 3, color: "#8b5cf6" },
]

// ─── UK Customers & Addresses ─────────────────────────────────────────────────

const UK_CUSTOMERS = [
  { name: "Tesco Express", email: "deliveries@tesco.com" },
  { name: "John Lewis Partnership", email: "logistics@johnlewis.co.uk" },
  { name: "Marks & Spencer", email: "supply@marksandspencer.com" },
  { name: "ASDA Stores", email: "receiving@asda.co.uk" },
  { name: "Sainsbury's", email: "distribution@sainsburys.co.uk" },
  { name: "Boots UK", email: "pharmacy@boots.co.uk" },
  { name: "Next plc", email: "fulfilment@next.co.uk" },
  { name: "Currys PC World", email: "warehouse@currys.co.uk" },
  { name: "Argos", email: "collections@argos.co.uk" },
  { name: "B&Q", email: "trade@diy.com" },
  { name: "Wickes", email: "builders@wickes.co.uk" },
  { name: "IKEA UK", email: "delivery@ikea.co.uk" },
  { name: "Amazon Warehouse", email: "uk.logistics@amazon.co.uk" },
  { name: "DHL Supply Chain", email: "operations@dhl.co.uk" },
  { name: "Screwfix", email: "tradecounter@screwfix.com" },
]

const UK_ORIGINS = [
  "Distribution Centre, Daventry, Northamptonshire NN11 8YB",
  "Fulfillment Hub, Milton Keynes, Buckinghamshire MK15 8FH",
  "Warehouse Complex, Swindon, Wiltshire SN5 8YZ",
  "Logistics Park, Peterborough, Cambridgeshire PE2 6FZ",
  "Supply Chain Centre, Coventry, West Midlands CV6 6AS",
  "Main Depot, Dartford, Kent DA1 1DN",
  "Regional Hub, Tamworth, Staffordshire B77 4PN",
  "Central Warehouse, Ashford, Kent TN24 0SD",
]

const UK_DESTINATIONS = [
  "142 King's Road, Chelsea, London SW3 4XP",
  "78 Deansgate, Manchester M3 2FW",
  "23 Princes Street, Edinburgh EH2 2AN",
  "91 Queen Street, Cardiff CF10 2GN",
  "156 Corporation Street, Birmingham B4 6TB",
  "45 Bold Street, Liverpool L1 4EU",
  "67 Park Street, Bristol BS1 5PB",
  "189 Briggate, Leeds LS1 6LY",
  "234 Grainger Street, Newcastle NE1 1JJ",
  "89 Buchanan Street, Glasgow G1 3HF",
  "123 High Street, Nottingham NG1 2GA",
  "67 Commercial Road, Bournemouth BH2 5RT",
  "45 Duke Street, Brighton BN1 1AG",
  "178 Friargate, Preston PR1 2EJ",
  "234 High Street, Exeter EX4 3LL",
  "89 Union Street, Aberdeen AB11 6BD",
  "156 Commercial Street, Dundee DD1 2AJ",
  "78 Castle Street, Swansea SA1 1JF",
  "234 Victoria Street, Wolverhampton WV1 3AU",
  "123 Market Street, Huddersfield HD1 2EX",
]

// ─── UK Driver Names ──────────────────────────────────────────────────────────

const UK_FIRST_NAMES = [
  "James", "Oliver", "William", "Henry", "George", "Charlie", "Jack", "Jacob",
  "Thomas", "Oscar", "Harry", "Alfie", "Joshua", "Freddie", "Archie", "Ethan",
  "Emily", "Amelia", "Isla", "Ava", "Mia", "Isabella", "Sophia", "Grace",
  "Lily", "Freya", "Evie", "Ella", "Charlotte", "Poppy", "Harper", "Chloe",
]
const UK_SURNAMES = [
  "Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Johnson", "Davies",
  "Robinson", "Wright", "Thompson", "Evans", "Walker", "White", "Roberts", "Green",
  "Hall", "Wood", "Jackson", "Clarke", "Patel", "Khan", "Lewis", "James", "Phillips",
  "Mason", "Mitchell", "Rose", "Davis", "Parker", "Adams", "Campbell", "Anderson",
]

const VEHICLE_TYPES: Driver["vehicleType"][] = ["van", "van", "truck", "motorcycle", "bicycle"]
const DRIVER_STATUSES: Driver["status"][] = ["active", "active", "active", "on_break", "off_duty"]

// ─── Deliveries ──────────────────────────────────────────────────────────────

const STATUSES: Delivery["status"][] = [
  "in_transit", "in_transit", "delivered", "delivered", "delivered",
  "pending", "failed", "returned"
]
const PRIORITIES: Delivery["priority"][] = [
  "standard", "standard", "express", "next_day", "same_day"
]

export function generateDeliveries(count = 50): Delivery[] {
  const drivers = generateDrivers(25)

  return Array.from({ length: count }, (_, i) => {
    const customer = pick(UK_CUSTOMERS)
    const driver = pick(drivers)
    const daysAgo = rand(0, 7)
    const hoursAgo = rand(0, 23)
    const status = pick(STATUSES)
    const baseDate = subDays(new Date(), daysAgo)
    const deliveryDate = subHours(baseDate, hoursAgo)

    // Generate ETA based on status
    let eta = ""
    if (status === "in_transit" || status === "pending") {
      const etaTime = addHours(deliveryDate, rand(1, 8))
      eta = format(etaTime, "HH:mm")
    }

    return {
      id: `DEL-${String(50000 + i).padStart(6, "0")}`,
      trackingNumber: `CL${rand(100000, 999999)}${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))}`,
      date: format(deliveryDate, "yyyy-MM-dd"),
      customer: customer.name,
      customerEmail: customer.email,
      origin: pick(UK_ORIGINS),
      destination: pick(UK_DESTINATIONS),
      status,
      priority: pick(PRIORITIES),
      driver: driver.name,
      driverPhone: driver.phone,
      eta,
      actualDeliveryTime: status === "delivered" ? format(addMinutes(deliveryDate, rand(30, 480)), "HH:mm") : undefined,
      weight: randFloat(0.5, 25.0),
      dimensions: `${rand(10, 80)}×${rand(10, 60)}×${rand(5, 40)}cm`,
      value: randFloat(15.99, 2499.99),
      notes: rand(0, 10) < 2 ? pick([
        "Fragile - Handle with care",
        "Signature required",
        "Leave with neighbour if not in",
        "Ring doorbell twice",
        "Heavy item - 2 person lift",
      ]) : undefined,
    }
  })
}

// ─── Drivers ──────────────────────────────────────────────────────────────────

export function generateDrivers(count = 25): Driver[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = pick(UK_FIRST_NAMES)
    const lastName = pick(UK_SURNAMES)
    const vehicleType = pick(VEHICLE_TYPES)

    const generateLicensePlate = () => {
      const letters1 = String.fromCharCode(65 + rand(0, 25), 65 + rand(0, 25))
      const numbers = String(rand(10, 99))
      const letters2 = String.fromCharCode(65 + rand(0, 25), 65 + rand(0, 25), 65 + rand(0, 25))
      return `${letters1}${numbers} ${letters2}`
    }

    return {
      id: `DRV-${String(1000 + i).padStart(5, "0")}`,
      name: `${firstName} ${lastName}`,
      phone: `07${rand(100000000, 999999999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@courier-logistics.co.uk`,
      vehicleType,
      licensePlate: generateLicensePlate(),
      status: pick(DRIVER_STATUSES),
      currentDeliveries: rand(0, 8),
      todayDeliveries: rand(5, 25),
      onTimeRate: randFloat(85.5, 98.9),
      avgDeliveryTime: rand(25, 65),
      location: {
        lat: randFloat(50.1, 55.8), // UK latitude range
        lng: randFloat(-6.2, 1.8),   // UK longitude range
        address: pick(UK_DESTINATIONS),
      }
    }
  })
}

// ─── Users ────────────────────────────────────────────────────────────────────

const ROLES: User["role"][] = ["admin", "editor", "viewer", "billing"]
const STATUSES_USER: User["status"][] = ["active", "active", "active", "inactive", "pending"]
const PLANS: User["plan"][] = ["starter", "pro", "pro", "enterprise"]

export function generateUsers(count = 30): User[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(UK_FIRST_NAMES)
    const last = pick(UK_SURNAMES)
    return {
      id: `USR-${String(1000 + i).padStart(5, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@courier-logistics.co.uk`,
      role: pick(ROLES),
      status: pick(STATUSES_USER),
      joinedAt: format(subMonths(new Date(), rand(1, 24)), "yyyy-MM-dd"),
      lastSeen: format(subHours(new Date(), rand(0, 168)), "yyyy-MM-dd'T'HH:mm:ss"),
      plan: pick(PLANS),
      revenue: randFloat(500, 48000),
    }
  })
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function generateActivityFeed(count = 12): ActivityItem[] {
  const drivers = generateDrivers(10)
  const deliveries = generateDeliveries(20)

  const events: Array<{
    type: ActivityItem["type"]
    title: string
    desc: string
  }> = [
    { type: "delivery_completed", title: "Delivery completed", desc: `Package delivered to Tesco Express by ${pick(drivers).name}` },
    { type: "delivery_dispatched", title: "Delivery dispatched", desc: `${pick(deliveries).trackingNumber} dispatched from Daventry hub` },
    { type: "route_optimized", title: "Route optimized", desc: `Manchester route updated - 15% efficiency improvement` },
    { type: "delivery_failed", title: "Delivery failed", desc: `Customer not available at 142 King's Road - rescheduled` },
    { type: "driver_assigned", title: "Driver assigned", desc: `${pick(drivers).name} assigned to Birmingham route` },
    { type: "package_picked_up", title: "Package picked up", desc: `Collection completed from John Lewis Partnership` },
    { type: "delivery_delayed", title: "Delivery delayed", desc: `Traffic incident on M25 - 30min delay expected` },
    { type: "customer_notification", title: "Customer notified", desc: `SMS sent to customer for delivery window 14:00-16:00` },
    { type: "exception_reported", title: "Exception reported", desc: `Address not found - customer contacted for clarification` },
    { type: "driver_break", title: "Driver break", desc: `${pick(drivers).name} started mandatory 45min break` },
    { type: "delivery_completed", title: "Delivery completed", desc: `Express delivery to Edinburgh completed on time` },
    { type: "route_optimized", title: "Route optimized", desc: `AI optimization reduced London route by 12 miles` },
  ]

  return events.slice(0, count).map((e, i) => ({
    id: `ACT-${i + 1}`,
    type: e.type,
    title: e.title,
    description: e.desc,
    timestamp: format(subMinutes(new Date(), i * 18 + rand(2, 15)), "yyyy-MM-dd'T'HH:mm:ss"),
    driver: rand(0, 10) < 7 ? {
      name: pick(drivers).name,
    } : undefined,
    delivery: rand(0, 10) < 5 ? {
      trackingNumber: pick(deliveries).trackingNumber,
      customer: pick(UK_CUSTOMERS).name,
    } : undefined,
  }))
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export function generateRoutes(count = 15): Route[] {
  const drivers = generateDrivers(25)
  const deliveries = generateDeliveries(100)

  return Array.from({ length: count }, (_, i) => {
    const driver = drivers[i % drivers.length]
    const routeDate = subDays(new Date(), rand(0, 7))
    const startTime = format(addHours(routeDate, 8 + rand(0, 2)), "HH:mm")
    const status = pick(["planned", "in_progress", "completed", "cancelled"] as Route["status"][])

    return {
      id: `RTE-${String(2000 + i).padStart(5, "0")}`,
      driverId: driver.id,
      driverName: driver.name,
      date: format(routeDate, "yyyy-MM-dd"),
      deliveries: deliveries.slice(i * 4, (i * 4) + rand(3, 8)).map(d => d.id),
      startTime,
      estimatedEndTime: format(addHours(routeDate, 8 + rand(6, 10)), "HH:mm"),
      actualEndTime: status === "completed" ? format(addHours(routeDate, 8 + rand(6, 11)), "HH:mm") : undefined,
      totalDistance: randFloat(45.2, 185.7),
      efficiency: randFloat(78.5, 96.8),
      status,
    }
  })
}

// ─── Page analytics ──────────────────────────────────────────────────────────

export const PAGE_ANALYTICS: PageAnalytics[] = [
  { path: "/dashboard", title: "Dashboard Overview", views: 24830, uniqueVisitors: 18420, avgDuration: 287, bounceRate: 22.4, change: 12.3 },
  { path: "/analytics", title: "Analytics", views: 18640, uniqueVisitors: 14290, avgDuration: 342, bounceRate: 18.7, change: 28.1 },
  { path: "/settings", title: "Settings", views: 12310, uniqueVisitors: 9840, avgDuration: 198, bounceRate: 31.2, change: -4.3 },
  { path: "/users", title: "User Management", views: 9870, uniqueVisitors: 7620, avgDuration: 412, bounceRate: 15.8, change: 18.9 },
  { path: "/billing", title: "Billing & Plans", views: 7430, uniqueVisitors: 5890, avgDuration: 264, bounceRate: 27.3, change: 6.4 },
  { path: "/reports", title: "Reports", views: 5820, uniqueVisitors: 4710, avgDuration: 518, bounceRate: 11.2, change: 41.7 },
  { path: "/integrations", title: "Integrations", views: 4290, uniqueVisitors: 3480, avgDuration: 334, bounceRate: 24.6, change: 15.2 },
  { path: "/api-keys", title: "API Keys", views: 3140, uniqueVisitors: 2820, avgDuration: 156, bounceRate: 38.9, change: -9.1 },
]

// ─── Traffic sources ──────────────────────────────────────────────────────────

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: "Organic Search", visitors: 38420, percentage: 42.3, change: 18.4 },
  { source: "Direct", visitors: 21840, percentage: 24.1, change: 7.2 },
  { source: "Referral", visitors: 14290, percentage: 15.7, change: 32.8 },
  { source: "Social Media", visitors: 9870, percentage: 10.9, change: -3.4 },
  { source: "Email Campaign", visitors: 4680, percentage: 5.2, change: 22.1 },
  { source: "Paid Search", visitors: 1760, percentage: 1.9, change: -11.7 },
]

// ─── Top pages by views (bar chart) ──────────────────────────────────────────

export function generateTopPagesBarData() {
  return PAGE_ANALYTICS.slice(0, 6).map((p) => ({
    page: p.title.replace(" Overview", "").replace(" Management", ""),
    views: p.views,
    visitors: p.uniqueVisitors,
  }))
}
