"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Home,
  MessageSquare,
  BarChart3,
  Settings,
  Search,
  TrendingUp,
} from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

interface Employee {
  id: string
  cin_number: string
  full_name: string
  position: string
  department?: string
  photo_url?: string
  qr_code_id?: string
  qr_code_url?: string
  qr_code_style?: {
    color: string
    background: string
    logo: boolean
  }
  qr_scans?: number
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
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      // Mock data - replace with actual Supabase query
      const mockEmployees: Employee[] = [
        {
          id: "1",
          cin_number: "AB123456",
          full_name: "Mohammed Benali",
          position: "Serveur",
          department: "Restaurant",
          photo_url: "/placeholder.svg?height=40&width=40",
          qr_code_id: "QR001",
          qr_code_url: `${window.location.origin}/feedback?id=1&source=qr`,
          qr_code_style: { color: "#7c3aed", background: "#ffffff", logo: true },
          qr_scans: 24,
        },
        {
          id: "2",
          cin_number: "CD789012",
          full_name: "Sarah Khalil",
          position: "Caissière",
          department: "Vente",
          photo_url: "/placeholder.svg?height=40&width=40",
          qr_code_id: "QR002",
          qr_code_url: `${window.location.origin}/feedback?id=2&source=qr`,
          qr_code_style: { color: "#059669", background: "#ffffff", logo: true },
          qr_scans: 18,
        },
        {
          id: "3",
          cin_number: "EF345678",
          full_name: "Meriem Alami",
          position: "Conseillère",
          department: "Service Client",
          photo_url: "/placeholder.svg?height=40&width=40",
          qr_code_id: "QR003",
          qr_code_url: `${window.location.origin}/feedback?id=3&source=qr`,
          qr_code_style: { color: "#dc2626", background: "#ffffff", logo: true },
          qr_scans: 31,
        },
      ]

      setEmployees(mockEmployees)

      const total = mockEmployees.length
      const scanned = mockEmployees.filter((emp) => (emp.qr_scans || 0) > 0).length
      const generated = mockEmployees.filter((emp) => emp.qr_code_id).length

      setStats({ total, scanned, generated })
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = (employee: Employee, style = qrStyle) => {
    const size = 300
    const data = encodeURIComponent(employee.qr_code_url || "")
    const color = style.color.replace("#", "")
    const bgColor = style.background.replace("#", "")

    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}&color=${color}&bgcolor=${bgColor}&format=png&ecc=M&margin=1`
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
    link.download = `qr-code-${employee.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cin_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement des QR codes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 p-4">
        <div className="mb-8">
          <Logo className="h-8 mb-2" />
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/employees">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <Users className="mr-3 h-4 w-4" />
              Employés
            </Button>
          </Link>
          <Link href="/dashboard/feedbacks">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedbacks
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start bg-purple-600 text-white hover:bg-purple-700">
            <QrCode className="mr-3 h-4 w-4" />
            QR Codes
          </Button>
          <Link href="/dashboard/insights">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
              <BarChart3 className="mr-3 h-4 w-4" />
              Insight
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700">
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
            <h1 className="text-2xl font-bold">Gestion QR Codes</h1>
            <p className="text-gray-400">Gérez les QR codes de vos employés</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white w-64"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Régénérer Tous
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">QR Codes Générés</p>
                  <p className="text-3xl font-bold text-white">{stats.generated}</p>
                </div>
                <QrCode className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">QR Codes Scannés</p>
                  <p className="text-3xl font-bold text-white">{stats.scanned}</p>
                </div>
                <Eye className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Taux d'Utilisation</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.total > 0 ? Math.round((stats.scanned / stats.total) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Codes Grid */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">QR Codes des Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className="bg-gray-700 border-gray-600 hover:border-purple-500 transition-colors"
                >
                  <CardContent className="p-6">
                    {/* Employee Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.photo_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gray-600 text-white">
                          {employee.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{employee.full_name}</h3>
                        <p className="text-gray-400 text-sm">{employee.position}</p>
                        <p className="text-gray-500 text-xs">CIN: {employee.cin_number}</p>
                      </div>
                    </div>

                    {/* QR Code Preview */}
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-500 mb-4">
                      <div className="text-center">
                        <img
                          src={generateQRCode(employee, employee.qr_code_style) || "/placeholder.svg"}
                          alt={`QR Code ${employee.full_name}`}
                          className="w-32 h-32 mx-auto mb-2"
                        />
                        <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
                          {employee.qr_code_id}
                        </Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                      <span>Scans: {employee.qr_scans || 0}</span>
                      <span>Actif</span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
                          onClick={() => copyToClipboard(employee.qr_code_url || "", employee.id)}
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
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
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
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setQrStyle(employee.qr_code_style || qrStyle)
                            }}
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            Personnaliser
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle>Personnaliser QR Code - {selectedEmployee?.full_name}</DialogTitle>
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
                                  <Label htmlFor="color" className="text-white">
                                    Couleur du QR Code
                                  </Label>
                                  <Input
                                    id="color"
                                    type="color"
                                    value={qrStyle.color}
                                    onChange={(e) => setQrStyle((prev) => ({ ...prev, color: e.target.value }))}
                                    className="h-10 bg-gray-700 border-gray-600"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="background" className="text-white">
                                    Couleur de fond
                                  </Label>
                                  <Input
                                    id="background"
                                    type="color"
                                    value={qrStyle.background}
                                    onChange={(e) => setQrStyle((prev) => ({ ...prev, background: e.target.value }))}
                                    className="h-10 bg-gray-700 border-gray-600"
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
                                  <Label htmlFor="logo" className="text-white">
                                    Inclure le logo ClientIn
                                  </Label>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600 bg-transparent"
                                  onClick={() => setQrStyle(selectedEmployee.qr_code_style || qrStyle)}
                                >
                                  Annuler
                                </Button>
                                <Button
                                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                                  onClick={() => {
                                    // Update QR style logic here
                                    console.log("Updating QR style:", qrStyle)
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
      </div>
    </div>
  )
}
