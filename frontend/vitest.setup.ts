import "@testing-library/jest-dom/vitest";

if (!globalThis.crypto?.randomUUID) {
  // jsdom doesn't always provide a full Web Crypto implementation.
  Object.defineProperty(globalThis, "crypto", {
    value: { randomUUID: () => Math.random().toString(36).slice(2) },
  });
}
