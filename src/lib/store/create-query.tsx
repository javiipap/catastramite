'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface CreateQueryStoreOptions<
  TData,
  TArgs = undefined,
  TQuery = undefined
> {
  baseQueryKey: string[];
  clientFetcher: (
    args: TArgs,
    options?: TQuery
  ) => Promise<TData>;
}

interface ProviderProps<TData, TArgs, TQuery> {
  initialData: TData;
  initialOptions?: TQuery;
  args?: TArgs;
  children: ReactNode;
}

interface StoreContextValue<TData, TQuery> {
  data: TData;
  isLoading: boolean;
  isFetching: boolean;
  queryOptions: TQuery | undefined;
  setQueryOptions: Dispatch<SetStateAction<TQuery | undefined>>;
  refetch: () => void;
}

export function createQueryStore<TData, TArgs = undefined, TQuery = undefined>(
  options: CreateQueryStoreOptions<TData, TArgs, TQuery>
) {
  const DataContext = createContext<
    StoreContextValue<TData, TQuery> | undefined
  >(undefined);

  const Provider = ({
    initialData,
    initialOptions,
    args,
    children,
  }: ProviderProps<TData, TArgs, TQuery>) => {
    const [queryOptions, setQueryOptions] = useState<TQuery | undefined>(
      initialOptions
    );

    const queryKeyArgs = useMemo(() => {
      return Object.values((args ?? {}) as Record<string, unknown>);
    }, [args]);

    const query = useQuery({
      queryKey: [...options.baseQueryKey, ...queryKeyArgs],
      queryFn: () => options.clientFetcher(args as TArgs, queryOptions),
      initialData: initialData,
      staleTime: 1000 * 60 * 5,
      placeholderData: keepPreviousData,
    });

    const value: StoreContextValue<TData, TQuery> = {
      data: query.data as TData,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      refetch: query.refetch,
      queryOptions,
      setQueryOptions,
    };

    return (
      <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
  };

  const useStore = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
      throw new Error('useStore debe usarse dentro de su Provider');
    }

    return context;
  };

  return { Provider, useStore };
}
