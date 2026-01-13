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

export function withServerData<TData, TArgs = undefined>(
  fetcher: (args: TArgs, user: User) => Promise<TData>,
  Provider: React.ComponentType<ProviderProps<TData, TArgs>>
) {
  return async (props: WrapperProps) => {
    const params = await props.params;

    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      redirect('/onboarding');
    }

    const data = await fetcher(params as TArgs, session.user);

    return (
      <Provider initialData={data} args={params as TArgs} user={session.user}>
        {props.children}
      </Provider>
    );
  };
}
