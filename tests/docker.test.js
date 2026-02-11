const request = require('supertest');
const { execSync } = require('child_process');

describe('Docker CI/CD Pipeline Tests', () => {
  const baseUrl = 'http://localhost:3000';
  
  beforeAll(async () => {
    // Ensure containers are running before tests
    try {
      console.log('Starting containers for tests...');
      execSync('docker compose up -d', { stdio: 'inherit' });
      
      // Wait for services to be ready
      console.log('Waiting for services to be ready...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    } catch (error) {
      console.error('Failed to start containers:', error.message);
    }
  });

  afterAll(async () => {
    // Cleanup after tests
    try {
      console.log('Cleaning up containers after tests...');
      execSync('docker compose down', { stdio: 'inherit' });
    } catch (error) {
      console.error('Cleanup failed:', error.message);
    }
  });

  describe('Container Health Checks', () => {
    test('Database container should be healthy', async () => {
      try {
        const output = execSync('docker compose ps db', { encoding: 'utf8' });
        expect(output).toContain('healthy');
      } catch (error) {
        throw new Error(`Database health check failed: ${error.message}`);
      }
    });

    test('Application container should be running', async () => {
      try {
        const output = execSync('docker compose ps app', { encoding: 'utf8' });
        expect(output).toContain('Up');
      } catch (error) {
        throw new Error(`Application container check failed: ${error.message}`);
      }
    });
  });

  describe('Application Functionality', () => {
    test('Should respond to health check endpoint', async () => {
      try {
        const response = await request(baseUrl)
          .get('/health')
          .timeout(10000);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
      } catch (error) {
        throw new Error(`Health check failed: ${error.message}`);
      }
    });

    test('Should connect to database', async () => {
      try {
        const response = await request(baseUrl)
          .get('/api/test-db')
          .timeout(10000);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('database', 'connected');
      } catch (error) {
        throw new Error(`Database connection test failed: ${error.message}`);
      }
    });
  });

  describe('Cleanup and Restart Functionality', () => {
    test('Cleanup script should execute without errors', async () => {
      try {
        // Run cleanup script
        execSync('./scripts/cleanup-restart.sh', { 
          stdio: 'pipe',
          timeout: 120000 // 2 minutes timeout
        });
        
        // Verify containers are running after cleanup
        const dbOutput = execSync('docker compose ps db', { encoding: 'utf8' });
        const appOutput = execSync('docker compose ps app', { encoding: 'utf8' });
        
        expect(dbOutput).toContain('healthy');
        expect(appOutput).toContain('Up');
      } catch (error) {
        throw new Error(`Cleanup script test failed: ${error.message}`);
      }
    });

    test('Should handle container failures gracefully', async () => {
      try {
        // Stop app container to simulate failure
        execSync('docker compose stop app', { stdio: 'inherit' });
        
        // Verify app is stopped
        const output = execSync('docker compose ps app', { encoding: 'utf8' });
        expect(output).toContain('Exit');
        
        // Run cleanup script to recover
        execSync('./scripts/cleanup-restart.sh', { 
          stdio: 'pipe',
          timeout: 120000 
        });
        
        // Verify recovery
        const recoveryOutput = execSync('docker compose ps app', { encoding: 'utf8' });
        expect(recoveryOutput).toContain('Up');
      } catch (error) {
        throw new Error(`Failure recovery test failed: ${error.message}`);
      }
    });
  });

  describe('Resource Management', () => {
    test('Should not leave orphaned containers', () => {
      try {
        // Check for orphaned containers
        const output = execSync('docker ps -a --filter "label=com.docker.compose.project" --format "{{.Names}} {{.Status}}"', { encoding: 'utf8' });
        
        // Should only have our defined containers
        const lines = output.trim().split('\n');
        const containerNames = lines.map(line => line.split(' ')[0]);
        
        expect(containerNames).toContain('mysql-db');
        expect(containerNames).toContain('nodejs-app');
        expect(containerNames.length).toBeLessThanOrEqual(2);
      } catch (error) {
        throw new Error(`Orphaned container check failed: ${error.message}`);
      }
    });

    test('Should manage disk space properly', () => {
      try {
        // Get Docker system usage
        const output = execSync('docker system df --format "{{.Type}} {{.Size}}"', { encoding: 'utf8' });
        
        // Basic check that we can get usage info
        expect(output).toContain('Images');
        expect(output).toContain('Containers');
      } catch (error) {
        throw new Error(`Disk space check failed: ${error.message}`);
      }
    });
  });
});
