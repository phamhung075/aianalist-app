import { Test, TestingModule } from '@nestjs/testing';
import { PythonService } from './python.service';
import * as child_process from 'child_process';
import { EventEmitter } from 'events';
import * as path from 'path';

// Mock child_process.spawn
jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

class MockChildProcess extends EventEmitter {
  stdout = new EventEmitter();
  stderr = new EventEmitter();

  constructor(private exitCode: number = 0, private outputData: string = '', private errorData: string = '') {
    super();
    process.nextTick(() => {
      if (this.outputData) {
        this.stdout.emit('data', Buffer.from(this.outputData));
      }
      if (this.errorData) {
        this.stderr.emit('data', Buffer.from(this.errorData));
      }
      this.emit('close', this.exitCode);
    });
  }
}

describe('PythonService', () => {
  let service: PythonService;
  let mockSpawn: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PythonService],
    }).compile();

    service = module.get<PythonService>(PythonService);
    mockSpawn = child_process.spawn as jest.Mock;
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runScript (private method testing through public methods)', () => {
    it('should use correct path in development environment', async () => {
      const mockProcess = new MockChildProcess(0, 'success');
      mockSpawn.mockReturnValue(mockProcess);

      await service.runTest('test-arg');

      const spawnCall = mockSpawn.mock.calls[0];
      const scriptPath = spawnCall[1][0];
      
      // Verify python command
      expect(spawnCall[0]).toBe('python');
      
      // Verify path contains correct segments
      expect(scriptPath).toContain(path.join('src', 'lib', 'python', 'scripts', 'test.py'));
      
      // Verify argument
      expect(spawnCall[1][1]).toBe('test-arg');
    });

    it('should use correct path in production environment', async () => {
      process.env.NODE_ENV = 'production';
      const mockProcess = new MockChildProcess(0, 'success');
      mockSpawn.mockReturnValue(mockProcess);

      await service.runTest('test-arg');

      const spawnCall = mockSpawn.mock.calls[0];
      const scriptPath = spawnCall[1][0];

      // Verify python command
      expect(spawnCall[0]).toBe('python');
      
      // In production environment, verify the path ends with the correct structure
      const normalizedPath = path.normalize(scriptPath);
      const expectedEnding = path.normalize('/scripts/test.py');
      expect(normalizedPath.endsWith(expectedEnding)).toBe(true);
      
      // Verify argument
      expect(spawnCall[1][1]).toBe('test-arg');
    });

    it('should handle Python process error', async () => {
      const mockProcess = new MockChildProcess();
      mockSpawn.mockReturnValue(mockProcess);

      const errorPromise = service.runTest('test-arg');
      mockProcess.emit('error', new Error('Python process error'));

      await expect(errorPromise).rejects.toMatch(/Failed to start Python process/);
    });

    it('should handle non-zero exit code', async () => {
      const mockProcess = new MockChildProcess(1, '', 'Some error occurred');
      mockSpawn.mockReturnValue(mockProcess);

      await expect(service.runTest('test-arg')).rejects.toMatch(/Python script exited with code 1/);
    });

    it('should handle successful output', async () => {
      const expectedOutput = 'Script output success';
      const mockProcess = new MockChildProcess(0, expectedOutput);
      mockSpawn.mockReturnValue(mockProcess);

      const result = await service.runTest('test-arg');
      expect(result).toBe(expectedOutput);
    });
  });

  describe('runTest', () => {
    it('should call runScript with correct arguments', async () => {
      const mockProcess = new MockChildProcess(0, 'success');
      mockSpawn.mockReturnValue(mockProcess);

      await service.runTest('test-argument');

      const spawnCall = mockSpawn.mock.calls[0];
      const scriptPath = spawnCall[1][0];
      
      // Verify it ends with test.py
      expect(path.basename(scriptPath)).toBe('test.py');
      
      // Verify argument
      expect(spawnCall[1][1]).toBe('test-argument');
    });
  });

  describe('error handling', () => {
    it('should handle stderr output', async () => {
      const mockProcess = new MockChildProcess(1, '', 'Error in Python script');
      mockSpawn.mockReturnValue(mockProcess);

      await expect(service.runTest('test-arg'))
        .rejects
        .toMatch(/Error in Python script/);
    });

    it('should handle spawn errors', async () => {
      mockSpawn.mockImplementation(() => {
        throw new Error('Spawn error');
      });

      await expect(service.runTest('test-arg'))
        .rejects
        .toThrow();
    });
  });
});