/**
 * API Key Rotator Service
 * Manages multiple API keys and handles automatic rotation when rate limits are hit
 */

interface KeyStatus {
    key: string;
    isAvailable: boolean;
    rateLimitedAt?: number;
    lastUsedAt?: number;
}

export class ApiKeyRotator {
    private keys: KeyStatus[] = [];
    private currentIndex: number = 0;
    private cooldownPeriod: number;

    constructor(apiKeysString: string, cooldownMs: number = 60000) {
        // Parse comma-separated keys
        const keyArray = apiKeysString
            .split(',')
            .map((k) => k.trim())
            .filter((k) => k.length > 0);

        if (keyArray.length === 0) {
            throw new Error('No API keys provided to ApiKeyRotator');
        }

        // Initialize key status
        this.keys = keyArray.map((key) => ({
            key,
            isAvailable: true,
            rateLimitedAt: undefined,
            lastUsedAt: undefined,
        }));

        this.cooldownPeriod = cooldownMs;

        console.log(`[ApiKeyRotator] Initialized with ${this.keys.length} API key(s)`);
    }

    /**
     * Get the next available API key
     * Automatically resets keys that have passed the cooldown period
     */
    getNextAvailableKey(): string {
        const now = Date.now();

        // Reset keys that have passed cooldown period
        this.keys.forEach((keyStatus) => {
            if (!keyStatus.isAvailable && keyStatus.rateLimitedAt) {
                const timeSinceRateLimit = now - keyStatus.rateLimitedAt;
                if (timeSinceRateLimit >= this.cooldownPeriod) {
                    keyStatus.isAvailable = true;
                    keyStatus.rateLimitedAt = undefined;
                    console.log(`[ApiKeyRotator] Key ${this.maskKey(keyStatus.key)} cooldown expired, marking as available`);
                }
            }
        });

        // Find next available key starting from current index
        let attempts = 0;
        const maxAttempts = this.keys.length;

        while (attempts < maxAttempts) {
            const keyStatus = this.keys[this.currentIndex];

            if (keyStatus.isAvailable) {
                keyStatus.lastUsedAt = now;
                const selectedKey = keyStatus.key;

                console.log(
                    `[ApiKeyRotator] Selected key ${this.maskKey(selectedKey)} (index ${this.currentIndex}/${this.keys.length - 1})`
                );

                // Move to next key for round-robin distribution
                this.currentIndex = (this.currentIndex + 1) % this.keys.length;

                return selectedKey;
            }

            // Try next key
            this.currentIndex = (this.currentIndex + 1) % this.keys.length;
            attempts++;
        }

        // All keys are rate limited
        const earliest = this.keys.reduce((min, k) =>
            !k.rateLimitedAt || (min.rateLimitedAt && k.rateLimitedAt < min.rateLimitedAt) ? min : k
        );

        const waitTime = earliest.rateLimitedAt
            ? Math.ceil((this.cooldownPeriod - (now - earliest.rateLimitedAt)) / 1000)
            : 0;

        throw new Error(
            `All API keys are rate limited. Earliest key ${this.maskKey(earliest.key)} will be available in ~${waitTime}s`
        );
    }

    /**
     * Mark a key as rate limited
     */
    markKeyAsRateLimited(key: string): void {
        const keyStatus = this.keys.find((k) => k.key === key);

        if (keyStatus) {
            keyStatus.isAvailable = false;
            keyStatus.rateLimitedAt = Date.now();

            console.warn(
                `[ApiKeyRotator] Key ${this.maskKey(key)} marked as rate limited. Cooldown: ${this.cooldownPeriod / 1000}s`
            );
        }
    }

    /**
     * Get the current key without rotating
     */
    getCurrentKey(): string {
        return this.getNextAvailableKey();
    }

    /**
     * Get total number of keys
     */
    getTotalKeys(): number {
        return this.keys.length;
    }

    /**
     * Get number of available keys
     */
    getAvailableKeysCount(): number {
        const now = Date.now();
        return this.keys.filter((k) => {
            if (k.isAvailable) return true;
            if (!k.rateLimitedAt) return false;
            return now - k.rateLimitedAt >= this.cooldownPeriod;
        }).length;
    }

    /**
     * Mask API key for safe logging (show only last 4 characters)
     */
    private maskKey(key: string): string {
        if (key.length <= 4) return '****';
        return '***' + key.slice(-4);
    }

    /**
     * Get status of all keys (for debugging)
     */
    getStatus(): Array<{ masked: string; available: boolean; rateLimitedAt?: number }> {
        return this.keys.map((k) => ({
            masked: this.maskKey(k.key),
            available: k.isAvailable,
            rateLimitedAt: k.rateLimitedAt,
        }));
    }
}
