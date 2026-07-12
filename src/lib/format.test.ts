import { describe, expect, it } from "vitest";
import { formatCompactNumber, formatDelta, formatValue } from "./format";

describe("formatValue", () => {
  it("formats percent", () => {
    expect(formatValue(5.678, "percent")).toBe("5.7%");
  });

  it("formats currency-eur with no decimals", () => {
    expect(formatValue(42500, "currency-eur")).toBe("€42,500");
  });

  it("formats years with the localized unit", () => {
    expect(formatValue(81.2, "years", "en")).toBe("81.2 yrs");
    expect(formatValue(81.2, "years", "de")).toBe("81,2 Jahre");
  });

  it("formats plain numbers with no decimals", () => {
    expect(formatValue(1234567, "number")).toBe("1,234,567");
  });

  it("falls back to toLocaleString for an unknown/missing format", () => {
    expect(formatValue(1234, null)).toBe("1,234");
    expect(formatValue(1234, undefined)).toBe("1,234");
  });
});

describe("formatCompactNumber", () => {
  it("compacts large numbers", () => {
    expect(formatCompactNumber(84400000)).toBe("84.4M");
  });
});

describe("formatDelta", () => {
  it("returns null when there is no previous value to compare against", () => {
    expect(formatDelta(100, null)).toBeNull();
    expect(formatDelta(100, undefined)).toBeNull();
  });

  it("returns null when the previous value is zero (division by zero)", () => {
    expect(formatDelta(100, 0)).toBeNull();
  });

  it("reports an upward direction with a plus sign", () => {
    expect(formatDelta(110, 100)).toEqual({ text: "+10.0%", direction: "up" });
  });

  it("reports a downward direction", () => {
    expect(formatDelta(90, 100)).toEqual({ text: "-10.0%", direction: "down" });
  });

  it("treats tiny changes below the 0.05% threshold as flat", () => {
    expect(formatDelta(100.01, 100)).toEqual({ text: "+0.0%", direction: "flat" });
  });
});
