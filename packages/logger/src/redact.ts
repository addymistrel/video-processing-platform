const REDACT_PATHS: readonly string[] = [
  'password',
  'token',
  'refreshToken',
  'accessToken',
  'secret',
  '*.password',
  '*.token',
  '*.refreshToken',
  '*.accessToken',
  '*.secret',
  'headers.authorization',
  'headers.cookie',
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
];

export { REDACT_PATHS };
