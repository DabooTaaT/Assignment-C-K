import { cn } from "@/utils/cn";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts - last wins", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("handles falsy values", () => {
    expect(cn("foo", false, undefined, "bar")).toBe("foo bar");
  });
});
