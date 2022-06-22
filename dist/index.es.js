import { useQuery, useQueryClient } from "react-query";
function useCreateState(stateKey, initialState) {
  return useQuery([stateKey], () => initialState, {
    initialData: initialState,
    refetchOnWindowFocus: false,
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnReconnect: false,
    suspense: false
  });
}
function useSetter(stateKey, data) {
  const queryClient = useQueryClient();
  function get(key) {
    return queryClient.getQueryData(key);
  }
  return function setter(newValue) {
    if (typeof newValue !== "function") {
      queryClient.setQueryData([stateKey], newValue);
    }
    if (newValue instanceof Function && data) {
      queryClient.setQueryData([stateKey], newValue(data, get));
    }
  };
}
function useEdgeState(stateKey, initialState) {
  const { data } = useCreateState(stateKey, initialState);
  const setter = useSetter(stateKey, data);
  return [data || initialState, setter];
}
function useEdgeContext(stateKey, initialState) {
  const { data } = useCreateState(stateKey, initialState);
  const setter = useSetter(stateKey, data);
  return [data || initialState, setter];
}
export { useEdgeContext, useEdgeState };
