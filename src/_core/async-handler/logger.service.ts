import { Injectable } from '@nestjs/common';
import { Request } from '@node_modules/@types/express';
import { isEmpty } from 'lodash';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class LoggerService {
  private readonly logDir: string;

  constructor() {
    this.logDir = this.createLogDir();
  }

  private createLogDir(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hour = now.getUTCHours().toString().padStart(2, '0');
    const logDir = join(process.cwd(), 'logs', 'error', date, hour);

    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    return logDir;
  }

  logError(message: string): void {
    appendFileSync(join(this.logDir, 'error-log.txt'), message + '\n', 'utf8');
  }

  logResponse(message: string): void {
    appendFileSync(join(this.logDir, 'response-log.txt'), message + '\n', 'utf8');
    }


getInput(req: Request): string {
    let input = '';

    try {
        if (!isEmpty(req.originalUrl)) {
            input += `Request URL: ${req.headers.host ?? 'host_not_found'}${req.originalUrl}\n`;
        }

        if (!isEmpty(req.method)) {
            input += `Method: ${req.method}\n`;
        }

        if (!isEmpty(req.body)) {
            input += `Body: ${JSON.stringify(req.body, null, 2)}\n`;
        }

        if (!isEmpty(req.params)) {
            input += `Params: ${JSON.stringify(req.params, null, 2)}\n`;
        }

        if (!isEmpty(req.query)) {
            input += `Query: ${JSON.stringify(req.query, null, 2)}\n`;
        }

        input += `\n`;
    } catch (error) {
        console.error('Error in getInput method:', error);
    }

    return input;
}


  createErrorLog(req: Request, error: Error, startTime: number): string {
    return `
${new Date().toISOString()}
${this.getInput(req)}
_________________ ERROR _________________
Request: ${req.method} ${req.url}
Duration: ${Date.now() - startTime}ms
Error: ${error.message}
Stack: ${error.stack || 'No stack trace available'}
__________________________________________
    `;
  }
}