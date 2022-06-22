/**
 * Edge State
 * @description creates an read/write edgeState.
 */
export declare function useEdgeState<T extends string, S>(stateKey: T, initialState: S): any[];
/**
 * Edge Context
 * @description read/write an existing state created by useCreateCloudState
 */
export declare function useEdgeContext<T extends string, S>(stateKey: T, initialState: S): readonly [any, (newValue: any) => void];
