import { createContext, PropsWithChildren, useContext, useRef } from "react";
import type { StateMachineInstance, StateMachine } from "./fms";

type FmsContextProps = {
  store: WeakMap<StateMachine<any, any>, StateMachineInstance<any, any>>;
};

const FmsContext = createContext<FmsContextProps | null>(null);

export const FmsProvider = ({ children }: PropsWithChildren<{}>) => {
  const store = useRef(
    new WeakMap<StateMachine<any, any>, StateMachineInstance<any, any>>()
  );

  return (
    <FmsContext.Provider value={{ store: store.current }}>
      {children}
    </FmsContext.Provider>
  );
};

export const useFmsContext = () => {
  const store = useContext(FmsContext);
  if (!store) throw new Error("[fmsContext] Cannot find provider");
  return store;
};
