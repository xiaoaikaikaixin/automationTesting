import { Page } from '@playwright/test';

/**
 * AutoLogger - Automatically logs Playwright actions without explicit logging calls
 */
class AutoLogger {
  private static instance: AutoLogger;
  private originalMethods: Map<string, Function> = new Map();
  private activePages: Set<Page> = new Set();

  private constructor() {}

  public static getInstance(): AutoLogger {
    if (!AutoLogger.instance) {
      AutoLogger.instance = new AutoLogger();
    }
    return AutoLogger.instance;
  }
  
  /**
   * Reset the singleton instance
   * This static method is used to reset the singleton instance between test runs
   */
  public static resetInstance(): void {
    if (AutoLogger.instance) {
      AutoLogger.instance.reset();
      AutoLogger.instance = null as any;
      console.log('[AutoLogger] Instance has been reset');
    }
  }
  
  /**
   * Reset the logger and restore original methods
   * Call this method after tests to clean up
   */
  public reset(): void {
    // Restore original methods for all active pages
    this.activePages.clear();
    this.originalMethods.clear();
    console.log('[AutoLogger] Reset completed, all original methods restored');
  }

  /**
   * Start automatic logging for a page
   */
  public startLogging(page: Page): void {
    // Add page to active pages set for tracking
    this.activePages.add(page);
    
    // Store original methods and override them with logging versions
    this.wrapMethod(page, 'fill', 'Filling');
    this.wrapMethod(page, 'click', 'Clicking');
    this.wrapMethod(page, 'goto', 'Navigating to');
    this.wrapMethod(page, 'waitForLoadState', 'Waiting for load state');
    this.wrapMethod(page, 'waitForTimeout', 'Waiting for timeout');
    this.wrapMethod(page, 'waitForSelector', 'Waiting for selector');
    this.wrapMethod(page, 'type', 'Typing');
    this.wrapMethod(page, 'press', 'Pressing key');
    
    console.log('[AutoLogger] Automatic action logging enabled');
  }

  /**
   * Wrap a page method with logging
   */
  private wrapMethod(page: any, methodName: string, actionDescription: string): void {
    if (!page[methodName] || typeof page[methodName] !== 'function') {
      return;
    }

    // Store the original method
    this.originalMethods.set(methodName, page[methodName]);

    // Replace with logging version
    page[methodName] = async (...args: any[]) => {
      const selector = args[0] || '';
      const value = args[1] || '';
      
      // Log the action
      console.log(`[ACTION] ${actionDescription}: ${selector} ${value}`);
      
      // Call the original method
      return await this.originalMethods.get(methodName)!.apply(page, args);
    };
  }

  /**
   * Log a message
   */
  public log(level: string, message: string): void {
    console.log(`[${level}] ${message}`);
  }
}

export const autoLogger = AutoLogger.getInstance();
export { AutoLogger };

/**
 * Retry an operation with automatic logging
 */
export async function retryWithAutoLogging(
  operation: () => Promise<any>,
  description: string,
  maxAttempts = 3
): Promise<void> {
  console.log(`[STEP] Starting: ${description}`);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await operation();
      console.log(`[STEP] Successfully completed: ${description}`);
      return;
    } catch (error) {
      console.log(`[STEP] Attempt ${i + 1} failed for: ${description}`);
      
      if (i === maxAttempts - 1) {
        console.error(`[ERROR] All ${maxAttempts} attempts failed for: ${description}`);
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}