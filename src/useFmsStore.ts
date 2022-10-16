import { useFmsContext } from "./context";
import { StateMachine, StateMachineInstance } from "./fms";

export const useFmsStore = <T, M>(
  machine: StateMachine<T, M>
): StateMachineInstance<T, M> => {
  const { store } = useFmsContext();
  const instance = store.get(machine);
  if (instance) return instance;

  const newInstance = machine.init();
  store.set(machine, newInstance);
  return newInstance;
};
