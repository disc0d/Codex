const REDACTED_VALUE = '[REDACTED]';

const TOKEN_LIKE_KEY_PATTERN = /(token|secret|password|authorization|verification|reset|bearer|jwt|url)/i;

type StructuredPrimitive = string | number | boolean | null;
type StructuredValue = StructuredPrimitive | StructuredMetadata | StructuredValue[];

interface StructuredMetadata {
  [key: string]: StructuredValue;
}

function redactValue(value: StructuredValue): StructuredValue {
  if (Array.isArray(value)) return value.map(redactValue);
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce<StructuredMetadata>((acc, [key, nestedValue]) => {
      acc[key] = TOKEN_LIKE_KEY_PATTERN.test(key) ? REDACTED_VALUE : redactValue(nestedValue);
      return acc;
    }, {});
  }

  return value;
}

function sanitizeMetadata(metadata: StructuredMetadata = {}): StructuredMetadata {
  return Object.entries(metadata).reduce<StructuredMetadata>((acc, [key, value]) => {
    acc[key] = TOKEN_LIKE_KEY_PATTERN.test(key) ? REDACTED_VALUE : redactValue(value);
    return acc;
  }, {});
}

function log(level: 'info' | 'warn' | 'error', event: string, metadata: StructuredMetadata = {}): void {
  const entry = {
    level,
    event,
    module: 'auth',
    ...sanitizeMetadata(metadata)
  };

  const line = JSON.stringify(entry);
  if (level === 'error') return void console.error(line);
  if (level === 'warn') return void console.warn(line);
  return void console.info(line);
}

export const authLogger = {
  info(event: string, metadata: StructuredMetadata = {}): void {
    log('info', event, metadata);
  },
  warn(event: string, metadata: StructuredMetadata = {}): void {
    log('warn', event, metadata);
  },
  error(event: string, metadata: StructuredMetadata = {}): void {
    log('error', event, metadata);
  }
};

export type { StructuredMetadata, StructuredValue };
