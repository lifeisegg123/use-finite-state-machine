type UnionToIntersection<T> = (
  T extends unknown ? (x: T) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never;

export type Machine<T, S extends string> = {
  [k in S]: {
    [k: string]: {
      state: S;
      contextUpdater?: (prev: T, ...args: any[]) => T;
      event?: ({
        from,
        context,
        to,
      }: {
        from: S;
        to: S;
        context: T;
      }) => Promise<void> | void;
    };
  };
};

type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

interface CreateMachineProps<TContext, TMachine> {
  context?: TContext;
  initial: MachineState<TMachine>;
  states: TMachine;
}

export interface StateMachineInstance<TContext, TMachine> {
  getState: () => MachineState<TMachine>;
  subscribeState: (listener: VoidFunction) => VoidFunction;
  subscribeContext: (listener: VoidFunction) => VoidFunction;
  send: <
    TEvent extends MachineEvent<TMachine>,
    TState extends UnionToIntersection<TMachine[MachineState<TMachine>]>
  >(
    event: TEvent,
    ...args: TState[TEvent] extends {
      contextUpdater: (context: TContext, ...args: infer Arg) => TContext;
      state: any;
      event?: any;
    }
      ? Arg
      : never
  ) => void;
  getContext: () => TContext;
}

export interface StateMachine<T, M> {
  init(): StateMachineInstance<T, M>;
}

export function createMachine<T, M extends Machine<T, string>>({
  initial,
  states,
  context,
}: CreateMachineProps<T, M>): StateMachine<T, M> {
  return {
    init: () => {
      let state = initial;
      let stateListeners = new Set<VoidFunction>();
      let contextListeners = new Set<VoidFunction>();
      let contextValue = context;

      const handleSubscribeState =
        (listenerSet: Set<VoidFunction>) => (listener: VoidFunction) => {
          listenerSet.add(listener);
          return () => {
            listenerSet.delete(listener);
          };
        };
      return {
        getState: () => state,
        subscribeState: handleSubscribeState(stateListeners),
        subscribeContext: handleSubscribeState(contextListeners),
        send: (event, ...args) => {
          const nextState =
            states[state][event as keyof typeof states[keyof M]];

          if (!nextState) return;
          if (nextState.contextUpdater) {
            contextValue = nextState.contextUpdater(contextValue as T, ...args);
            contextListeners.forEach((listener) => listener());
          }
          nextState.event?.({
            from: state as string,
            to: nextState.state as string,
            context: contextValue as T,
          });
          state = nextState.state as keyof M;
          stateListeners.forEach((listener) => listener());
        },
        getContext: () => contextValue as T,
      };
    },
  };
}
