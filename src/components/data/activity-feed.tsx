"use client"

import { formatRelativeTime } from "@/lib/utils"
import type { ActivityItem } from "@/types"
import {
  Package, CheckCircle, XCircle, Route, UserCheck, PackageCheck,
  Clock, Mail, AlertTriangle, Coffee, Zap, Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const TYPE_CONFIG: Record<ActivityItem["type"], {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  delivery_dispatched: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  delivery_completed: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  delivery_failed: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  route_optimized: { icon: Route, color: "text-violet-500", bg: "bg-violet-500/10" },
  driver_assigned: { icon: UserCheck, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  package_picked_up: { icon: PackageCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  delivery_delayed: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  customer_notification: { icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
  exception_reported: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
  driver_break: { icon: Coffee, color: "text-amber-500", bg: "bg-amber-500/10" },
}

interface ActivityFeedProps {
  items: ActivityItem[]
  className?: string
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item, i) => {
        const cfg = TYPE_CONFIG[item.type] ?? { icon: Zap, color: "text-muted-foreground", bg: "bg-muted" }
        const Icon = cfg.icon

        return (
          <div
            key={item.id}
            className="flex gap-3 items-start py-2.5 px-1 rounded-lg hover:bg-muted/30 transition-colors group animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full mt-0.5", cfg.bg)}>
              <Icon className={cn("size-3.5", cfg.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
            </div>
            <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-0.5 tabular-nums">
              {formatRelativeTime(item.timestamp)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
