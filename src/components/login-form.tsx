"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
// import { useDataStore } from "@/lib/data-store"
import { addUserToSede } from "@/lib/actions/users"
import { useSearchParams, useRouter } from "next/navigation"
import { verifyInviteToken } from "@/lib/tokens"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { addUserToSede } from "@/lib/data-actions" // Duplicate removed

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [inviteSedeId, setInviteSedeId] = useState<string | null>(null)

  const { login, register } = useAuth()
  // const { addUserToSede } = useDataStore() // Legacy
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      const sedeId = verifyInviteToken(token)
      if (sedeId) {
        setInviteSedeId(sedeId)
        setIsLogin(false) // Switch to register mode
        setSuccess("Has sido invitado a unirte a una sede. Regístrate para continuar.")
      } else {
        setError("El enlace de invitación ha expirado o no es válido.")
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        const newUser = await register(email, password, name)
        if (inviteSedeId) {
            // Use server action to join sede
            await addUserToSede({
                userSede: {
                    userId: newUser.id,
                    sedeId: inviteSedeId,
                    role: "administrado"
                }
            })
        }
        setSuccess("Registro exitoso. Redirigiendo...")
        setTimeout(() => setSuccess(""), 3000)
      }
      // Redirect handled by page effect or just reload to pick up state
      window.location.reload() // Simple way to refresh auth state in app
    } catch (_err) {
      setError(isLogin ? "Credenciales inválidas." : "Error al registrar usuario. Puede que el correo ya exista.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Sede Electrónica" : "Crear Cuenta"}
        </CardTitle>
        <CardDescription className="text-center">
          {inviteSedeId 
            ? "Regístrate para aceptar la invitación" 
            : isLogin 
              ? "Ingrese sus credenciales para acceder" 
              : "Complete el formulario para registrarse"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? "Procesando..." 
              : isLogin 
                ? "Iniciar Sesión" 
                : inviteSedeId 
                  ? "Registrarse y Unirse" 
                  : "Registrarse"}
          </Button>
          
          <div className="text-center text-sm">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setSuccess("")
              }}
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </form>
        {isLogin && (
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">Usuarios de demostración:</p>
            <div className="space-y-1 text-xs">
              <p>Administrador: admin@sede.gov</p>
              <p>Administrado: usuario@correo.com</p>
              <p className="italic">Cualquier contraseña funciona</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
