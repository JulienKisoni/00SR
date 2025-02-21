import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";

describe("first", () => {
  test("loads and displays greeting", async () => {
    const x = 10;
    expect(x + 5).toEqual(15);
  });
});
