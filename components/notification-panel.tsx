"use client"
import { Bell, X, Check, CheckCheck, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "warning":
        return "⚠️"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500/20 bg-green-500/5"
      case "error":
        return "border-red-500/20 bg-red-500/5"
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/5"
      default:
        return "border-blue-500/20 bg-blue-500/5"
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Notification Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-2xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Notifications</h2>
              {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground text-xs">{unreadCount}</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs bg-transparent"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-xs bg-transparent text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-foreground mb-2">No Notifications</h3>
                  <p className="text-muted-foreground text-sm">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${getNotificationColor(notification.type)} ${
                      !notification.read ? "border-primary/30" : "border-border/50"
                    } transition-all duration-200 hover:shadow-sm`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-lg flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-semibold text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0 hover:bg-primary/10"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </span>
                            {notification.actionUrl && notification.actionText && (
                              <Link href={notification.actionUrl} onClick={onClose}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-6 px-2 text-primary hover:text-primary"
                                >
                                  {notification.actionText}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
