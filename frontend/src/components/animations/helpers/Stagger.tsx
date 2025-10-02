import React, {
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';

type StaggerProps = PropsWithChildren<{
  baseDelay?: number;
  step?: number;
}>;

type WithDelay = { delay?: number };

export function Stagger({ children, baseDelay = 0, step = 80 }: StaggerProps) {
  const items = React.Children.toArray(children) as ReactNode[];

  return (
    <>
      {items.map((child, i) => {
        if (!React.isValidElement(child)) return child;

        const propsObj = child.props as Record<string, unknown>;
        const prevDelay =
          typeof propsObj.delay === 'number' ? (propsObj.delay as number) : 0;

        return React.cloneElement(child as ReactElement<WithDelay>, {
          delay: baseDelay + i * step + prevDelay,
        });
      })}
    </>
  );
}
