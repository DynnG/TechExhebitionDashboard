interface RateLimitStore {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitStore>();

/**
  Checks if the user/identifier has exceeded the rate limit.
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 1 * 60 * 1000, // 👈 CHANGED TO 1 MINUTE
): {
  success: boolean;
  remaining: number;
  reset: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const record = tracker.get(identifier);

  // If record exists and window has expired, reset it
  if (record && now > record.resetTime) {
    tracker.delete(identifier);
  }

  const currentRecord = tracker.get(identifier);

  if (!currentRecord) {
    return {
      success: true,
      remaining: maxRequests,
      reset: now + windowMs,
      retryAfterSeconds: 0,
    };
  }

  if (currentRecord.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((currentRecord.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      reset: currentRecord.resetTime,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  return {
    success: true,
    remaining: maxRequests - currentRecord.count,
    reset: currentRecord.resetTime,
    retryAfterSeconds: 0,
  };
}

/**
  Records a failed password or email attempt and updates the counter.
 */
export function recordFailedAttempt(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 1 * 60 * 1000, // 👈 CHANGED TO 1 MINUTE
): { remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = tracker.get(identifier);

  if (!record || now > record.resetTime) {
    tracker.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  record.count += 1;
  tracker.set(identifier, record);

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { remaining: 0, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
  }

  return {
    remaining: maxRequests - record.count,
    retryAfterSeconds: 0,
  };
}

/**
  Resets rate limit counter upon successful sign-in.
 */
export function resetRateLimit(identifier: string) {
  tracker.delete(identifier);
}
