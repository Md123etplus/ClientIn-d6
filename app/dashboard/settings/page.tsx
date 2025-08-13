"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"
import { Settings, Home, Users, MessageSquare, BarChart3, Save, Globe } from "lucide-react"
import { Logo } from "@/components/logo"
import { supabase } from "@/lib/supabase" // Use the client-side Supabase client
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useContext } from "react"
import React from "react"

interface ToastOptions {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (options: ToastOptions) => void
}

// Dummy context for demonstration; replace with your actual ToastContext if you have one
const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}
///use toast
interface SettingsData {
  id: string
  company_name: string
  contact_email: string
  language: string
  enable_notifications: boolean
  theme_color: string
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    contact_email: "",
    language: "fr", // Default to French
    enable_notifications: true,
    theme_color: "#2563eb", // Default to a blue color
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("settings").select("*").single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 means no rows found, which is fine for initial load
        console.error("Error fetching settings:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres.",
          variant: "destructive",
        })
        return
      }

      if (data) {
        setSettings(data as SettingsData)
        setFormData({
          company_name: data.company_name,
          contact_email: data.contact_email,
          language: data.language,
          enable_notifications: data.enable_notifications,
          theme_color: data.theme_color,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors du chargement.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      if (settings) {
        // Update existing settings
        const { error } = await supabase
          .from("settings")
          .update({
            company_name: formData.company_name,
            contact_email: formData.contact_email,
            language: formData.language,
            enable_notifications: formData.enable_notifications,
            theme_color: formData.theme_color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id)

        if (error) throw error
      } else {
        // Insert new settings
        const { data, error } = await supabase.from("settings").insert([formData]).select().single()
        if (error) throw error
        setSettings(data as SettingsData) // Set the new settings data including the generated ID
      }

      toast({
        title: "Succès",
        description: "Paramètres sauvegardés avec succès.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement des paramètres...</div>
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
          <Link href="/dashboard/insights">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Insight
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Settings className="mr-3 h-4 w-4" />
            Paramètres
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Paramètres de l'Application</h1>
            <p className="text-muted-foreground">Gérez les réglages généraux de votre plateforme.</p>
          </div>
        </div>

        {/* General Settings Card */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Informations Générales</CardTitle>
            <CardDescription className="text-muted-foreground">
              Mettez à jour les détails de votre entreprise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName" className="text-foreground">
                Nom de l'entreprise
              </Label>
              <Input
                id="companyName"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="bg-muted border-border text-foreground"
                placeholder="ClientIn"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="text-foreground">
                Email de contact
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="bg-muted border-border text-foreground"
                placeholder="contact@clientin.com"
              />
            </div>
            <div>
              <Label htmlFor="language" className="text-foreground">
                Langue par défaut
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value: any) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="w-full bg-muted border-border text-foreground">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings Card */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Apparence</CardTitle>
            <CardDescription className="text-muted-foreground">
              Personnalisez l'aspect visuel de votre plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="themeColor" className="text-foreground">
                Couleur Thème Principale
              </Label>
              <Input
                id="themeColor"
                type="color"
                value={formData.theme_color}
                onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                className="h-10 bg-muted border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings Card */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Notifications</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gérez les préférences de notification de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableNotifications" className="text-foreground">
                Activer les notifications
              </Label>
              <Switch
                id="enableNotifications"
                checked={formData.enable_notifications}
                onCheckedChange={(checked) => setFormData({ ...formData, enable_notifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les changements
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
