/**
 * Global logging utility for test steps
 */

// Log levels
export enum LogLevel {
  INFO = 'INFO',
  STEP = 'STEP',
  ACTION = 'ACTION',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

// Logger class for consistent logging
export class TestLogger {
  private static instance: TestLogger;

  private constructor() {}

  // Singleton pattern
  public static getInstance(): TestLogger {
    if (!TestLogger.instance) {
      TestLogger.instance = new TestLogger();
    }
    return TestLogger.instance;
  }

  // Log a message with a specific level
  public log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  // Helper methods for different log levels
  public info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public step(message: string): void {
    this.log(LogLevel.STEP, message);
  }

  public action(message: string): void {
    this.log(LogLevel.ACTION, message);
  }

  public warning(message: string): void {
    this.log(LogLevel.WARNING, message);
  }

  public error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }
}

// Export a singleton instance
export const logger = TestLogger.getInstance();

// Utility function for retry operations with logging
export async function retryWithLogging(
  operation: () => Promise<any>,
  description: string,
  maxAttempts = 3
): Promise<void> {
  logger.step(`Starting: ${description}`);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await operation();
      logger.step(`Successfully completed: ${description}`);
      return;
    } catch (error) {
      logger.warning(`Attempt ${i + 1} failed for: ${description}`);
      
      if (i === maxAttempts - 1) {
        logger.error(`All ${maxAttempts} attempts failed for: ${description}`);
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}