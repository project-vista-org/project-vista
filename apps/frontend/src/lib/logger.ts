// Frontend Logger Utility
// Provides structured logging with different levels and optional remote logging

interface LogEntry {
  timestamp: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  context?: Record<string, any>;
  requestId?: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  constructor() {
    this.isDevelopment =
      process.env.NODE_ENV === "dev" || !process.env.NODE_ENV;
  }

  private createLogEntry(
    level: LogEntry["level"],
    message: string,
    context?: Record<string, any>,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);

    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  private consoleLog(entry: LogEntry) {
    if (!this.isDevelopment) return;

    const prefix = `[${entry.timestamp}] ${entry.level}:`;
    const message = entry.message;
    const context = entry.context ? entry.context : {};

    switch (entry.level) {
      case "DEBUG":
        console.debug(prefix, message, context);
        break;
      case "INFO":
        console.info(prefix, message, context);
        break;
      case "WARN":
        console.warn(prefix, message, context);
        break;
      case "ERROR":
        console.error(prefix, message, context);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry("DEBUG", message, context);
    this.addToBuffer(entry);
    this.consoleLog(entry);
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry("INFO", message, context);
    this.addToBuffer(entry);
    this.consoleLog(entry);
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry("WARN", message, context);
    this.addToBuffer(entry);
    this.consoleLog(entry);
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    const contextWithError = {
      ...context,
      ...(error && {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      }),
    };

    const entry = this.createLogEntry("ERROR", message, contextWithError);
    this.addToBuffer(entry);
    this.consoleLog(entry);
  }

  // API Request/Response logging
  logApiRequest(method: string, url: string, requestId?: string) {
    this.info("API Request", {
      method,
      url,
      requestId,
      type: "api_request",
    });
  }

  logApiResponse(
    method: string,
    url: string,
    status: number,
    duration: number,
    requestId?: string,
  ) {
    const level = status >= 400 ? "ERROR" : "INFO";
    const message = `API Response - ${status}`;

    const context = {
      method,
      url,
      status,
      duration,
      requestId,
      type: "api_response",
    };

    if (level === "ERROR") {
      this.error(message, context);
    } else {
      this.info(message, context);
    }
  }

  // User action logging
  logUserAction(action: string, context?: Record<string, any>) {
    this.info(`User Action: ${action}`, {
      ...context,
      type: "user_action",
    });
  }

  // Navigation logging
  logNavigation(from: string, to: string) {
    this.info("Navigation", {
      from,
      to,
      type: "navigation",
    });
  }

  // Component lifecycle logging
  logComponentMount(componentName: string, props?: Record<string, any>) {
    this.debug(`Component Mounted: ${componentName}`, {
      componentName,
      props,
      type: "component_lifecycle",
    });
  }

  logComponentUnmount(componentName: string) {
    this.debug(`Component Unmounted: ${componentName}`, {
      componentName,
      type: "component_lifecycle",
    });
  }

  // Get recent logs (for debugging or error reporting)
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  // Clear log buffer
  clearLogs() {
    this.logBuffer = [];
  }
}

// Create singleton logger instance
export const logger = new Logger();

// Export types for use in other files
export type { LogEntry };
