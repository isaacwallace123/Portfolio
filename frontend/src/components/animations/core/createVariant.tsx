import { Animation } from './Animation';
import type { AnimName, VariantProps } from './types';

export function createVariant(name: AnimName) {
  return function Variant(props: VariantProps) {
    return <Animation name={name} {...props} />;
  };
}
