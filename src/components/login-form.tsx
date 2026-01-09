"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
// import { useDataStore } from "@/lib/data-store"
import { addUserToHeadquarters } from "@/lib/actions/users"
import { useSearchParams, useRouter } from "next/navigation"
import { verifyInviteToken } from "@/lib/tokens"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [inviteHeadquartersId, setInviteHeadquartersId] = useState<string | null>(null)

  const { login, register } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      const headquartersId = verifyInviteToken(token)
      if (headquartersId) {
        setInviteHeadquartersId(headquartersId)
        setIsLogin(false) // Switch to register mode
        setSuccess("You have been invited to join a headquarters. Register to continue.")
      } else {
        setError("The invitation link has expired or is invalid.")
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
        if (inviteHeadquartersId) {
            // Use server action to join headquarters
            await addUserToHeadquarters({
                userHeadquarters: {
                    userId: newUser.id,
                    headquartersId: inviteHeadquartersId,
                    role: "citizen"
                }
            })
        }
        setSuccess("Registration successful. Redirecting...")
        setTimeout(() => setSuccess(""), 3000)
      }
      // Redirect handled by page effect or just reload to pick up state
      window.location.reload() // Simple way to refresh auth state in app
    } catch (_err) {
      setError(isLogin ? "Invalid credentials." : "Error registering user. Email might already exist.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "E-Government Portal" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {inviteHeadquartersId 
            ? "Register to accept the invitation" 
            : isLogin 
              ? "Enter your credentials to access" 
              : "Complete the form to register"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
              ? "Processing..." 
              : isLogin 
                ? "Login" 
                : inviteHeadquartersId 
                  ? "Register and Join" 
                  : "Register"}
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
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </form>
        {isLogin && (
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">Demo Users:</p>
            <div className="space-y-1 text-xs">
              <p>Admin: admin@sede.gov</p>
              <p>Citizen: usuario@correo.com</p>
              <p className="italic">Any password works</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
