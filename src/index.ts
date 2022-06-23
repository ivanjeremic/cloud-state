import { useQuery, useQueryClient } from "react-query";

type Get = () => unknown;
type Setter<S> = (v: S | ((prev?: S, get?: Get) => S)) => void;
type EdgeState<S> = [S, Setter<S>];

/**
 * @description internal UseQueryOptions
 */
const options = (initialData: any) => ({
  initialData,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  keepPreviousData: true,
  cacheTime: 0,
  suspense: false,
});

/**
 * @description internal useGetContext
 */
function useGetContext<T extends string, S>(stateKey: T, initialState: S) {
  return useQuery([stateKey], options(initialState));
}

/**
 * @description internal useCreateState
 */
function useCreateState<T extends string, S>(stateKey: T, initialState: S) {
  return useQuery([stateKey], () => initialState, options(initialState));
}

/**
 * @description internal useSetter
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
): EdgeState<S> {
  const state = useCreateState(stateKey, initialState);
  const setter = useSetter(stateKey, state.data);

  return [state.data || initialState, setter];
}

/**
 * Edge Context
 * @description read/write an existing state created by useEdgeContext
 */
export function useEdgeContext<T extends string, S>(
  stateKey: T,
  initialState: S
): EdgeState<S> {
  const context = useGetContext(stateKey, initialState);
  const setter = useSetter(stateKey, context.data);

  return [context.data || initialState, setter];
}
