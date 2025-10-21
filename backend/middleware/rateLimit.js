// Simple in-memory rate limiter for login attempts
// Blocks after `maxAttempts` failed attempts within `windowMs` milliseconds

const stores = {
  byIp: new Map(),
  byEmail: new Map()
};

const defaultOptions = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 15 * 60 * 1000 // blocked for 15 minutes
};

function cleanupStore(map, now, windowMs) {
  for (const [key, entry] of map.entries()) {
    // remove very old entries
    if (entry.lastAttempt && now - entry.lastAttempt > windowMs * 10) {
      map.delete(key);
    }
  }
}

function rateLimitMiddleware(options = {}) {
  const opts = Object.assign({}, defaultOptions, options);

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const email = req.body?.email?.toLowerCase();
    const now = Date.now();

    // Cleanup occasionally
    cleanupStore(stores.byIp, now, opts.windowMs);
    cleanupStore(stores.byEmail, now, opts.windowMs);

    const ensureEntry = (map, key) => {
      if (!map.has(key)) map.set(key, { attempts: 0, firstAttempt: now, lastAttempt: now, blockedUntil: 0 });
      return map.get(key);
    };

    const ipEntry = ensureEntry(stores.byIp, ip);
    const emailEntry = email ? ensureEntry(stores.byEmail, email) : null;

    // Helper to check blocked status
    const isBlocked = (entry) => entry && entry.blockedUntil && now < entry.blockedUntil;

    // If either blocked, reject
    if (isBlocked(ipEntry) || (emailEntry && isBlocked(emailEntry))) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Try again later.' });
    }

    // Expose helper for controller
    req.rateLimit = {
      recordFailure: () => {
        const inc = (entry) => {
          entry.attempts = (entry.attempts || 0) + 1;
          entry.lastAttempt = Date.now();
          // if first attempt older than window, reset
          if (entry.firstAttempt && Date.now() - entry.firstAttempt > opts.windowMs) {
            entry.attempts = 1;
            entry.firstAttempt = Date.now();
          }
          if (entry.attempts >= opts.maxAttempts) {
            entry.blockedUntil = Date.now() + opts.blockDurationMs;
          }
        };
        inc(ipEntry);
        if (emailEntry) inc(emailEntry);
      },
      reset: () => {
        // reset counters on successful login
        if (stores.byIp.has(ip)) stores.byIp.delete(ip);
        if (email && stores.byEmail.has(email)) stores.byEmail.delete(email);
      }
    };

    next();
  };
}

module.exports = rateLimitMiddleware;
