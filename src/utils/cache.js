// Cache configuration
export const CACHE_CONFIG = {
    DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
    KEY: "fixturesDevCache",
    DIRECTION_KEY: "fixturesDirection",
};

// Cache management class
export class FixturesCache {
    constructor() {
        this.cache = new Map();
        this.isDev = process.env.NODE_ENV === "development";
        this.initializeCache();
    }

    initializeCache() {
        if (this.isDev && typeof window !== "undefined") {
            try {
                const saved = JSON.parse(
                    localStorage.getItem(CACHE_CONFIG.KEY) || "[]"
                );
                saved.forEach(([key, value]) => this.cache.set(key, value));
                console.log("[Cache] Initialized with", this.cache.size, "entries");
            } catch (e) {
                console.warn("[Cache] Failed to restore:", e);
            }
        }
    }

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp < CACHE_CONFIG.DURATION) {
            console.log(`[Cache] Hit for ${key}`);
            return cached.data;
        }

        console.log(`[Cache] Expired for ${key}`);
        this.cache.delete(key);
        return null;
    }

    set(key, data) {
        this.cache.set(key, {
            timestamp: Date.now(),
            data,
        });

        if (this.isDev && typeof window !== "undefined") {
            try {
                localStorage.setItem(CACHE_CONFIG.KEY, JSON.stringify([...this.cache]));
                console.log(`[Cache] Updated for ${key}`);
            } catch (e) {
                console.warn("[Cache] Failed to save:", e);
            }
        }
    }

    clear() {
        console.log("[Cache] Clearing");
        this.cache.clear();
        if (this.isDev && typeof window !== "undefined") {
            localStorage.removeItem(CACHE_CONFIG.KEY);
        }
    }
}

// Initialize cache singleton
export const fixturesCache = new FixturesCache(); 
