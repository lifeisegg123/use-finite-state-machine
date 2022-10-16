import { renderHook } from "@testing-library/react";
import { FmsProvider } from "./context";

export const customRenderHook: typeof renderHook = (renderFunc, options) =>
  renderHook(renderFunc, {
    ...options,
    wrapper: ({ children }) => <FmsProvider>{children}</FmsProvider>,
  });
