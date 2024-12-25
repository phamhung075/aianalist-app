import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as process from 'process';

@Injectable()
export class PythonService {
    /**
     * Run a generic Python script.
     * @param scriptName Name of the Python script
     * @param args Arguments for the Python script
     */
    private runScript(
        scriptName: string,
        args: string[] = []
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const scriptPath = process.env.NODE_ENV === 'production'
                ? path.resolve(__dirname, '..', 'scripts', scriptName) // Updated production path
                : path.resolve(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'src',
                    'lib',
                    'python',
                    'scripts',                    
                    scriptName
                );

            console.log('Python Script Path:', scriptPath);
            const pythonProcess = spawn('python', [scriptPath, ...args]);

            let output = '';
            let error = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            pythonProcess.on('error', (err) => {
                console.error('Failed to start Python process:', err.message);
                reject(`Failed to start Python process: ${err.message}`);
            });

            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    console.error(
                        `Python script exited with code ${code}: ${error}`
                    );
                    reject(`Python script exited with code ${code}: ${error}`);
                }
            });
        });
    }

    /**
     * Run the first Python script.
     * Example: script1.py
     */
    runTest(arg1: string): Promise<string> {
        return this.runScript('test.py', [arg1]);
    }

    /**
     * Run the second Python script.
     * Example: script2.py
     */
    runScriptTwo(arg1: string, arg2: string): Promise<string> {
        return this.runScript('script2.py', [arg1, arg2]);
    }

    /**
     * Run the third Python script.
     * Example: script3.py
     */
    runScriptThree(): Promise<string> {
        return this.runScript('script3.py');
    }
}
