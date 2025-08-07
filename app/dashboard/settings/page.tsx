"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Users, Home, MessageSquare, BarChart3, QrCode, Mail, Bell, Key, Palette } from 'lucide-react'
import { Logo } from "@/components/logo"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [companyName, setCompanyName] = useState("ClientIn Inc.")
  const [contactEmail, setContactEmail] = useState("contact@clientin.com")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false) // Assuming this controls a theme setting

  useEffect(() => {
    // Simulate fetching settings
    setTimeout(() => {
      setLoading(false)
      // Set initial values from a mock API or local storage
      setCompanyName("ClientIn Inc.")
      setContactEmail("contact@clientin.com")
      setNotificationsEnabled(true)
      setDarkModeEnabled(false) // Example initial state
    }, 1000)
  }, [])

  const handleSaveChanges = () => {
    console.log("Saving changes:", {
      companyName,
      contactEmail,
      notificationsEnabled,
      darkModeEnabled,
    })
    // Simulate API call to save settings
    alert("Paramètres sauvegardés!")
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
          <Link href="/dashboard/insights">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <BarChart3 className="mr-3 h-4 w-4" />
              Insight
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
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
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez les paramètres de votre compte et de votre entreprise</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveChanges}>
            Sauvegarder les changements
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Mettez à jour les informations de votre entreprise.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Paramètres du Compte</CardTitle>
              <CardDescription>Gérez vos informations de connexion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" placeholder="********" className="bg-muted border-border" />
              </div>
              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" placeholder="********" className="bg-muted border-border" />
              </div>
              <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent">
                <Key className="mr-2 h-4 w-4" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configurez vos préférences de notification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Activer les notifications par email</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Recevez des alertes pour les nouveaux feedbacks et les mises à jour importantes.
              </p>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Thème</CardTitle>
              <CardDescription>Personnalisez l'apparence de votre tableau de bord.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Mode Sombre</Label>
                <Switch
                  id="darkMode"
                  checked={darkModeEnabled}
                  onCheckedChange={setDarkModeEnabled}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Activez le mode sombre pour une expérience visuelle plus agréable la nuit.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
