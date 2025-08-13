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
import { supabase } from "@/lib/supabase" // Use the client-side Supabase client
import Link from "next/link"

interface Employee {
  id: string
  cin_number: string
  full_name: string
  position: string
  department?: string
  photo_url?: string
  qr_code_id?: string | null // Now UUID, can be null
  qr_code_url?: string // This will come from qr_codes.url
  qr_code_style?: {
    color: string
    background: string
    logo: boolean
  }
  qr_scans?: number // This will come from qr_codes.scans_count
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
    color: "#2563eb", // Pure blue
    background: "#ffffff", // Pure white
    logo: true,
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchEmployeesAndQRCodes()
  }, [])

  const fetchEmployeesAndQRCodes = async () => {
    try {
      setLoading(true)
      // Select employees and join with qr_codes to get all QR related data
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select(
          `
          id,
          cin_number,
          full_name,
          position,
          department,
          photo_url,
          qr_codes (
            id,
            url,
            style,
            scans_count
          )
        `,
        )
        .order("created_at", { ascending: false })

      if (employeesError) {
        console.error("Error fetching employees with QR codes:", employeesError)
        return
      }

      const mappedEmployees: Employee[] = employeesData.map((emp: any) => ({
        id: emp.id,
        cin_number: emp.cin_number,
        full_name: emp.full_name,
        position: emp.position,
        department: emp.department,
        photo_url: emp.photo_url,
        // Map from qr_codes relation
        qr_code_id: emp.qr_codes?.id || null,
        qr_code_url: emp.qr_codes?.url || `${window.location.origin}/feedback?id=${emp.id}&source=qr`,
        qr_code_style: emp.qr_codes?.style || { color: "#2563eb", background: "#ffffff", logo: true },
        qr_scans: emp.qr_codes?.scans_count || 0,
      }))

      setEmployees(mappedEmployees)

      const total = mappedEmployees.length
      const scanned = mappedEmployees.filter((emp) => (emp.qr_scans || 0) > 0).length
      const generated = mappedEmployees.filter((emp) => emp.qr_code_id).length

      setStats({ total, scanned, generated })
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateQRCodeImage = (employee: Employee, style: { color: string; background: string; logo: boolean }) => {
    const size = 300
    const data = encodeURIComponent(employee.qr_code_url || "")
    const color = style.color.replace("#", "")
    const bgColor = style.background.replace("#", "")

    // Note: The QR server API does not directly support embedding a logo from a URL.
    // For a true logo integration, you would need a more advanced QR code generation library
    // or service that supports image overlays. For now, the `logo` flag is illustrative.
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
    const qrUrl = generateQRCodeImage(employee, employee.qr_code_style || qrStyle)
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `qr-code-${employee.full_name.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSaveQrStyle = async () => {
    if (!selectedEmployee) return

    try {
      const { data, error } = await supabase
        .from("qr_codes")
        .upsert(
          {
            employee_id: selectedEmployee.id,
            url: selectedEmployee.qr_code_url, // Use 'url' column
            style: qrStyle, // Use 'style' column
            id: selectedEmployee.qr_code_id || undefined, // Use existing ID if available for update
          },
          { onConflict: "employee_id" },
        ) // Upsert based on employee_id
        .select()

      if (error) {
        console.error("Error saving QR style:", error)
        return
      }

      // Update local state with the new QR style and ID if it was an insert
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id
            ? {
                ...emp,
                qr_code_style: data[0].style,
                qr_code_id: data[0].id,
                qr_code_url: data[0].url,
                qr_scans: data[0].scans_count,
              }
            : emp,
        ),
      )
      setSelectedEmployee(null) // Close dialog
    } catch (error) {
      console.error("Error saving QR style:", error)
    }
  }

  const handleRegenerateAll = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir régénérer tous les QR codes ? Cela réinitialisera les styles personnalisés et les compteurs de scan.",
      )
    ) {
      return
    }

    setLoading(true)
    try {
      for (const employee of employees) {
        const defaultStyle = { color: "#2563eb", background: "#ffffff", logo: true }
        const defaultQrUrl = `${window.location.origin}/feedback?id=${employee.id}&source=qr`

        // Upsert into qr_codes table
        const { data: qrCodeData, error: qrCodeError } = await supabase
          .from("qr_codes")
          .upsert(
            {
              employee_id: employee.id,
              url: defaultQrUrl, // Use 'url' column
              style: defaultStyle, // Use 'style' column
              id: employee.qr_code_id || undefined,
              scans_count: 0, // Reset scan count on regeneration
            },
            { onConflict: "employee_id" },
          )
          .select()

        if (qrCodeError) {
          console.error(`Error upserting QR code for employee ${employee.id}:`, qrCodeError)
          // Continue to next employee even if one fails
        }
      }
      await fetchEmployeesAndQRCodes() // Re-fetch all data to update UI
    } catch (error) {
      console.error("Error regenerating all QR codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cin_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement des QR codes...</div>
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
          <Button
            variant="ghost"
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <QrCode className="mr-3 h-4 w-4" />
            QR Codes
          </Button>
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
            <h1 className="text-2xl font-bold">Gestion QR Codes</h1>
            <p className="text-muted-foreground">Gérez les QR codes de vos employés</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted border-border text-foreground w-64"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleRegenerateAll}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Régénérer Tous
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">QR Codes Générés</p>
                  <p className="text-3xl font-bold text-foreground">{stats.generated}</p>
                </div>
                <QrCode className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">QR Codes Scannés</p>
                  <p className="text-3xl font-bold text-foreground">{stats.scanned}</p>
                </div>
                <Eye className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Taux d'Utilisation</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total > 0 ? Math.round((stats.scanned / stats.total) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Codes Grid */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">QR Codes des Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  Aucun QR code trouvé. Assurez-vous que les employés existent et que leurs QR codes ont été générés.
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="bg-muted border-border hover:border-primary/80 transition-colors">
                    <CardContent className="p-6">
                      {/* Employee Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.photo_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {employee.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{employee.full_name}</h3>
                          <p className="text-muted-foreground text-sm">{employee.position}</p>
                          <p className="text-muted-foreground text-xs">CIN: {employee.cin_number}</p>
                        </div>
                      </div>

                      {/* QR Code Preview */}
                      <div className="bg-white p-4 rounded-lg border-2 border-dashed border-border mb-4">
                        <div className="text-center">
                          <img
                            src={generateQRCodeImage(employee, employee.qr_code_style || qrStyle)}
                            alt={`QR Code ${employee.full_name}`}
                            className="w-32 h-32 mx-auto mb-2"
                          />
                          <Badge variant="outline" className="text-xs border-muted-foreground text-muted-foreground">
                            {employee.qr_code_id || "Non généré"}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        <span>Scans: {employee.qr_scans || 0}</span>
                        <span>Actif</span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-border text-muted-foreground hover:bg-accent bg-transparent"
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
                            className="flex-1 border-border text-muted-foreground hover:bg-accent bg-transparent"
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
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={() => {
                                setSelectedEmployee(employee)
                                setQrStyle(
                                  employee.qr_code_style || { color: "#2563eb", background: "#ffffff", logo: true },
                                )
                              }}
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              Personnaliser
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md bg-card border-border text-foreground">
                            <DialogHeader>
                              <DialogTitle>Personnaliser QR Code - {selectedEmployee?.full_name}</DialogTitle>
                            </DialogHeader>
                            {selectedEmployee && (
                              <div className="space-y-4">
                                {/* Preview */}
                                <div className="text-center">
                                  <img
                                    src={generateQRCodeImage(selectedEmployee, qrStyle) || "/placeholder.svg"}
                                    alt="QR Code Preview"
                                    className="w-48 h-48 mx-auto border rounded-lg"
                                  />
                                </div>

                                {/* Style Options */}
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="color" className="text-foreground">
                                      Couleur du QR Code
                                    </Label>
                                    <Input
                                      id="color"
                                      type="color"
                                      value={qrStyle.color}
                                      onChange={(e) => setQrStyle((prev) => ({ ...prev, color: e.target.value }))}
                                      className="h-10 bg-muted border-border"
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="background" className="text-foreground">
                                      Couleur de fond
                                    </Label>
                                    <Input
                                      id="background"
                                      type="color"
                                      value={qrStyle.background}
                                      onChange={(e) => setQrStyle((prev) => ({ ...prev, background: e.target.value }))}
                                      className="h-10 bg-muted border-border"
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
                                    <Label htmlFor="logo" className="text-foreground">
                                      Inclure le logo ClientIn
                                    </Label>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-border text-muted-foreground hover:bg-accent bg-transparent"
                                    onClick={() => setSelectedEmployee(null)} // Close without saving
                                  >
                                    Annuler
                                  </Button>
                                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSaveQrStyle}>
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
