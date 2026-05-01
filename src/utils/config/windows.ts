export interface DateWindow {
  start: number;
  end: number;
}

export interface WindowConfig {
  INITIAL: {
    PAST: DateWindow;
    FUTURE: DateWindow;
  };
  INCREMENT: {
    DAYS: number;
  };
  MAX_ATTEMPTS: number;
}

export const WINDOW_CONFIG = {
  FOOTBALL: {
    INITIAL: {
      PAST: { start: 7, end: 7 },
      FUTURE: { start: 0, end: 28 },
    },
    INCREMENT: {
      DAYS: 14,
    },
    MAX_ATTEMPTS: 4,
  },
} as const satisfies Record<string, WindowConfig>;

export const DEFAULT_WINDOWS = WINDOW_CONFIG.FOOTBALL;
