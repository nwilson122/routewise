"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/charts/stat-card"
import { AreaChart } from "@/components/charts/area-chart"
import { DonutChart } from "@/components/charts/donut-chart"
import { DataTable } from "@/components/data/data-table"
import { ActivityFeed } from "@/components/data/activity-feed"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Calendar, Truck, Clock, Package, MapPin } from "lucide-react"
import {
  generateDeliveryData,
  generateDeliveries,
  generateActivityFeed,
  DELIVERY_STATUS,
} from "@/lib/mock-data"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import type { StatCard as StatCardType, Delivery } from "@/types"
import { cn } from "@/lib/utils"

// ─── Logistics KPI Data ─────────────────────────────────────────────────────

const LOGISTICS_KPI_STATS: StatCardType[] = [
  {
    id: "active-deliveries",
    title: "Active Deliveries",
    value: "847",
    rawValue: 847,
    change: 12.4,
    changeLabel: "from yesterday",
    icon: "Package",
    trend: "up",
    sparkline: [780, 820, 795, 865, 840, 890, 825, 875, 810, 855, 832, 847],
  },
  {
    id: "on-time-rate",
    title: "On-Time Rate",
    value: "94.2%",
    rawValue: 94.2,
    change: 1.8,
    changeLabel: "from last week",
    icon: "Clock",
    trend: "up",
    sparkline: [91.8, 92.4, 93.1, 92.7, 93.8, 94.5, 93.9, 94.8, 93.6, 94.1, 93.8, 94.2],
  },
  {
    id: "avg-delivery-time",
    title: "Avg Delivery Time",
    value: "42min",
    rawValue: 42,
    change: -6,
    changeLabel: "improvement",
    icon: "Truck",
    trend: "down", // down is good for delivery time
    sparkline: [52, 49, 51, 47, 45, 44, 46, 43, 45, 42, 44, 42],
  },
  {
    id: "fleet-utilisation",
    title: "Fleet Utilisation",
    value: "78%",
    rawValue: 78,
    change: 3.2,
    changeLabel: "from last week",
    icon: "MapPin",
    trend: "up",
    sparkline: [72, 74, 71, 76, 75, 78, 74, 77, 75, 79, 76, 78],
  },
]

// ─── Delivery table columns ──────────────────────────────────────────────────

const DELIVERY_STATUS_STYLES: Record<Delivery["status"], { label: string; className: string }> = {
  in_transit: { label: "In Transit", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delivered: { label: "Delivered", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  failed: { label: "Failed", className: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  returned: { label: "Returned", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
}

const PRIORITY_STYLES: Record<Delivery["priority"], { label: string; className: string }> = {
  same_day: { label: "Same Day", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  next_day: { label: "Next Day", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  express: { label: "Express", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  standard: { label: "Standard", className: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
}

const deliveryColumns: ColumnDef<Delivery>[] = [
  {
    accessorKey: "trackingNumber",
    header: "Tracking #",
    cell: ({ getValue }) => (
      <span className="font-mono font-medium text-xs text-foreground">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground text-xs truncate max-w-[140px]">{row.original.customer}</div>
        <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">{row.original.destination.split(',')[0]}</div>
      </div>
    ),
  },
  {
    accessorKey: "origin",
    header: "Origin",
    cell: ({ getValue }) => {
      const origin = String(getValue())
      const shortOrigin = origin.split(',')[0] || origin
      return (
        <span className="text-xs text-muted-foreground truncate block max-w-[100px]" title={origin}>
          {shortOrigin}
        </span>
      )
    },
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ getValue }) => {
      const dest = String(getValue())
      const shortDest = dest.split(',')[0] || dest
      return (
        <span className="text-xs text-muted-foreground truncate block max-w-[100px]" title={dest}>
          {shortDest}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const s = getValue() as Delivery["status"]
      const cfg = DELIVERY_STATUS_STYLES[s]
      return (
        <Badge variant="outline" className={cn("text-[10px] font-medium h-5 px-1.5 border", cfg.className)}>
          {cfg.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ getValue, row }) => {
      const eta = String(getValue())
      const status = row.original.status
      if (status === "delivered") {
        return <span className="text-xs text-emerald-600">✓ Delivered</span>
      }
      if (status === "failed" || status === "returned") {
        return <span className="text-xs text-muted-foreground">—</span>
      }
      return (
        <span className="text-xs font-mono text-muted-foreground tabular-nums">
          {eta || "—"}
        </span>
      )
    },
  },
]

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const deliveryData = useMemo(() => generateDeliveryData(), [])
  const deliveries = useMemo(() => generateDeliveries(50), [])
  const activityFeed = useMemo(() => generateActivityFeed(10), [])
  const total = DELIVERY_STATUS.reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courier Dashboard"
        description="Welcome back. Here's your logistics overview for today."
      >
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Calendar className="size-3.5" />
          Last 30 days
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="size-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <RefreshCw className="size-3.5" />
          Refresh
        </Button>
      </PageHeader>

      {/* ── Row 1: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {LOGISTICS_KPI_STATS.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} animationDelay={i * 80} />
        ))}
      </div>

      {/* ── Row 2: Delivery Chart + Status Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliveries Completed Area Chart */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-sm font-semibold">Delivery Performance</CardTitle>
                <CardDescription className="text-xs mt-0.5">Daily delivery completions over the last 30 days</CardDescription>
              </div>
              <Tabs defaultValue="completed" className="shrink-0">
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="completed" className="text-[11px] h-6 px-2.5">Completed</TabsTrigger>
                  <TabsTrigger value="attempted" className="text-[11px] h-6 px-2.5">Attempted</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4 pr-2">
            <AreaChart
              data={deliveryData}
              xKey="date"
              series={[
                { key: "completed", name: "Completed" },
                { key: "attempted", name: "Attempted" },
              ]}
              height={260}
              formatY={(v) => `${v}`}
              formatTooltip={(v) => `${v} deliveries`}
            />
          </CardContent>
        </Card>

        {/* Delivery Status Donut */}
        <Card className="border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Delivery Status</CardTitle>
            <CardDescription className="text-xs">
              {total} total deliveries today
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <DonutChart
              data={DELIVERY_STATUS}
              height={200}
              innerRadius={65}
              outerRadius={90}
              formatValue={(v) => `${v}`}
              centerValue={`${total}`}
              centerLabel="Total"
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Deliveries Table + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliveries Table */}
        <Card className="lg:col-span-2 border-border/60 animate-fade-in-up delay-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent Deliveries</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Showing the last {deliveries.length} deliveries across all routes
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              columns={deliveryColumns}
              data={deliveries}
              searchKey="trackingNumber"
              searchPlaceholder="Search tracking number..."
            />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border/60 animate-fade-in-up delay-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Live Activity</CardTitle>
              <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                Live
              </span>
            </div>
            <CardDescription className="text-xs">Real-time delivery events</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ActivityFeed items={activityFeed} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
