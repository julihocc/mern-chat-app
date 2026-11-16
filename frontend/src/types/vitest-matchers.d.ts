import "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toHaveAttribute(name: string, value?: unknown): T;
    toHaveFocus(): T;
    toHaveAccessibleName(name?: string | RegExp): T;
  }
}
