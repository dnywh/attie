import { describe, expect, it } from "vitest";
import {
  STORAGE_KEYS,
  getStoredPreferences,
  initialiseStorage,
  readStoredSoundPreference,
} from "@/utils/preferences";

function createStorage(initialValues: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initialValues));

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  };
}

describe("preferences", () => {
  it("falls back to defaults without browser storage", () => {
    expect(getStoredPreferences()).toEqual({
      sport: "football",
      competitions: ["fifa-world-cup", "premier-league"],
      direction: "backwards",
    });
  });

  it("repairs invalid stored JSON and uses the sport default", () => {
    const storage = createStorage({
      [STORAGE_KEYS.sport]: "basketball",
      [STORAGE_KEYS.competitionsForSport("basketball")]: "not-json",
      [STORAGE_KEYS.direction]: "sideways",
    });

    expect(getStoredPreferences(storage)).toEqual({
      sport: "basketball",
      competitions: ["nba"],
      direction: "backwards",
    });
  });

  it("initialises missing storage keys", () => {
    const storage = createStorage();

    initialiseStorage(storage);

    expect(storage.getItem(STORAGE_KEYS.sport)).toBe("football");
    expect(storage.getItem(STORAGE_KEYS.competitionsForSport("football"))).toBe(
      JSON.stringify(["fifa-world-cup", "premier-league"])
    );
    expect(storage.getItem(STORAGE_KEYS.direction)).toBe("backwards");
  });

  it("falls back when sound preference JSON is invalid", () => {
    const storage = createStorage({
      [STORAGE_KEYS.sound]: "{",
    });

    expect(readStoredSoundPreference(storage)).toBe(false);
  });
});
