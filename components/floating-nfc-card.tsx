"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Logo } from "./logo"

interface Employee {
  id: string
  cin_number: string
  full_name: string
  position: string
  department?: string
  photo_url?: string
}

interface DeviceInfo {
  userAgent: string
  platform: string
  language: string
  screenResolution: string
  timestamp: string
}

export function FloatingNfcCard() {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    // Simulate fetching employee data for a fixed NFC tag
    // In a real scenario, this would come from an NFC scan or a URL parameter
    const mockEmployeeId = "nfc-employee-123" // Example fixed ID for demo
    fetchEmployee(mockEmployeeId)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const fetchEmployee = async (id: string) => {
    try {
      // Simulate API call to get employee details based on NFC tag ID
      // Replace with actual Supabase call or other backend integration
      const mockEmployee: Employee = {
        id: id,
        cin_number: "NFC001",
        full_name: "Amina El Fassi",
        position: "Hôtesse d'accueil",
        department: "Service Client",
        photo_url: "/placeholder.svg?height=100&width=100",
      }
      setEmployee(mockEmployee)
    } catch (error) {
      console.error("Error fetching employee:", error)
      setError("Employé non trouvé")
    }
  }

  const getDeviceInfo = (): DeviceInfo => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timestamp: new Date().toISOString(),
    }
  }

  const submitFeedback = async () => {
    if (rating === 0) {
      setError("Veuillez sélectionner une note")
      return
    }

    setIsSubmitting(true)
    setError("")

    const feedbackData = {
      employee_id: employee?.id,
      rating,
      comment: comment.trim() || null,
      is_anonymous: true,
      device_info: getDeviceInfo(),
      source: "nfc", // Source is NFC for this component
    }

    try {
      if (isOnline) {
        // Submit directly to Supabase
        console.log("Submitting feedback online:", feedbackData)
        // Replace with actual Supabase call
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } else {
        // Store in localStorage for offline sync
        const pendingFeedbacks = JSON.parse(localStorage.getItem("pendingFeedbacks") || "[]")
        pendingFeedbacks.push({
          ...feedbackData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        })
        localStorage.setItem("pendingFeedbacks", JSON.stringify(pendingFeedbacks))
        console.log("Stored feedback offline:", feedbackData)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setError("Erreur lors de l'envoi. Réessayez.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!employee) {
    return (
      <Card className="w-full max-w-md bg-card border-border">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Chargement de l'employé...</h2>
          <p className="text-muted-foreground">Veuillez patienter.</p>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md bg-card border-border">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Merci !</h2>
          <p className="text-muted-foreground mb-4">
            Votre feedback a été {isOnline ? "envoyé" : "enregistré et sera synchronisé"} avec succès.
          </p>
          {!isOnline && (
            <Alert className="bg-muted border-border">
              <WifiOff className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-muted-foreground">
                Votre feedback sera envoyé automatiquement quand vous serez en ligne.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="text-center">
        <Logo className="mx-auto mb-4" />
        <div className="flex items-center justify-center gap-2 mb-2">
          {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-amber-500" />}
          <span className="text-sm text-muted-foreground">{isOnline ? "En ligne" : "Hors ligne"}</span>
        </div>
        <Badge variant="outline" className="mb-4 border-border text-muted-foreground">
          Via NFC
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.photo_url || "/placeholder.svg"} alt={employee.full_name} />
            <AvatarFallback className="text-lg bg-secondary text-secondary-foreground">
              {employee.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{employee.full_name}</h2>
            <p className="text-muted-foreground">{employee.position}</p>
            {employee.department && (
              <Badge variant="secondary" className="mt-1">
                {employee.department}
              </Badge>
            )}
          </div>
        </div>

        {/* Feedback Form */}
        <div>
          <CardTitle className="text-foreground mb-2">Évaluez ce service</CardTitle>
          <CardDescription className="text-muted-foreground">
            Votre avis nous aide à améliorer notre service. Votre feedback est anonyme.
          </CardDescription>
        </div>

        {/* Rating */}
        <div>
          <label className="text-sm font-medium mb-3 block text-foreground">Note générale *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <Star
                  className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {rating === 1 && "Très insatisfait"}
              {rating === 2 && "Insatisfait"}
              {rating === 3 && "Neutre"}
              {rating === 4 && "Satisfait"}
              {rating === 5 && "Très satisfait"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium mb-3 block text-foreground">Commentaire (optionnel)</label>
          <Textarea
            placeholder="Partagez votre expérience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={4}
            className="bg-muted border-border text-foreground"
          />
          <p className="text-xs text-muted-foreground mt-1">{comment.length}/500 caractères</p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/20 border-destructive/50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={submitFeedback} disabled={isSubmitting || rating === 0} className="w-full" size="lg">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Envoyer le feedback
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">Votre feedback est anonyme et confidentiel</p>
      </CardContent>
    </Card>
  )
}
