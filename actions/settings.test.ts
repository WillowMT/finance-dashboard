import { beforeEach, expect, mock, test } from "bun:test";

let updateInput: unknown;
let invalidationTag: string | undefined;

mock.module("@/lib/auth", () => ({
  auth: async () => ({ user: { id: "user-1" } }),
}));

mock.module("@/lib/db", () => ({
  db: {
    user: {
      update: async (input: unknown) => {
        updateInput = input;
      },
    },
  },
}));

mock.module("next/cache", () => ({
  updateTag: (tag: string) => {
    invalidationTag = tag;
  },
}));

const { updateCurrency } = await import("./settings");

const previousState = {
  status: "idle" as const,
  currency: "USD",
  message: "Saved",
};

beforeEach(() => {
  updateInput = undefined;
  invalidationTag = undefined;
});

test("updates the signed-in user's currency and invalidates their cache", async () => {
  const formData = new FormData();
  formData.set("currency", "THB");

  const result = await updateCurrency(previousState, formData);

  expect(updateInput).toEqual({
    where: { id: "user-1" },
    data: { currency: "THB" },
  });
  expect(invalidationTag).toBe("user-user-1");
  expect(result).toEqual({
    status: "success",
    currency: "THB",
    message: "Saved",
  });
});

test("rejects unsupported currency codes without writing", async () => {
  const formData = new FormData();
  formData.set("currency", "BTC");

  const result = await updateCurrency(previousState, formData);

  expect(updateInput).toBeUndefined();
  expect(invalidationTag).toBeUndefined();
  expect(result).toEqual({
    ...previousState,
    status: "error",
    message: "Choose a supported currency.",
  });
});
