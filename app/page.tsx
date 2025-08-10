"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Wifi, BarChart3, Moon, Sun, ArrowRight, Zap, Shield, Globe, ChevronDown, Play } from "lucide-react"
import { Logo } from "@/components/logo"
import { LoadingScreen } from "@/components/loading-screen"
import { FloatingNFCCard } from "@/components/floating-nfc-card"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/supabase-js"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 4000)

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }

    if (!mounted) {
      checkUser()
    }

    return () => clearTimeout(timer)
  }, [router, supabase.auth, mounted])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Interactive Floating NFC Card */}
        <FloatingNFCCard />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Logo className="h-10" />
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-white hover:bg-white/10 border border-white/20"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto lg:mr-80">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Révolution NFC & QR Code
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Feedback Client
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Révolutionnaire
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transformez l'expérience client avec notre technologie NFC et QR Code offline-first. Collectez des retours
            instantanés, même sans connexion internet.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/feedback?id=EMP001">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Démo Interactive
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                Voir Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/70">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">&lt; 2s</div>
              <div className="text-white/70">Temps de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">Support</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Technologie de Pointe</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une solution complète qui révolutionne la collecte de feedback client
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Smartphone,
                title: "NFC & QR Code",
                description: "Scan instantané sans application. Technologie NFC et QR codes personnalisés.",
                color: "bg-primary", // Changed to use primary color
              },
              {
                icon: Wifi,
                title: "Offline-First",
                description: "Fonctionne sans internet. Synchronisation automatique dès la reconnexion.",
                color: "bg-primary", // Changed to use primary color
              },
              {
                icon: BarChart3,
                title: "Analytics Temps Réel",
                description: "Dashboard avancé avec insights et métriques de performance détaillées.",
                color: "bg-primary", // Changed to use primary color
              },
              {
                icon: Shield,
                title: "Sécurité Maximale",
                description: "Chiffrement end-to-end et conformité RGPD pour vos données sensibles.",
                color: "bg-primary", // Changed to use primary color
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-border bg-card backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-16 border border-border backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Comment ça marche ?</h3>
                <div className="space-y-8">
                  {[
                    {
                      step: "1",
                      title: "Scan NFC ou QR",
                      description: "Le client scanne la carte NFC ou QR code personnalisé de l'employé",
                    },
                    {
                      step: "2",
                      title: "Feedback Instantané",
                      description: "Interface intuitive : note de 1 à 5 étoiles + commentaire optionnel",
                    },
                    {
                      step: "3",
                      title: "Analytics en Temps Réel",
                      description: "Les données apparaissent instantanément dans votre dashboard avancé",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                        <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-muted rounded-3xl p-12 text-center backdrop-blur-sm border border-border">
                  <div className="w-40 h-40 bg-card rounded-3xl shadow-2xl mx-auto mb-8 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
                    <Smartphone className="w-20 h-20 text-primary" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Testez Maintenant</h4>
                  <p className="text-muted-foreground mb-8 text-lg">Découvrez l'expérience client révolutionnaire</p>
                  <Link href="/feedback?id=EMP001">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Démo Interactive
                    </Button>
                  </Link>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-400 rounded-full opacity-20 animate-pulse animation-delay-2000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-foreground py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Logo className="h-12 mb-6" />
          <p className="text-muted-foreground mb-6 text-lg">
            Révolutionnez votre feedback client avec la technologie NFC
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            <Globe className="w-6 h-6 text-muted-foreground" />
            <Shield className="w-6 h-6 text-muted-foreground" />
            <Zap className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ClientIn. Tous droits réservés. &bull; CEO &amp; Founder: AMAM ABIR
          </p>
        </div>
      </footer>
    </div>
  )
}
