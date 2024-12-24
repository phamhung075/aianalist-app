// src/lib/python/python.service.ts
import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class PythonService {
  runPythonScript(arg: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Build the absolute path to the Python script
      const scriptPath = path.join(__dirname, 'scripts', 'mock.py');
      console.log('Python Script Path:', scriptPath);

      const pythonProcess = spawn('python', [scriptPath, arg]);

      let output = '';
      let error = '';

      // Capture stdout
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Capture stderr
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      // Handle close event
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(`Python script exited with code ${code}: ${error}`);
        }
      });
    });
  }
}
