import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";
import type { StateMachine } from "./fms";
import { useFmsStore } from "./useFmsStore";

export const useMachineContext = <T, M>(stateMachine: StateMachine<T, M>) => {
  const machineInstance = useFmsStore(stateMachine);

  return useSyncExternalStore(
    machineInstance.subscribeContext,
    machineInstance.getContext,
    machineInstance.getContext
  );
};
