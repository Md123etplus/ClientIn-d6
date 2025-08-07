"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Search, Filter, Star, Users, Home, BarChart3, Settings, MoreHorizontal, Calendar, QrCode } from 'lucide-react'
import { Logo } from "@/components/logo"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

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
  source: "nfc" | "qr" | "direct"
  device_info: any // Simplified for mock
  employee?: Employee
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      // Mock data - replace with actual Supabase query
      const mockFeedbacks: Feedback[] = [
        {
          id: "f1",
          employee_id: "1",
          rating: 5,
          comment: "Excellent service, très rapide et efficace !",
          created_at: "2024-07-28T10:30:00Z",
          source: "nfc",
          device_info: {},
          employee: {
            id: "1",
            cin_number: "AB123456",
            full_name: "Mohammed Benali",
            position: "Serveur",
            department: "Restaurant",
          },
        },
        {
          id: "f2",
          employee_id: "2",
          rating: 4,
          comment: "Très bien, mais un peu d'attente.",
          created_at: "2024-07-27T15:00:00Z",
          source: "qr",
          device_info: {},
          employee: {
            id: "2",
            cin_number: "CD789012",
            full_name: "Sarah Khalil",
            position: "Caissière",
            department: "Vente",
          },
        },
        {
          id: "f3",
          employee_id: "3",
          rating: 2,
          comment: "Déçu par la qualité du produit.",
          created_at: "2024-07-26T09:45:00Z",
          source: "direct",
          device_info: {},
          employee: {
            id: "3",
            cin_number: "EF345678",
            full_name: "Meriem Alami",
            position: "Conseillère",
            department: "Service Client",
          },
        },
        {
          id: "f4",
          employee_id: "1",
          rating: 5,
          comment: "Toujours au top !",
          created_at: "2024-07-25T11:00:00Z",
          source: "nfc",
          device_info: {},
          employee: {
            id: "1",
            cin_number: "AB123456",
            full_name: "Mohammed Benali",
            position: "Serveur",
            department: "Restaurant",
          },
        },
        {
          id: "f5",
          employee_id: "4",
          rating: 1,
          comment: "Expérience très négative, à améliorer.",
          created_at: "2024-07-24T18:20:00Z",
          source: "qr",
          device_info: {},
          employee: {
            id: "4",
            cin_number: "GH901234",
            full_name: "Ahmed Tazi",
            position: "Chef de Cuisine",
            department: "Restaurant",
          },
        },
      ]
      setFeedbacks(mockFeedbacks)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.employee?.cin_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = ratingFilter === "all" || feedback.rating.toString() === ratingFilter
    const matchesSource = sourceFilter === "all" || feedback.source === sourceFilter

    return matchesSearch && matchesRating && matchesSource
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500"
    if (rating === 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
          <Button variant="ghost" className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
            <MessageSquare className="mr-3 h-4 w-4" />
            Feedbacks
          </Button>
          <Link href="/dashboard/qr-codes">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <QrCode className="mr-3 h-4 w-4" />
              QR Codes
            </Button>
          </Link>
          <Link href="/dashboard/insights">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <BarChart3 className="mr-3 h-4 w-4" />
              Insight
            </Button>
          </Link>
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
            <h1 className="text-2xl font-bold">Feedbacks</h1>
            <p className="text-muted-foreground">Consultez et analysez les feedbacks de vos clients</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par commentaire ou employé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted border-border text-foreground"
                  />
                </div>
              </div>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-muted border-border">
                  <SelectValue placeholder="Note" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Étoile{rating > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-muted border-border">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Toutes les sources</SelectItem>
                  <SelectItem value="nfc">NFC</SelectItem>
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Stats */}
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
                  <p className="text-muted-foreground text-sm">Feedbacks Positifs</p>
                  <p className="text-3xl font-bold text-foreground">
                    {feedbacks.filter((f) => f.rating >= 4).length}
                  </p>
                </div>
                <Star className="w-12 h-12 text-green-500 fill-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Feedbacks Négatifs</p>
                  <p className="text-3xl font-bold text-foreground">
                    {feedbacks.filter((f) => f.rating <= 2).length}
                  </p>
                </div>
                <Star className="w-12 h-12 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedbacks List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Liste des Feedbacks</CardTitle>
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
                        <Badge className={getRatingColor(feedback.rating)}>
                          {feedback.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Source: {feedback.source.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(feedback.created_at)}</span>
                    </div>
                    <p className="text-foreground font-medium mb-1">
                      Employé: {feedback.employee?.full_name || "N/A"} (CIN: {feedback.employee?.cin_number || "N/A"})
                    </p>
                    <p className="text-muted-foreground text-sm italic">
                      {feedback.comment || "Pas de commentaire."}
                    </p>
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
