import { createMachine } from "./fms";

describe("fms", () => {
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

    const instance = machine.init();

    expect(instance.getState()).toBe("a");
    instance.send("SEND_B");
    expect(instance.getState()).toBe("b");
    instance.send("SEND_C");
    expect(instance.getState()).toBe("c");
  });
  it("should not change state to unintended state", () => {
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

    const instance = machine.init();

    expect(instance.getState()).toBe("a");
    instance.send("SEND_C");
    expect(instance.getState()).toBe("a");
  });

  it("should change context", () => {
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
            state: "c",
            contextUpdater: (context) => context + 1,
          },
        },
        c: {},
      },
    });

    const instance = machine.init();

    expect(instance.getContext()).toBe(0);
    instance.send("SEND_B");
    expect(instance.getContext()).toBe(1);
    instance.send("SEND_C");
    expect(instance.getContext()).toBe(2);
  });

  it("should update context with args", () => {
    const machine = createMachine({
      initial: "a",
      context: 0,
      states: {
        a: {
          SEND_B: {
            state: "b",
            contextUpdater: (context, value: number) => context + value,
          },
        },
        b: {
          SEND_C: {
            state: "c",
            contextUpdater: (context, value: number) => context + value,
          },
        },
        c: {},
      },
    });

    const instance = machine.init();

    expect(instance.getContext()).toBe(0);
    instance.send("SEND_B", 1);
    expect(instance.getContext()).toBe(1);
    instance.send("SEND_C", 2);
    expect(instance.getContext()).toBe(3);
  });

  it("should trigger event", () => {
    const machine = createMachine({
      initial: "a",
      context: 0,
      states: {
        a: {
          SEND_B: {
            state: "b",
            contextUpdater: (context) => context + 1,
            event: ({ context, from, to }) => {
              expect(context).toBe(1);
              expect(from).toBe("a");
              expect(to).toBe("b");
            },
          },
        },
        b: {
          SEND_C: {
            state: "c",
            contextUpdater: (context) => context + 1,
            event: ({ context, from, to }) => {
              expect(context).toBe(2);
              expect(from).toBe("b");
              expect(to).toBe("c");
            },
          },
        },
        c: {},
      },
    });

    const instance = machine.init();

    expect(instance.getContext()).toBe(0);
    instance.send("SEND_B");
    expect(instance.getContext()).toBe(1);
    instance.send("SEND_C");
    expect(instance.getContext()).toBe(2);
  });
});
