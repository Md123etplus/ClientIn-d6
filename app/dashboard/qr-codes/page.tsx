"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  QrCode,
  Download,
  Eye,
  Palette,
  RefreshCw,
  Copy,
  Check,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useTheme } from "next-themes"

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
  qr_code_id: string
  qr_code_url: string
  qr_code_style: {
    color: string
    background: string
    logo: boolean
  }
  qr_code_generated_at: string
}

interface QRCodeStats {
  total: number
  scanned: number
  generated: number
}

export default function QRCodesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<QRCodeStats>({ total: 0, scanned: 0, generated: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [qrStyle, setQrStyle] = useState({
    color: "#7c3aed",
    background: "#ffffff",
    logo: true,
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchEmployees()
    fetchStats()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase.from("employees").select("*").order("name")

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data: qrData } = await supabase.from("qr_codes").select("scans_count")
      const { data: employeeData } = await supabase.from("employees").select("qr_code_id")

      if (qrData && employeeData) {
        const total = employeeData.length
        const scanned = qrData.filter((qr) => qr.scans_count > 0).length
        const generated = employeeData.filter((emp) => emp.qr_code_id).length

        setStats({ total, scanned, generated })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const generateQRCode = (employee: Employee, style = qrStyle) => {
    const size = 300
    const data = encodeURIComponent(employee.qr_code_url)
    const color = style.color.replace("#", "")
    const bgColor = style.background.replace("#", "")

    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}&color=${color}&bgcolor=${bgColor}&format=png&ecc=M&margin=1`
  }

  const updateQRStyle = async (employeeId: string, newStyle: typeof qrStyle) => {
    try {
      const { error } = await supabase
        .from("employees")
        .update({
          qr_code_style: newStyle,
          qr_code_generated_at: new Date().toISOString(),
        })
        .eq("id", employeeId)

      if (error) throw error

      // Update local state
      setEmployees((prev) => prev.map((emp) => (emp.id === employeeId ? { ...emp, qr_code_style: newStyle } : emp)))
    } catch (error) {
      console.error("Error updating QR style:", error)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }

  const downloadQRCode = (employee: Employee) => {
    const qrUrl = generateQRCode(employee, employee.qr_code_style)
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `qr-code-${employee.name.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des QR codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Logo className="h-8 w-auto" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Gestion QR Codes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <TrendingUp className="w-5 h-5 mr-3" />
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
              <Users className="w-5 h-5 mr-3" />
              Employés
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
              <MessageSquare className="w-5 h-5 mr-3" />
              Feedbacks
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white bg-purple-600">
              <QrCode className="w-5 h-5 mr-3" />
              QR Codes
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
              <TrendingUp className="w-5 h-5 mr-3" />
              Insight
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
              <Settings className="w-5 h-5 mr-3" />
              Paramètres
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">QR Codes Générés</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.generated}</p>
                  </div>
                  <QrCode className="w-12 h-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">QR Codes Scannés</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.scanned}</p>
                  </div>
                  <Eye className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taux d'Utilisation</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.total > 0 ? Math.round((stats.scanned / stats.total) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Codes Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>QR Codes des Employés</span>
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Régénérer Tous
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <Card key={employee.id} className="border-2 hover:border-purple-300 transition-colors">
                    <CardContent className="p-6">
                      {/* Employee Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={employee.photo_url || "/placeholder.svg"}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                        </div>
                      </div>

                      {/* QR Code Preview */}
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 mb-4">
                        <div className="text-center">
                          <img
                            src={generateQRCode(employee, employee.qr_code_style) || "/placeholder.svg"}
                            alt={`QR Code ${employee.name}`}
                            className="w-32 h-32 mx-auto mb-2"
                          />
                          <Badge variant="outline" className="text-xs">
                            {employee.qr_code_id}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => copyToClipboard(employee.qr_code_url, employee.id)}
                          >
                            {copiedId === employee.id ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copiedId === employee.id ? "Copié!" : "URL"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => downloadQRCode(employee)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PNG
                          </Button>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedEmployee(employee)
                                setQrStyle(employee.qr_code_style)
                              }}
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              Personnaliser
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Personnaliser QR Code - {selectedEmployee?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedEmployee && (
                              <div className="space-y-4">
                                {/* Preview */}
                                <div className="text-center">
                                  <img
                                    src={generateQRCode(selectedEmployee, qrStyle) || "/placeholder.svg"}
                                    alt="QR Code Preview"
                                    className="w-48 h-48 mx-auto border rounded-lg"
                                  />
                                </div>

                                {/* Style Options */}
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="color">Couleur du QR Code</Label>
                                    <Input
                                      id="color"
                                      type="color"
                                      value={qrStyle.color}
                                      onChange={(e) => setQrStyle((prev) => ({ ...prev, color: e.target.value }))}
                                      className="h-10"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="background">Couleur de fond</Label>
                                    <Input
                                      id="background"
                                      type="color"
                                      value={qrStyle.background}
                                      onChange={(e) => setQrStyle((prev) => ({ ...prev, background: e.target.value }))}
                                      className="h-10"
                                    />
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="logo"
                                      checked={qrStyle.logo}
                                      onChange={(e) => setQrStyle((prev) => ({ ...prev, logo: e.target.checked }))}
                                      className="rounded"
                                    />
                                    <Label htmlFor="logo">Inclure le logo ClientIn</Label>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setQrStyle(selectedEmployee.qr_code_style)}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    className="flex-1"
                                    onClick={() => {
                                      updateQRStyle(selectedEmployee.id, qrStyle)
                                    }}
                                  >
                                    Sauvegarder
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
