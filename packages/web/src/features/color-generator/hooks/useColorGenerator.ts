/**
 * useColorGenerator
 * Thin hook that wraps the Zustand store.
 * Components import this instead of the store directly
 * so we can swap the implementation later if needed.
 */
export { useColorGeneratorStore as useColorGenerator } from '@/store/colorGenerator';