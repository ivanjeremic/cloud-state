import { useQuery, useQueryClient } from "react-query";

/**
 * @description internal useCreateState
 */
function useCreateState(stateKey: string, initialState: any) {
  return useQuery([stateKey], () => initialState, {
    initialData: initialState,
    refetchOnWindowFocus: false,
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnReconnect: false,
    suspense: false,
  });
}

/**
 * @description internal useSetter hook
 */
function useSetter<T extends string, S>(stateKey: T, data: S) {
  const queryClient = useQueryClient();

  return (newValue: S | ((val: S, get: any) => S)) => {
    if (typeof newValue !== "function") {
      queryClient.setQueryData([stateKey], newValue);
    }

    if (newValue instanceof Function && data) {
      queryClient.setQueryData(
        [stateKey],
        newValue(data, (key: string) => queryClient.getQueryData([key]))
      );
    }
  };
}

/**
 * Edge State
 * @description creates an read/write edgeState.
 */
export function useEdgeState<T extends string, S>(
  stateKey: T,
  initialState: S
) {
  const { data } = useCreateState(stateKey, initialState);
  const setter = useSetter(stateKey, data);

  return [data || initialState, setter];
}

/**
 * Edge Context
 * @description read/write an existing state created by useCreateCloudState
 */
export function useEdgeContext<T extends string, S>(
  stateKey: T,
  initialState: S
) {
  const { data } = useCreateState(stateKey, initialState);
  const setter = useSetter(stateKey, data);

  return [data || initialState, setter] as const;
}
