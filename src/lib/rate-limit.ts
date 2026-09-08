interface RateLimitStore {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitStore>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000 // 1 minute window
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = tracker.get(identifier);

  if (!record || now > record.resetTime) {
    tracker.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: maxRequests - 1, reset: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  tracker.set(identifier, record);

  return { success: true, remaining: maxRequests - record.count, reset: record.resetTime };
}
