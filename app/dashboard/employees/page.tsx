"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, QrCode, Users, Home, MessageSquare, BarChart3, Settings, User, Building } from 'lucide-react'
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
  hire_date?: string
  created_at: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    cin_number: "",
    full_name: "",
    position: "",
    department: "",
    photo_url: "",
    hire_date: "",
  })

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
          hire_date: "2023-01-15",
          created_at: "2023-01-15T10:00:00Z",
        },
        {
          id: "2",
          cin_number: "CD789012",
          full_name: "Sarah Khalil",
          position: "Caissière",
          department: "Vente",
          photo_url: "/placeholder.svg?height=40&width=40",
          hire_date: "2023-02-20",
          created_at: "2023-02-20T10:00:00Z",
        },
        {
          id: "3",
          cin_number: "EF345678",
          full_name: "Meriem Alami",
          position: "Conseillère",
          department: "Service Client",
          photo_url: "/placeholder.svg?height=40&width=40",
          hire_date: "2023-03-10",
          created_at: "2023-03-10T10:00:00Z",
        },
        {
          id: "4",
          cin_number: "GH901234",
          full_name: "Ahmed Tazi",
          position: "Chef de Cuisine",
          department: "Restaurant",
          photo_url: "/placeholder.svg?height=40&width=40",
          hire_date: "2022-11-05",
          created_at: "2022-11-05T10:00:00Z",
        },
        {
          id: "5",
          cin_number: "IJ567890",
          full_name: "Fatima Zahra",
          position: "Responsable RH",
          department: "Administration",
          photo_url: "/placeholder.svg?height=40&width=40",
          hire_date: "2022-08-12",
          created_at: "2022-08-12T10:00:00Z",
        },
      ]

      setEmployees(mockEmployees)
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async () => {
    try {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      }

      setEmployees([...employees, newEmployee])
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error("Error adding employee:", error)
    }
  }

  const handleEditEmployee = async () => {
    if (!editingEmployee) return

    try {
      const updatedEmployees = employees.map((emp) => (emp.id === editingEmployee.id ? { ...emp, ...formData } : emp))

      setEmployees(updatedEmployees)
      setEditingEmployee(null)
      resetForm()
    } catch (error) {
      console.error("Error updating employee:", error)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      setEmployees(employees.filter((emp) => emp.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      cin_number: "",
      full_name: "",
      position: "",
      department: "",
      photo_url: "",
      hire_date: "",
    })
  }

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      cin_number: employee.cin_number,
      full_name: employee.full_name,
      position: employee.position,
      department: employee.department || "",
      photo_url: employee.photo_url || "",
      hire_date: employee.hire_date || "",
    })
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cin_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement...</div>
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
          <Button variant="ghost" className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90">
            <Users className="mr-3 h-4 w-4" />
            Employés
          </Button>
          <Link href="/dashboard/feedbacks">
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent">
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedbacks
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
            <h1 className="text-2xl font-bold">Gestion des Employés</h1>
            <p className="text-muted-foreground">Gérez vos employés et leurs informations</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Employé
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border text-foreground">
              <DialogHeader>
                <DialogTitle>Ajouter un Employé</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cin">Numéro CIN *</Label>
                    <Input
                      id="cin"
                      value={formData.cin_number}
                      onChange={(e) => setFormData({ ...formData, cin_number: e.target.value })}
                      className="bg-muted border-border"
                      placeholder="AB123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nom Complet *</Label>
                    <Input
                      id="name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="bg-muted border-border"
                      placeholder="Mohammed Benali"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Poste *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="bg-muted border-border"
                      placeholder="Serveur"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className="w-full sm:w-48 bg-muted border-border">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Vente">Vente</SelectItem>
                        <SelectItem value="Service Client">Service Client</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Cuisine">Cuisine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hire_date">Date d'embauche</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="photo">URL Photo</Label>
                  <Input
                    id="photo"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    className="bg-muted border-border"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddEmployee} className="bg-primary hover:bg-primary/90">
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, CIN ou poste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted border-border text-foreground"
                  />
                </div>
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-muted border-border">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept!}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Employés</p>
                  <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Départements</p>
                  <p className="text-2xl font-bold text-foreground">{departments.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <User className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">QR Codes</p>
                  <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                </div>
                <QrCode className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Liste des Employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
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
                      <p className="text-muted-foreground text-sm">
                        {employee.position} • CIN: {employee.cin_number}
                      </p>
                      {employee.department && (
                        <Badge variant="outline" className="mt-1 border-border text-muted-foreground">
                          {employee.department}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:bg-accent bg-transparent"
                    >
                      <QrCode className="h-4 w-4 mr-1" />
                      QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(employee)}
                      className="border-border text-muted-foreground hover:bg-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Modifier l'Employé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cin">Numéro CIN *</Label>
                  <Input
                    id="edit-cin"
                    value={formData.cin_number}
                    onChange={(e) => setFormData({ ...formData, cin_number: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-name">Nom Complet *</Label>
                  <Input
                    id="edit-name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-position">Poste *</Label>
                  <Input
                    id="edit-position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Département</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className="bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Vente">Vente</SelectItem>
                      <SelectItem value="Service Client">Service Client</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Cuisine">Cuisine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-hire_date">Date d'embauche</Label>
                <Input
                  id="edit-hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>

              <div>
                <Label htmlFor="edit-photo">URL Photo</Label>
                <Input
                  id="edit-photo"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingEmployee(null)}>
                  Annuler
                </Button>
                <Button onClick={handleEditEmployee} className="bg-primary hover:bg-primary/90">
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
