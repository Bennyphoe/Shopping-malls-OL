export type DistanceResult = Record<string, {
    distance: string;
    duration: string;
}>;
export declare const useGetDistanceBetweenAddressQuery: (origin: string, destinations: string[]) => import("@tanstack/react-query").UseQueryResult<DistanceResult | undefined, Error>;
//# sourceMappingURL=UseGetProximityQuery.d.ts.map