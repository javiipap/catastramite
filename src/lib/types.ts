export type UserRole = "administrador" | "administrado"

export interface Sede {
  id: string
  nombre: string
  descripcion?: string
  createdAt: Date
  userSedes?: UserSede[]
}

export interface UserSede {
  userId: string
  sedeId: string
  role: UserRole
}

export interface User {
  id: string
  email: string
  name: string
}

export interface TramiteType {
  id: string
  sedeId: string
  nombre: string
  descripcion: string
  campos: CampoFormulario[]
  createdAt: Date
  createdBy: string
}

export interface CampoFormulario {
  id: string
  nombre: string
  tipo: "texto" | "numero" | "fecha" | "email" | "textarea" | "select"
  requerido: boolean
  opciones?: string[]
}

export interface Solicitud {
  id: string
  sedeId: string
  tramiteTypeId: string
  tramiteTypeNombre: string
  solicitanteId: string
  solicitanteNombre: string
  estado: "pendiente" | "en_revision" | "aprobada" | "rechazada"
  datos: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  sedeId: string
  title: string
  message: string
  priority: "low" | "medium" | "high"
  createdAt: Date
  createdBy: string
}
