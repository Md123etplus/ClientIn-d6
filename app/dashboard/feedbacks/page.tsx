"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Star,
  Filter,
  Search,
  Users,
  Home,
  BarChart3,
  Settings,
  CalendarDays,
  ArrowUp,
  ArrowDown,
  QrCode,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { supabase } from "@/lib/supabase" // Use the client-side Supabase client
import Link from "next/link"

interface Feedback {
  id: string
  employee_id: string
  rating: number
  comment?: string
  is_anonymous: boolean
  device_info?: any
  created_at: string
  employee?: {
    full_name: string
    position: string
    department?: string
  }
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("desc") // 'asc' or 'desc'

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("feedbacks")
        .select(
          `
          *,
          employee:employee_id (full_name, position, department)
        `,
        )
        .order("created_at", { ascending: sortOrder === "asc" })

      if (error) {
        console.error("Error fetching feedbacks:", error)
        return
      }
      setFeedbacks(data as Feedback[])
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [sortOrder]) // Re-fetch when sort order changes

  const allDepartments = Array.from(new Set(feedbacks.map((f) => f.employee?.department).filter(Boolean)))

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.employee?.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = ratingFilter === "all" || feedback.rating === Number.parseInt(ratingFilter)

    const matchesDepartment = departmentFilter === "all" || feedback.employee?.department === departmentFilter

    return matchesSearch && matchesRating && matchesDepartment
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement des feedbacks...</div>
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
          <Button
            variant="ghost"
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <MessageSquare className="mr-3 h-4 w-4" />
            Feedbacks
          </Button>
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
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Feedbacks</h1>
            <p className="text-muted-foreground">Consultez et gérez les feedbacks de vos employés</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative col-span-full md:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un feedback ou un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted border-border text-foreground"
                />
              </div>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full bg-muted border-border">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Note" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Étoile{rating > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full bg-muted border-border">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {allDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept!}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full bg-muted border-border">
                  {sortOrder === "desc" ? (
                    <ArrowDown className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ArrowUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="desc">Plus récent</SelectItem>
                  <SelectItem value="asc">Plus ancien</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedbacks List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Liste des Feedbacks</CardTitle>
            <CardDescription className="text-muted-foreground">
              {filteredFeedbacks.length} feedbacks trouvés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">Aucun feedback trouvé.</div>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 bg-muted rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-foreground">{feedback.rating}/5</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-foreground mb-3">{feedback.comment || "Aucun commentaire fourni."}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>
                        {feedback.employee ? (
                          <>
                            <span className="font-semibold text-foreground">{feedback.employee.full_name}</span> (
                            {feedback.employee.position}
                            {feedback.employee.department && ` - ${feedback.employee.department}`})
                          </>
                        ) : (
                          "Employé inconnu"
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feedback.is_anonymous ? "Anonyme" : "Non anonyme"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
