"use client"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Users, Home, MessageSquare, BarChart3, Settings, Star, QrCode } from "lucide-react"
import { Logo } from "@/components/logo"
import { supabase } from "@/lib/supabase" // Use the client-side Supabase client
import Link from "next/link"

interface Feedback {
  id: string
  employee_id: string
  rating: number
  comment?: string
  created_at: string
  employee?: {
    full_name: string
    department?: string
  }
}

interface Employee {
  id: string
  full_name: string
  department?: string
}

export default function InsightsPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: feedbacksData, error: feedbacksError } = await supabase.from("feedbacks").select(
        `
          id,
          rating,
          created_at,
          employee:employee_id (full_name, department)
        `,
      )
      if (feedbacksError) throw feedbacksError
      setFeedbacks(feedbacksData as unknown as Feedback[])

      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("id, full_name, department")
      if (employeesError) throw employeesError
      setEmployees(employeesData as Employee[])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- Data Processing for Charts ---

  // Average Rating
  const averageRating =
    feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : "N/A"

  // Feedback Count by Rating
  const ratingCounts = Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => ({
    name: `${rating} Star${rating > 1 ? "s" : ""}`,
    count: feedbacks.filter((f) => f.rating === rating).length,
    fill: `hsl(var(--chart-${rating}))`, // Using chart colors
  }))

  // Feedback Trends (e.g., by month)
  const feedbackTrendData = feedbacks.reduce(
    (acc, feedback) => {
      const date = new Date(feedback.created_at)
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`
      acc[monthYear] = (acc[monthYear] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedFeedbackTrend = Object.keys(feedbackTrendData)
    .sort((a, b) => {
      const [monthA, yearA] = a.split(" ")
      const [monthB, yearB] = b.split(" ")
      const dateA = new Date(`${monthA} 1, ${yearA}`)
      const dateB = new Date(`${monthB} 1, ${yearB}`)
      return dateA.getTime() - dateB.getTime()
    })
    .map((key) => ({
      month: key,
      feedbacks: feedbackTrendData[key],
    }))

  // Department Performance (Average Rating by Department)
  const departmentRatings = feedbacks.reduce(
    (acc, feedback) => {
      const dept = feedback.employee?.department || "Non spécifié"
      if (!acc[dept]) {
        acc[dept] = { totalRating: 0, count: 0 }
      }
      acc[dept].totalRating += feedback.rating
      acc[dept].count += 1
      return acc
    },
    {} as Record<string, { totalRating: number; count: number }>,
  )

  const departmentPerformance = Object.keys(departmentRatings).map((dept) => ({
    department: dept,
    averageRating: (departmentRatings[dept].totalRating / departmentRatings[dept].count).toFixed(1),
    feedbacks: departmentRatings[dept].count,
  }))

  // Top/Bottom Employees (by average rating, requires more data for meaningful results)
  // For simplicity, let's just count feedbacks per employee for now
  const employeeFeedbackCounts = feedbacks.reduce(
    (acc, feedback) => {
      const employeeName = feedback.employee?.full_name || "Anonyme"
      if (!acc[employeeName]) {
        acc[employeeName] = { totalRating: 0, count: 0 }
      }
      acc[employeeName].totalRating += feedback.rating
      acc[employeeName].count += 1
      return acc
    },
    {} as Record<string, { totalRating: number; count: number }>,
  )

  const employeePerformance = Object.keys(employeeFeedbackCounts)
    .map((name) => ({
      employee: name,
      averageRating: (employeeFeedbackCounts[name].totalRating / employeeFeedbackCounts[name].count).toFixed(1),
      feedbacks: employeeFeedbackCounts[name].count,
    }))
    .sort((a, b) => Number.parseFloat(b.averageRating) - Number.parseFloat(a.averageRating)) // Sort by average rating

  const top5Employees = employeePerformance.slice(0, 5)
  const bottom5Employees = employeePerformance.slice(-5).reverse() // Get bottom 5, then reverse to show lowest first

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
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
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
          <Button
            variant="ghost"
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <BarChart3 className="mr-3 h-4 w-4" />
            Insight
          </Button>
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
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Insights</h1>
            <p className="text-muted-foreground">Analyse des performances et des feedbacks</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Feedbacks</p>
                  <p className="text-3xl font-bold text-foreground">{feedbacks.length}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Note Moyenne</p>
                  <p className="text-3xl font-bold text-foreground">{averageRating}</p>
                </div>
                <Star className="w-12 h-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Employés Actifs</p>
                  <p className="text-3xl font-bold text-foreground">{employees.length}</p>
                </div>
                <Users className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Feedback Distribution by Rating */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Distribution des Feedbacks par Note</CardTitle>
              <CardDescription className="text-muted-foreground">
                Répartition des notes données par les clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "1": { label: "1 Étoile", color: "hsl(var(--chart-1))" },
                  "2": { label: "2 Étoiles", color: "hsl(var(--chart-2))" },
                  "3": { label: "3 Étoiles", color: "hsl(var(--chart-3))" },
                  "4": { label: "4 Étoiles", color: "hsl(var(--chart-4))" },
                  "5": { label: "5 Étoiles", color: "hsl(var(--chart-5))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingCounts}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} className="text-sm" />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} className="text-sm" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Feedback Trend Over Time */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tendance des Feedbacks</CardTitle>
              <CardDescription className="text-muted-foreground">
                Nombre de feedbacks reçus au fil du temps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  feedbacks: {
                    label: "Feedbacks",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedFeedbackTrend}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} className="text-sm" />
                    <YAxis tickLine={false} tickMargin={10} axisLine={false} className="text-sm" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="feedbacks" fill="var(--color-feedbacks)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Performance par Département</CardTitle>
              <CardDescription className="text-muted-foreground">
                Note moyenne des feedbacks par département.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  averageRating: {
                    label: "Note Moyenne",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformance} layout="vertical">
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="department"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      className="text-sm"
                    />
                    <XAxis
                      type="number"
                      domain={[1, 5]}
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      className="text-sm"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="averageRating" fill="var(--color-averageRating)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top 5 Employees */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Top 5 Employés</CardTitle>
              <CardDescription className="text-muted-foreground">
                Employés avec les meilleures notes moyennes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {top5Employees.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">Pas assez de données.</div>
              ) : (
                <div className="space-y-3">
                  {top5Employees.map((emp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                      <span className="font-medium text-foreground">{emp.employee}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{emp.averageRating}</Badge>
                        <Star className="h-4 w-4 text-yellow-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom 5 Employees */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">5 Employés à Améliorer</CardTitle>
              <CardDescription className="text-muted-foreground">
                Employés avec les notes moyennes les plus basses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bottom5Employees.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">Pas assez de données.</div>
              ) : (
                <div className="space-y-3">
                  {bottom5Employees.map((emp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                      <span className="font-medium text-foreground">{emp.employee}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">{emp.averageRating}</Badge>
                        <Star className="h-4 w-4 text-red-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
