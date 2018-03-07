/**
 * Configuration interface for creating a {@link MatcherBinding}.  See property documentation for more details.
 */
export default interface MatcherBindingOptions {
    /**
     * The initial number of memory pages that should be allocated for this module (multiples of 64KiB).
     */
    initialMemoryPages: number;

    /**
     * The maximum number of memory pages that should be allocated for this module (multiples of 64KiB).
     */
    maxMemoryPages: number;

    /**
     * A flag indicating whether UTF-8 encoding is required.
     */
    utf8: boolean;
}
