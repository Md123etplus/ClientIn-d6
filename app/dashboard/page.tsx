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
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  employee?: Employee
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
      // Mock data - replace with actual Supabase queries
      const mockFeedbacks: Feedback[] = [
        {
          id: "1",
          employee_id: "1",
          rating: 5,
          comment: "Excellent service!",
          created_at: "2024-01-15T10:30:00Z",
          employee: {
            id: "1",
            cin_number: "AB123456",
            full_name: "Mohammed B",
            position: "Serveur",
            department: "Restaurant",
          },
        },
        {
          id: "2",
          employee_id: "2",
          rating: 4,
          comment: "Très bien",
          created_at: "2024-01-15T09:15:00Z",
          employee: {
            id: "2",
            cin_number: "CD789012",
            full_name: "Sarah K",
            position: "Caissière",
            department: "Vente",
          },
        },
        {
          id: "3",
          employee_id: "3",
          rating: 2,
          comment: "Service lent",
          created_at: "2024-01-14T16:45:00Z",
          employee: {
            id: "3",
            cin_number: "EF345678",
            full_name: "Meriem al",
            position: "Conseillère",
            department: "Service Client",
          },
        },
      ]

      const mockEmployees: Employee[] = [
        {
          id: "1",
          cin_number: "AB123456",
          full_name: "Alfredo",
          position: "Serveur",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "2",
          cin_number: "CD789012",
          full_name: "Claudia",
          position: "Caissière",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "3",
          cin_number: "EF345678",
          full_name: "Canaya",
          position: "Conseillère",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "4",
          cin_number: "GH901234",
          full_name: "Mariana",
          position: "Chef",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "5",
          cin_number: "IJ567890",
          full_name: "Marceline",
          position: "Manager",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "6",
          cin_number: "KL234567",
          full_name: "Teddy",
          position: "Serveur",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "7",
          cin_number: "MN890123",
          full_name: "Yael",
          position: "Hôtesse",
          photo_url: "/placeholder.svg?height=40&width=40",
        },
      ]

      setRecentFeedbacks(mockFeedbacks)
      setEmployees(mockEmployees)

      const positive = mockFeedbacks.filter((f) => f.rating >= 4).length
      const negative = mockFeedbacks.filter((f) => f.rating <= 2).length

      setStats({
        totalFeedbacks: mockFeedbacks.length,
        positiveFeedbacks: positive,
        negativeFeedbacks: negative,
        activeEmployees: mockEmployees.length,
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Aujourd'hui, 10:00 AM"
    if (diffInHours < 24) return "Yesterday, 4:00 AM"
    return "1 Month Ago, 4:00 PM"
  }

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) return "Auj"
    return "Hier"
  }

  const getTimeLabel = (dateString: string) => {
    const date = new Date(dateString)
    const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) return "10H"
    return "14H"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 p-4">
        <div className="mb-8">
          <Logo className="h-8 mb-2" />
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start bg-purple-600 text-white hover:bg-purple-700">
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/employees">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <Users className="mr-3 h-4 w-4" />
              Employés
            </Button>
          </Link>
          <Link href="/dashboard/feedbacks">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedbacks
            </Button>
          </Link>
          <Link href="/dashboard/qr-codes">
            <Button variant="ghost" className="w-full justify-start text-gray-300 text-white hover:bg-gray-700">
              <QrCode className="mr-3 h-4 w-4" />
              QR Codes
            </Button>
          </Link>
          <Link href="/dashboard/insights">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <BarChart3 className="mr-3 h-4 w-4" />
              Insight
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <Settings className="mr-3 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </nav>

        {/* Upgrade Card */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-purple-600 border-purple-600">
            <CardContent className="p-4">
              <h3 className="font-bold text-white mb-1">UPGRADE</h3>
              <h4 className="font-bold text-white mb-2">CLIENTIN PRO</h4>
              <p className="text-xs text-purple-100 mb-4">Débloquez des rapports avancés, des intégrations CRM...</p>
              <div className="text-right">
                <ArrowRight className="h-6 w-6 text-white ml-auto" />
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search Here" className="pl-10 bg-gray-800 border-gray-700 text-white w-64" />
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
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
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Feedback Collecté</CardTitle>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-600 text-white">{stats.positiveFeedbacks} Positifs</Badge>
                  <Badge className="bg-red-600 text-white">{stats.negativeFeedbacks} Négatifs</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* General */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">General</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
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
                        <p className="text-white font-medium">{feedback.employee?.full_name}</p>
                        <p className="text-gray-400 text-sm">{formatDate(feedback.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-white">{getDateLabel(feedback.created_at)}</p>
                        <p className="text-gray-400 text-sm">{getTimeLabel(feedback.created_at)}</p>
                      </div>
                      <div>
                        <Badge className={feedback.rating >= 4 ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                          {feedback.rating >= 4 ? "Avis positif" : "Avis négatif"}
                        </Badge>
                        <p className="text-gray-400 text-sm">Success</p>
                      </div>
                      <div></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employé Actif */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">EMPLOYÉ ACTIF</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 overflow-x-auto">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex-shrink-0 text-center">
                      <Avatar className="h-12 w-12 mx-auto mb-2">
                        <AvatarImage src={employee.photo_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {employee.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-white text-sm">{employee.full_name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card className="bg-purple-600 border-purple-600">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-2">Abonnement au service</h3>
                <p className="text-white text-sm mb-1">123-456-7890</p>
                <p className="text-white text-sm mb-1">Type d'abonnement : Mensuelle</p>
                <p className="text-white text-sm mb-1">Statut : Actif</p>
                <p className="text-white text-sm mb-1">Date d'expiration</p>
                <p className="text-white text-sm mb-4">Marge 25/04/2025</p>
                <p className="text-white text-sm mb-4">Renouvellement : 25/04/2025</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">Mohamed</p>
                    <p className="text-white text-xs">CEO</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Statistique */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Feedback Statistique</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-16 w-16 text-purple-400" />
                  </div>
                  <p className="text-gray-400 text-sm">Graphique des tendances</p>
                  <p className="text-gray-500 text-xs mt-2">Données des 30 derniers jours</p>
                </div>
              </CardContent>
            </Card>

            {/* Service Client */}
            <Card className="bg-purple-600 border-purple-600">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-white mb-4">Service Client 24H/7J</h3>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
