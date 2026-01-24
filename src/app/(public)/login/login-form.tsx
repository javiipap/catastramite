"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm() {
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || undefined

  const handleLogin = async () => {
    try {
      await loginAction(redirectUrl)
    } catch {
      setError("Failed to initiate login")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In to Catastramite
        </CardTitle>
        <CardDescription className="text-center">
          Use your Google account to access the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full" onClick={handleLogin}>
            Sign in with Google
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
