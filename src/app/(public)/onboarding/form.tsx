'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'
import { isValidRedirect } from '@/lib/utils'
import { updateUserAction } from '@/lib/actions/users'

interface FormState {
  name: string;
  age: string;
}

interface OnboardingFormProps extends Partial<User> {
  callbackUrl?: string;
}

export default function OnboardingForm({ name, age, callbackUrl }: OnboardingFormProps) {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>({
    name: name || '',
    age: age?.toString() || '',
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
      const result = await updateUserAction({
        name: formState.name,
        age: parseInt(formState.age)
      });

      if (result?.serverError || result?.validationErrors) {
        console.error(result.serverError || result.validationErrors);
        setIsLoading(false);
        return;
      }

      let targetUrl = `/headquarters`;
      if (callbackUrl && isValidRedirect(callbackUrl)) {
        targetUrl = callbackUrl;
      }

      router.push(targetUrl);
      router.refresh();
    } catch (err) {
      console.error(err);
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