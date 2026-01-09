import React, { ReactNode } from 'react';

interface ProviderProps<TData, TArgs> {
  initialData: TData;
  args?: TArgs;
  children: ReactNode;
}

type WrapperProps = {
  children: ReactNode;
  params?: Promise<any> | any;
  searchParams?: Promise<any> | any;
}

export function withServerData<TData, TArgs = undefined, TQuery = undefined>(
  fetcher: (args: TArgs, options?: TQuery) => Promise<TData>,
  Provider: React.ComponentType<ProviderProps<TData, TArgs>>
) {
  return async (props: WrapperProps) => {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const data = await fetcher(params as TArgs, searchParams as TQuery);

    return (
      <Provider initialData={data} args={params as TArgs}>
        {props.children}
      </Provider>
    );
  };
}
