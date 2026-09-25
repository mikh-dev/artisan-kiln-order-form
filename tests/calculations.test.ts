import assert from "node:assert/strict";
import test from "node:test";
import { calculateOrder } from "../lib/calculations.ts";

test("adds paid shipping below the threshold", () => {
  assert.deepEqual(calculateOrder([{ price: 28, quantity: 4 }]), {
    subtotal: 112,
    shipping: 25,
    total: 137,
  });
});

test("still charges shipping at exactly $500", () => {
  assert.deepEqual(calculateOrder([{ price: 25, quantity: 20 }]), {
    subtotal: 500,
    shipping: 25,
    total: 525,
  });
});

test("makes shipping free above $500", () => {
  assert.deepEqual(calculateOrder([{ price: 30, quantity: 17 }]), {
    subtotal: 510,
    shipping: 0,
    total: 510,
  });
});

test("keeps an empty cart at zero", () => {
  assert.deepEqual(calculateOrder([]), {
    subtotal: 0,
    shipping: 0,
    total: 0,
  });
});
