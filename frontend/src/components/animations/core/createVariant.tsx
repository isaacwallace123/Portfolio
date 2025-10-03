import type { AnimName, VariantProps } from '../types';
import { Animation } from './Animation';

export function createVariant(name: AnimName) {
  return function Variant(props: VariantProps) {
    return <Animation name={name} {...props} />;
  };
}
