'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { User, UserRole } from '@/lib/types'

interface FormState {
  name: string;
  age: string;
  role: UserRole;
}

export default function OnboardingForm({ name, role, age }: Pick<User, 'name' | 'role' | 'age'>) {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>({
    name: name || '',
    age: age?.toString() || '',
    role: role || 'slave',
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("OnboardingPage - Updating user with role:", formState.role);
      await authClient.updateUser({ ...formState, age: parseInt(formState.age) });

      // Refresh session to get updated user data
      await authClient.getSession();

      // Use the local 'role' variable which we know is what the user selected
      console.log("OnboardingPage - Redirecting to:", `/${formState.role}/headquarters`);
      router.push(`/${formState.role}/headquarters`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              name='name'
              value={formState.name}
              onChange={updateForm}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='age'>Age</Label>
            <Input
              id='age'
              name='age'
              type='number'
              value={formState.age}
              onChange={updateForm}
              required
              min={18}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select value={formState.role} onValueChange={(value) => setFormState({ ...formState, role: value as UserRole })} required>
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
  )
}