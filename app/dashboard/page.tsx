"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Home,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Search,
  Bell,
  MoreHorizontal,
  TrendingUp,
  User,
  Calendar,
  ArrowRight,
  QrCode,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { createClient } from "@supabase/supabase-js" // Keep this for now, will replace with lib/supabase in next step
import Link from "next/link"
import { useRouter } from "next/navigation"

// Initialize Supabase client directly for this file as per previous context,
// but ideally this should come from a centralized lib/supabase.ts for consistency.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

interface Employee {
  id: string
  cin_number: string
  full_name: string
  position: string
  department?: string
  photo_url?: string
}

interface Feedback {
  id: string
  employee_id: string
  rating: number
  comment?: string
  created_at: string
  employee?: Employee // Employee details joined from the 'employees' table
}

interface DashboardStats {
  totalFeedbacks: number
  positiveFeedbacks: number
  negativeFeedbacks: number
  activeEmployees: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalFeedbacks: 0,
    positiveFeedbacks: 0,
    negativeFeedbacks: 0,
    activeEmployees: 0,
  })
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (!user || error) {
      router.push("/login")
      return
    }
    setUser(user)
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch recent feedbacks with associated employee data
      const { data: feedbacksData, error: feedbacksError } = await supabase
        .from("feedbacks")
        .select(`
          id,
          employee_id,
          rating,
          comment,
          created_at,
          employee:employees (
            id,
            cin_number,
            full_name,
            position,
            department,
            photo_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5) // Get the 5 most recent feedbacks

      if (feedbacksError) {
        console.error("Error fetching feedbacks:", feedbacksError)
        // Optionally, handle error state for UI
      } else {
        setRecentFeedbacks(feedbacksData as unknown as Feedback[])
      }

      // Fetch all active employees
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("*")
        .order("full_name", { ascending: true }) // Order by name for display

      if (employeesError) {
        console.error("Error fetching employees:", employeesError)
        // Optionally, handle error state for UI
      } else {
        setEmployees(employeesData as Employee[])
      }

      // Calculate dashboard statistics
      const totalFeedbacks = feedbacksData?.length || 0
      const positiveFeedbacks = feedbacksData?.filter((f) => f.rating >= 4).length || 0
      const negativeFeedbacks = feedbacksData?.filter((f) => f.rating <= 2).length || 0
      const activeEmployees = employeesData?.length || 0

      setStats({
        totalFeedbacks,
        positiveFeedbacks,
        negativeFeedbacks,
        activeEmployees,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `Aujourd'hui, ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffInMinutes < 24 * 60) {
      return `Hier, ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffInMinutes < 30 * 24 * 60) {
      const daysAgo = Math.floor(diffInMinutes / (24 * 60))
      return `${daysAgo} jours ago, ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return (
        date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) +
        ", " +
        date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      )
    }
  }

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Auj"
    if (diffInDays === 1) return "Hier"
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
  }

  const getTimeLabel = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }).split(":")[0] + "H"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4">
        <div className="mb-8">
          <Logo className="h-8 mb-2" />
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/employees">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <Users className="mr-3 h-4 w-4" />
              Employés
            </Button>
          </Link>
          <Link href="/dashboard/feedbacks">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedbacks
            </Button>
          </Link>
          <Link href="/dashboard/qr-codes">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <QrCode className="mr-3 h-4 w-4" />
              QR Codes
            </Button>
          </Link>
          <Link href="/dashboard/insights">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Insight
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <Settings className="mr-3 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </nav>

        {/* Upgrade Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-primary border-primary">
            <CardContent className="p-4">
              <h3 className="font-bold text-primary-foreground mb-1">UPGRADE</h3>
              <h4 className="font-bold text-primary-foreground mb-2">CLIENTIN PRO</h4>
              <p className="text-xs text-primary-foreground/80 mb-4">
                Débloquez des rapports avancés, des intégrations CRM...
              </p>
              <div className="text-right">
                <ArrowRight className="h-6 w-6 text-primary-foreground ml-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Here" className="pl-10 bg-muted border-border text-foreground w-64" />
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Collecté */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Feedback Collecté</CardTitle>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-600 text-white">{stats.positiveFeedbacks} Positifs</Badge>
                  <Badge className="bg-red-600 text-white">{stats.negativeFeedbacks} Négatifs</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* General */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">General</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      CLIENT
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Type
                    </div>
                    <div></div>
                  </div>

                  {recentFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="grid grid-cols-4 gap-4 items-center py-2">
                      <div>
                        <p className="text-foreground font-medium">{feedback.employee?.full_name || "N/A"}</p>
                        <p className="text-muted-foreground text-sm">{formatDate(feedback.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-foreground">{getDateLabel(feedback.created_at)}</p>
                        <p className="text-muted-foreground text-sm">{getTimeLabel(feedback.created_at)}</p>
                      </div>
                      <div>
                        <Badge className={feedback.rating >= 4 ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                          {feedback.rating >= 4 ? "Avis positif" : "Avis négatif"}
                        </Badge>
                        <p className="text-muted-foreground text-sm">Success</p>
                      </div>
                      <div></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employé Actif */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">EMPLOYÉ ACTIF</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 overflow-x-auto">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex-shrink-0 text-center">
                      <Avatar className="h-12 w-12 mx-auto mb-2">
                        <AvatarImage src={employee.photo_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {employee.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-foreground text-sm">{employee.full_name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="bg-primary border-primary">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary-foreground mb-2">Abonnement au service</h3>
                <p className="text-primary-foreground text-sm mb-1">123-456-7890</p>
                <p className="text-primary-foreground text-sm mb-1">Type d'abonnement : Mensuelle</p>
                <p className="text-primary-foreground text-sm mb-1">Statut : Actif</p>
                <p className="text-primary-foreground text-sm mb-1">Date d'expiration</p>
                <p className="text-primary-foreground text-sm mb-4">Marge 25/04/2025</p>
                <p className="text-primary-foreground text-sm mb-4">Renouvellement : 25/04/2025</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground text-sm">Mohamed</p>
                    <p className="text-primary-foreground text-xs">CEO</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Statistique */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Feedback Statistique</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">Graphique des tendances</p>
                  <p className="text-muted-foreground text-xs mt-2">Données des 30 derniers jours</p>
                </div>
              </CardContent>
            </Card>

            {/* Service Client */}
            <Card className="bg-primary border-primary">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-primary-foreground mb-4">Service Client 24H/7J</h3>
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-primary-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
