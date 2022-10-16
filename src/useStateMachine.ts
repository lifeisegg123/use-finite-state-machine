import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";
import type { StateMachine } from "./fms";
import { useFmsStore } from "./useFmsStore";

export const useStateMachine = <T, M>(stateMachine: StateMachine<T, M>) => {
  const machineInstance = useFmsStore(stateMachine);

  return [
    useSyncExternalStore(
      machineInstance.subscribeState,
      machineInstance.getState,
      machineInstance.getState
    ),
    machineInstance.send,
  ] as const;
};
