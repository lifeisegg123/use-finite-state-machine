import { createMachine } from "./fms";
import { useMachineContext } from "./useMachineContext";
import { useStateMachine } from "./useStateMachine";
import { act } from "@testing-library/react";
import { customRenderHook } from "./testUtils";

describe("useMachineContext", () => {
  it("should change state", () => {
    const machine = createMachine({
      initial: "a",
      context: 0,
      states: {
        a: {
          SEND_B: {
            state: "b",
            contextUpdater: (context) => context + 1,
          },
        },
        b: {
          SEND_C: {
            contextUpdater: (context) => context + 2,
            state: "c",
          },
        },
        c: {},
      },
    });

    const { result } = customRenderHook(
      () => [useMachineContext(machine), useStateMachine(machine)] as const
    );

    expect(result.current[0]).toBe(0);
    act(() => {
      result.current[1][1]("SEND_B");
    });

    expect(result.current[0]).toBe(1);
    act(() => {
      result.current[1][1]("SEND_C");
    });

    expect(result.current[0]).toBe(3);
  });
});
