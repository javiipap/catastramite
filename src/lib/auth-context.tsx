"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<User>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuarios de demostración iniciales
const INITIAL_USERS: User[] = [
  {
    id: "1",
    email: "admin@sede.gov",
    name: "María García",
  },
  {
    id: "2",
    email: "usuario@correo.com",
    name: "Juan Pérez",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar usuarios registrados
    const savedUsers = localStorage.getItem("sede_all_users")
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers))
    } else {
      setAllUsers(INITIAL_USERS)
      localStorage.setItem("sede_all_users", JSON.stringify(INITIAL_USERS))
    }

    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem("sede_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string) => {
    // Simulación de login
    const foundUser = allUsers.find((u) => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("sede_user", JSON.stringify(foundUser))
    } else {
      throw new Error("Credenciales inválidas")
    }
  }

  const register = async (email: string, _password: string, name: string): Promise<User> => {
    const existing = allUsers.find((u) => u.email === email)
    if (existing) {
      throw new Error("El usuario ya existe")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
    }

    const updatedUsers = [...allUsers, newUser]
    setAllUsers(updatedUsers)
    localStorage.setItem("sede_all_users", JSON.stringify(updatedUsers))

    setUser(newUser)
    localStorage.setItem("sede_user", JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sede_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
