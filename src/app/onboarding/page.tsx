'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { UserRole } from '@/lib/types'

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (session?.user.role) {
    router.push(`/${session.user.role}/headquarters`);
    return null;
  }

  // Prefill name if available
  const [name, setName] = useState(session?.user?.name || '');
  const [age, setAge] = useState<string>('');
  const [role, setRole] = useState<UserRole>('slave');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authClient.updateUser({ name, age: parseInt(age), role });

      const { data: session } = await authClient.getSession();

      router.push(`/${session?.user.role ?? 'slave'}/headquarters`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Welcome to Catastramite</CardTitle>
          <CardDescription>Please complete your profile to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='age'>Age</Label>
              <Input
                id='age'
                type='number'
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min={18}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='role'>Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
                <SelectTrigger>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='master'>Master</SelectItem>
                  <SelectItem value='slave'>Slave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
