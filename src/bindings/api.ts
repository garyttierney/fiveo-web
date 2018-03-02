export type FiveoMatcher = number;
export type FiveoSearchCursor = number;

export interface FiveoFfi {
    matcher_create(buffer: Uint8Array, length: number): FiveoMatcher
    matcher_search(matcher: FiveoMatcher, query: string): void;
}