/**
 * @Logger decorator for core service methods.
 * Debug-logs inputs (args) and outputs (return value) as beautified JSON.
 * Uses console.debug (visible when LOG_LEVEL=DEBUG in services).
 * Usage: @Logger() on methods in *.service.ts files.
 * Helps trace functions (e.g., profile updates, publish/apply) with pretty JSON.
 * No deps; pure for monorepo common lib.
 */

export function Logger(): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    // Wrap to support async/sync methods
    descriptor.value = async function (...args: any[]) {
      // Beautified JSON for inputs (truncate large for readability)
      const inputs = args.map((arg) => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      );
      console.debug(`[DEBUG ${className}.${String(propertyKey)}] Input:\n${inputs.join(', ')}`);

      try {
        const result = await originalMethod.apply(this, args); // await for promises
        // Beautified output
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        console.debug(`[DEBUG ${className}.${String(propertyKey)}] Output:\n${output}`);
        return result;
      } catch (error) {
        console.error(`[ERROR ${className}.${String(propertyKey)}]:`, error);
        throw error; // rethrow
      }
    };

    return descriptor;
  };
}
