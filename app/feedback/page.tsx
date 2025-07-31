"use client"

import { useState, useEffect } from "react"
import { Star, Wifi, WifiOff, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { Logo } from "@/components/logo"

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
  employeeId: string
  rating: number
  comment: string
  timestamp: string
}

export default function FeedbackPage() {
  const [employeeId, setEmployeeId] = useState<string>("")
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  // Get employee ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    const source = urlParams.get("source") // Track if from QR or NFC
    if (id) {
      setEmployeeId(id)
      fetchEmployee(id)
      // Track scan source
      if (source === "qr") {
        trackQRScan(id)
      }
    }
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingFeedbacks()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const fetchEmployee = async (id: string) => {
    try {
      const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

      if (error) throw error
      setEmployee(data)
    } catch (error) {
      console.error("Error fetching employee:", error)
    }
  }

  const trackQRScan = async (employeeId: string) => {
    try {
      const { error } = await supabase.rpc("increment_qr_scans", {
        emp_id: employeeId,
      })
      if (error) console.error("Error tracking QR scan:", error)
    } catch (error) {
      console.error("Error tracking QR scan:", error)
    }
  }

  const saveFeedbackLocally = (feedback: Feedback) => {
    const pendingFeedbacks = JSON.parse(localStorage.getItem("pendingFeedbacks") || "[]")
    pendingFeedbacks.push(feedback)
    localStorage.setItem("pendingFeedbacks", JSON.stringify(pendingFeedbacks))
  }

  const syncPendingFeedbacks = async () => {
    const pendingFeedbacks = JSON.parse(localStorage.getItem("pendingFeedbacks") || "[]")

    if (pendingFeedbacks.length === 0) return

    try {
      const { error } = await supabase.from("feedbacks").insert(
        pendingFeedbacks.map((feedback: Feedback) => ({
          employee_id: feedback.employeeId,
          rating: feedback.rating,
          comment: feedback.comment,
          created_at: feedback.timestamp,
        })),
      )

      if (!error) {
        localStorage.removeItem("pendingFeedbacks")
        console.log("Synced pending feedbacks successfully")
      }
    } catch (error) {
      console.error("Error syncing feedbacks:", error)
    }
  }

  const submitFeedback = async () => {
    if (rating === 0) return

    setIsSubmitting(true)

    const feedback: Feedback = {
      employeeId,
      rating,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    }

    if (isOnline) {
      try {
        const { error } = await supabase.from("feedbacks").insert({
          employee_id: feedback.employeeId,
          rating: feedback.rating,
          comment: feedback.comment,
        })

        if (error) throw error

        setSubmitted(true)
      } catch (error) {
        console.error("Error submitting feedback:", error)
        saveFeedbackLocally(feedback)
        setSubmitted(true)
      }
    } else {
      saveFeedbackLocally(feedback)
      setSubmitted(true)
    }

    setIsSubmitting(false)
  }

  const resetForm = () => {
    setRating(0)
    setComment("")
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Merci pour votre retour !</h2>
            <p className="text-gray-600 mb-6">
              {isOnline
                ? "Votre feedback a été envoyé avec succès."
                : "Votre feedback a été sauvegardé et sera envoyé dès que la connexion sera rétablie."}
            </p>
            <Button onClick={resetForm} className="w-full">
              Donner un autre avis
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Logo className="h-8 w-auto" />
          </div>
          <Badge variant={isOnline ? "default" : "secondary"} className="mb-4">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 mr-1" />
                En ligne
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 mr-1" />
                Hors ligne - Sauvegardé localement
              </>
            )}
          </Badge>
        </div>

        {/* Employee Card */}
        {employee && (
          <Card className="mb-6">
            <CardContent className="flex items-center p-4">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img
                  src={employee.photo_url || "/placeholder.svg"}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <p className="text-xs text-gray-500">{employee.department}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!employee && employeeId && (
          <Card className="mb-6">
            <CardContent className="flex items-center p-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Employé #{employeeId}</h3>
                <p className="text-sm text-gray-600">Chargement des informations...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle>Comment évaluez-vous le service ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-colors">
                    <Star
                      className={`w-8 h-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {rating === 0 && "Cliquez sur les étoiles pour noter"}
                {rating === 1 && "Très insatisfait"}
                {rating === 2 && "Insatisfait"}
                {rating === 3 && "Neutre"}
                {rating === 4 && "Satisfait"}
                {rating === 5 && "Très satisfait"}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire (optionnel)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="Partagez votre expérience..."
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/500 caractères</p>
            </div>

            {/* Submit Button */}
            <Button onClick={submitFeedback} disabled={rating === 0 || isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer le feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Powered by ClientIn • Votre avis compte</p>
        </div>
      </div>
    </div>
  )
}
