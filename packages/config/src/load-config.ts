import type { z } from 'zod';

class ConfigError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

function formatIssues(issues: z.ZodError['issues']): string {
  const lines = issues.map(
    (issue) => `  - ${issue.path.map(String).join('.') || '(root)'}: ${issue.message}`,
  );

  return `Invalid environment configuration:\n${lines.join('\n')}`;
}

function loadConfig<T extends z.ZodType>(
  schema: T,
  source: NodeJS.ProcessEnv = process.env,
): z.output<T> {
  const result = schema.safeParse(source);

  if (!result.success) {
    throw new ConfigError(formatIssues(result.error.issues));
  }

  return result.data;
}

function loadConfigOrExit<T extends z.ZodType>(schema: T): z.output<T> {
  try {
    return loadConfig(schema);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);

    process.exit(1);
  }
}

export { ConfigError, loadConfig, loadConfigOrExit };
