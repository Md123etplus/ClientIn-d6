"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Star, TrendingUp, Calendar, BarChart3, Download, Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

interface EmployeeStats {
  id: string
  cin_number: string
  full_name: string
  position: string
  department?: string
  feedback_count: number
  avg_rating: number
  last_feedback?: string
}

interface DashboardStats {
  totalEmployees: number
  totalFeedbacks: number
  averageRating: number
  responseRate: number
}

export default function DashboardPage() {
  const [employees, setEmployees] = useState<EmployeeStats[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    responseRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual Supabase call
      const mockEmployees: EmployeeStats[] = [
        {
          id: "1",
          cin_number: "AB123456",
          full_name: "Mohammed Benali",
          position: "Serveur",
          department: "Restaurant",
          feedback_count: 24,
          avg_rating: 4.5,
          last_feedback: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          cin_number: "CD789012",
          full_name: "Sarah Khalil",
          position: "Caissière",
          department: "Vente",
          feedback_count: 18,
          avg_rating: 4.2,
          last_feedback: "2024-01-14T15:45:00Z",
        },
        {
          id: "3",
          cin_number: "EF345678",
          full_name: "Meriem Alami",
          position: "Conseillère",
          department: "Service Client",
          feedback_count: 31,
          avg_rating: 4.8,
          last_feedback: "2024-01-15T09:20:00Z",
        },
        {
          id: "4",
          cin_number: "GH901234",
          full_name: "Ahmed Tazi",
          position: "Chef de Cuisine",
          department: "Restaurant",
          feedback_count: 15,
          avg_rating: 4.6,
          last_feedback: "2024-01-13T18:10:00Z",
        },
        {
          id: "5",
          cin_number: "IJ567890",
          full_name: "Fatima Zahra",
          position: "Responsable RH",
          department: "Administration",
          feedback_count: 8,
          avg_rating: 4.3,
          last_feedback: "2024-01-12T11:30:00Z",
        },
      ]

      setEmployees(mockEmployees)

      const totalFeedbacks = mockEmployees.reduce((sum, emp) => sum + emp.feedback_count, 0)
      const avgRating =
        mockEmployees.reduce((sum, emp) => sum + emp.avg_rating * emp.feedback_count, 0) / totalFeedbacks

      setStats({
        totalEmployees: mockEmployees.length,
        totalFeedbacks,
        averageRating: avgRating,
        responseRate: 85.2,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cin_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 4.5) return "default"
    if (rating >= 4.0) return "secondary"
    if (rating >= 3.5) return "outline"
    return "destructive"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold">Tableau de Bord</h1>
                <p className="text-muted-foreground">Gestion des feedbacks employés</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Actifs dans le système</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
              <p className="text-xs text-muted-foreground">Satisfaction globale</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réponse</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseRate}%</div>
              <Progress value={stats.responseRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres et Recherche</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par nom, CIN ou poste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les départements</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept!}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Employees List */}
            <div className="grid gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                          <AvatarFallback>
                            {employee.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{employee.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {employee.position} • CIN: {employee.cin_number}
                          </p>
                          {employee.department && (
                            <Badge variant="outline" className="mt-1">
                              {employee.department}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-right">
                        <div>
                          <p className="text-sm font-medium">{employee.feedback_count}</p>
                          <p className="text-xs text-muted-foreground">Feedbacks</p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className={`font-semibold ${getRatingColor(employee.avg_rating)}`}>
                              {employee.avg_rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Note moyenne</p>
                        </div>
                        <div>
                          <Badge variant={getRatingBadgeVariant(employee.avg_rating)}>
                            {employee.avg_rating >= 4.5
                              ? "Excellent"
                              : employee.avg_rating >= 4.0
                                ? "Très bien"
                                : employee.avg_rating >= 3.5
                                  ? "Bien"
                                  : "À améliorer"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques Avancées</CardTitle>
                <CardDescription>Analyses détaillées des performances et tendances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Graphiques et analyses détaillées à venir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Rapports</CardTitle>
                <CardDescription>Génération et export de rapports personnalisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Système de rapports en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
