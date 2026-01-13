import React, { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { User } from 'better-auth';
import { redirect } from 'next/navigation';

interface ProviderProps<TData, TArgs> {
  initialData: TData;
  args?: TArgs;
  children: ReactNode;
  user: User;
}

type WrapperProps = {
  children: ReactNode;
  params?: Promise<any> | any;
  searchParams?: Promise<any> | any;
}

// Define compatible SafeAction type
type SafeAction<TInput, TOutput> = (input: TInput) => Promise<{
  data?: TOutput;
  serverError?: any;
  validationErrors?: unknown;
}>;

export function withServerData<TData, TArgs>(
  action: SafeAction<TArgs, TData>,
  Provider: React.ComponentType<ProviderProps<TData, TArgs>>
) {
  return async (props: WrapperProps) => {
    const params = await props.params;

    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      console.log('NO USER')
      redirect('/login');
    }

    const hasParams = params && Object.keys(params).length > 0;
    const input = hasParams ? params : undefined;
    const result = await action(input as TArgs);

    if (result?.serverError) {
      throw new Error(result.serverError);
    }

    if (result?.validationErrors) {
      throw new Error("Validation Error: " + JSON.stringify(result.validationErrors));
    }

    return (
      <Provider initialData={result.data as TData} args={params as TArgs} user={session.user}>
        {props.children}
      </Provider>
    );
  };
}
