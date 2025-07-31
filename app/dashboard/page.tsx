"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  MoreHorizontal,
  Bell,
  Search,
  Settings,
  QrCode,
  Moon,
  Sun,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useTheme } from "next-themes"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

interface Employee {
  id: string
  name: string
  position: string
  department: string
  photo_url: string
}

interface Feedback {
  id: string
  employee_id: string
  rating: number
  comment: string
  created_at: string
  employee?: Employee
}

interface FeedbackStats {
  total: number
  positive: number
  negative: number
  averageRating: number
}

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    positive: 0,
    negative: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch employees
      const { data: employeesData } = await supabase.from("employees").select("*").order("name")

      // Fetch recent feedbacks with employee info
      const { data: feedbacksData } = await supabase
        .from("feedbacks")
        .select(`
          *,
          employees (
            id,
            name,
            position,
            department,
            photo_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      // Calculate stats
      const { data: allFeedbacks } = await supabase.from("feedbacks").select("rating")

      if (employeesData) setEmployees(employeesData)
      if (feedbacksData) setFeedbacks(feedbacksData)

      if (allFeedbacks) {
        const total = allFeedbacks.length
        const positive = allFeedbacks.filter((f) => f.rating >= 4).length
        const negative = allFeedbacks.filter((f) => f.rating <= 2).length
        const averageRating = total > 0 ? allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0

        setStats({ total, positive, negative, averageRating })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Il y a quelques minutes"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return "Hier"
    return date.toLocaleDateString("fr-FR")
  }

  const getRatingBadge = (rating: number) => {
    if (rating >= 4)
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Avis positif</Badge>
    if (rating <= 2)
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Avis négatif</Badge>
    return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Avis neutre</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Logo className="h-8" />
                <span className="text-xl font-bold text-foreground">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Here"
                  className="pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 dark:bg-gray-950 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-white bg-purple-600 hover:bg-purple-700">
              <TrendingUp className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Users className="w-5 h-5 mr-3" />
              Employés
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <MessageSquare className="w-5 h-5 mr-3" />
              Feedbacks
            </Button>
            <Link href="/dashboard/qr-codes">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                <QrCode className="w-5 h-5 mr-3" />
                QR Codes
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <TrendingUp className="w-5 h-5 mr-3" />
              Insight
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Settings className="w-5 h-5 mr-3" />
              Paramètres
            </Button>
          </nav>

          {/* Upgrade Card */}
          <div className="p-4 mt-8">
            <Card className="bg-purple-600 border-purple-600">
              <CardContent className="p-4 text-white">
                <h3 className="font-bold mb-2">UPGRADE</h3>
                <h4 className="font-bold mb-2">CLIENTIN PRO</h4>
                <p className="text-sm text-purple-100 mb-4">Débloquez des rapports avancés, des intégrations CRM...</p>
                <div className="text-right">
                  <span className="text-2xl font-bold">{">>>"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Feedbacks</p>
                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Note Moyenne</p>
                        <p className="text-2xl font-bold text-foreground">{stats.averageRating.toFixed(1)}</p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <p className="text-2xl font-bold text-foreground">
                          {Math.round((stats.positive / stats.total) * 100 || 0)}%
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback Collecté */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Feedback Collecté</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {stats.positive} Positifs
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {stats.negative} Négatifs
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {feedback.employees?.name || `Employé #${feedback.employee_id}`}
                            </p>
                            <p className="text-sm text-muted-foreground">{formatDate(feedback.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {getRatingBadge(feedback.rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Employés Actifs */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>EMPLOYÉ ACTIF</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 overflow-x-auto">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex-shrink-0 text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2">
                          <img
                            src={employee.photo_url || "/placeholder.svg"}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-foreground">{employee.name.split(" ")[0]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Subscription Card */}
              <Card className="bg-purple-600 text-white border-purple-600">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Abonnement au service</h3>
                  <p className="text-sm mb-1">123-456-7890</p>
                  <p className="text-sm mb-1">Type d'abonnement : Mensuelle</p>
                  <p className="text-sm mb-1">Statut : Actif</p>
                  <p className="text-sm mb-1">Date d'expiration</p>
                  <p className="text-sm mb-4">Marge 25/04/2025</p>
                  <p className="text-sm mb-4">Renouvellement : 25/04/2025</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Mohamed</p>
                      <p className="text-xs">CEO</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Statistique */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Feedback Statistique</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-purple-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Graphique des tendances</p>
                    <p className="text-xs text-muted-foreground mt-2">Données des 30 derniers jours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Client */}
              <Card className="bg-purple-600 text-white border-purple-600">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold mb-4">Service Client 24H/7J</h3>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
