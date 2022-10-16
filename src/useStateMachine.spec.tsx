import { createMachine } from "./fms";
import { useStateMachine } from "./useStateMachine";
import { act, renderHook } from "@testing-library/react";
import { customRenderHook } from "./testUtils";

describe("useStateMachine", () => {
  it("should change state", () => {
    const machine = createMachine({
      initial: "a",
      states: {
        a: {
          SEND_B: {
            state: "b",
          },
        },
        b: {
          SEND_C: {
            state: "c",
          },
        },
        c: {},
      },
    });
    const { result } = customRenderHook(() => useStateMachine(machine));
    expect(result.current[0]).toBe("a");
    act(() => {
      result.current[1]("SEND_B");
    });
    expect(result.current[0]).toBe("b");
    act(() => {
      result.current[1]("SEND_C");
    });
    expect(result.current[0]).toBe("c");
  });

  it("should trigger event", () => {
    const mock = jest.fn();
    const machine = createMachine({
      initial: "a",
      states: {
        a: {
          SEND_B: {
            state: "b",
            event: mock,
          },
        },
        b: {},
      },
    });
    const { result } = customRenderHook(() => useStateMachine(machine));
    expect(result.current[0]).toBe("a");
    act(() => {
      result.current[1]("SEND_B");
    });
    expect(result.current[0]).toBe("b");
    expect(mock).toBeCalledTimes(1);
  });

  it("should throw error when provider is not found", () => {
    const machine = createMachine({
      initial: "a",
      states: {
        a: {
          SEND_B: {
            state: "b",
          },
        },
        b: {},
      },
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useStateMachine(machine))).toThrowError();
  });
});
