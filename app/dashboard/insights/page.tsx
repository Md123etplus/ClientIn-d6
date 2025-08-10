"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Users, Home, MessageSquare, Settings, TrendingUp, Star, Building, QrCode } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

interface FeedbackTrend {
  date: string
  positive: number
  negative: number
  neutral: number
}

interface DepartmentPerformance {
  name: string
  avg_rating: number
  feedback_count: number
}

interface TopEmployee {
  id: string
  full_name: string
  position: string
  avg_rating: number
  feedback_count: number
}

export default function InsightsPage() {
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("30d")
  const [feedbackTrends, setFeedbackTrends] = useState<FeedbackTrend[]>([])
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([])
  const [topEmployees, setTopEmployees] = useState<TopEmployee[]>([])

  useEffect(() => {
    fetchInsightsData()
  }, [timeframe])

  const fetchInsightsData = async () => {
    try {
      // Mock data - replace with actual Supabase queries
      const mockFeedbackTrends: FeedbackTrend[] = [
        { date: "Jul 20", positive: 10, negative: 2, neutral: 1 },
        { date: "Jul 21", positive: 12, negative: 3, neutral: 0 },
        { date: "Jul 22", positive: 8, negative: 1, neutral: 2 },
        { date: "Jul 23", positive: 15, negative: 4, neutral: 1 },
        { date: "Jul 24", positive: 11, negative: 2, neutral: 3 },
        { date: "Jul 25", positive: 14, negative: 3, neutral: 0 },
        { date: "Jul 26", positive: 9, negative: 1, neutral: 2 },
      ]

      const mockDepartmentPerformance: DepartmentPerformance[] = [
        { name: "Restaurant", avg_rating: 4.5, feedback_count: 50 },
        { name: "Vente", avg_rating: 4.2, feedback_count: 30 },
        { name: "Service Client", avg_rating: 3.8, feedback_count: 40 },
        { name: "Administration", avg_rating: 4.0, feedback_count: 15 },
      ]

      const mockTopEmployees: TopEmployee[] = [
        { id: "1", full_name: "Mohammed Benali", position: "Serveur", avg_rating: 4.8, feedback_count: 25 },
        { id: "2", full_name: "Sarah Khalil", position: "Caissière", avg_rating: 4.6, feedback_count: 18 },
        { id: "3", full_name: "Meriem Alami", position: "Conseillère", avg_rating: 4.3, feedback_count: 20 },
      ]

      setFeedbackTrends(mockFeedbackTrends)
      setDepartmentPerformance(mockDepartmentPerformance)
      setTopEmployees(mockTopEmployees)
    } catch (error) {
      console.error("Error fetching insights data:", error)
    } finally {
      setLoading(false)
    }
  }

  const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement des insights...</div>
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
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/employees">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <Users className="mr-3 h-4 w-4" />
              Employés
            </Button>
          </Link>
          <Link href="/dashboard/feedbacks">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedbacks
            </Button>
          </Link>
          <Link href="/dashboard/qr-codes">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <QrCode className="mr-3 h-4 w-4" />
              QR Codes
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
            <BarChart3 className="mr-3 h-4 w-4" />
            Insight
          </Button>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <Settings className="mr-3 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Insights & Rapports</h1>
            <p className="text-muted-foreground">Analysez les tendances et les performances</p>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-muted border-border">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
              <SelectItem value="365d">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Trends Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Tendances des Feedbacks</CardTitle>
                <CardDescription>Évolution des feedbacks positifs, négatifs et neutres.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    positive: { label: "Positif", color: "hsl(var(--chart-1))" },
                    negative: { label: "Négatif", color: "hsl(var(--chart-2))" },
                    neutral: { label: "Neutre", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={feedbackTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="positive" stroke="hsl(var(--chart-1))" name="Positif" />
                      <Line type="monotone" dataKey="negative" stroke="hsl(var(--chart-2))" name="Négatif" />
                      <Line type="monotone" dataKey="neutral" stroke="hsl(var(--chart-3))" name="Neutre" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Performing Employees */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Employés les Plus Performants</CardTitle>
                <CardDescription>Employés avec les notes moyennes les plus élevées.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold text-foreground">{employee.full_name}</h3>
                        <p className="text-muted-foreground text-sm">{employee.position}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-sm">
                          {employee.avg_rating.toFixed(1)} <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </Badge>
                        <span className="text-muted-foreground text-sm">({employee.feedback_count} feedbacks)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Métriques Clés</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Note Moyenne</p>
                  <p className="text-2xl font-bold text-primary">
                    {(feedbackTrends.reduce((sum, t) => sum + t.positive * 5 + t.neutral * 3 + t.negative * 1, 0) /
                      feedbackTrends.reduce((sum, t) => sum + t.positive + t.neutral + t.negative, 0) || 0).toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Taux de Réponse</p>
                  <p className="text-2xl font-bold text-primary">75%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Feedbacks Totaux</p>
                  <p className="text-2xl font-bold text-foreground">
                    {feedbackTrends.reduce((sum, t) => sum + t.positive + t.neutral + t.negative, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Employés Actifs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {topEmployees.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Department Performance Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Performance par Département</CardTitle>
                <CardDescription>Répartition des feedbacks par département.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    feedback_count: { label: "Nombre de Feedbacks", color: "hsl(var(--primary))" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentPerformance}
                        dataKey="feedback_count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {departmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Statistiques Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nouveaux feedbacks aujourd'hui:</span>
                  <span className="font-bold text-foreground">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employés avec 0 feedback:</span>
                  <span className="font-bold text-foreground">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Problèmes urgents:</span>
                  <span className="font-bold text-destructive">1</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
