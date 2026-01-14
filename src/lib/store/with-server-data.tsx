import React, { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { User } from 'better-auth';
import { redirect } from 'next/navigation';

interface ProviderProps<TData, TArgs = {}> { // eslint-disable-line @typescript-eslint/no-empty-object-type
  initialData: TData;
  args: TArgs;
  children: ReactNode;
  user: User;
}

type WrapperProps<TArgs> = {
  children: ReactNode;
  params: Promise<TArgs>;
}

type SafeAction<TOutput, TInput> = (input: TInput) => Promise<{
  data?: TOutput;
  serverError?: Error;
  validationErrors?: unknown;
}>;

export function withServerData<TData, TArgs = {}>( // eslint-disable-line @typescript-eslint/no-empty-object-type
  action: SafeAction<TData, TArgs>,
  Provider: React.ComponentType<ProviderProps<TData, TArgs>>
) {
  return async function StoreProvider(props: WrapperProps<TArgs>) {
    const params = await props.params;

    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      redirect('/login');
    }

    const hasParams = params && Object.keys(params).length > 0;
    const input = hasParams ? params : undefined;
    const result = await action(input as TArgs);

    if (result?.serverError) {
      throw result.serverError;
    }

    if (result?.validationErrors) {
      throw new Error("Validation Error: " + JSON.stringify(result.validationErrors));
    }

    return (
      <Provider initialData={result.data as TData} args={params} user={session.user}>
        {props.children}
      </Provider>
    );
  };
}
