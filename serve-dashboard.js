const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// API endpoint to get the latest test report file
app.get('/api/latest-report', (req, res) => {
  try {
    const testResultsDir = path.join(__dirname, 'test-results');
    
    if (!fs.existsSync(testResultsDir)) {
      return res.status(404).json({ error: 'Test results directory not found' });
    }
    
    const files = fs.readdirSync(testResultsDir)
      .filter(file => file.endsWith('.json') && file.startsWith('test-report-'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      return res.status(404).json({ error: 'No test report files found' });
    }
    
    const latestFile = files[0];
    const filePath = path.join(testResultsDir, latestFile);
    const reportData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    res.json({
      filename: latestFile,
      path: `/test-results/${latestFile}`,
      data: reportData
    });
  } catch (error) {
    console.error('Error getting latest report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to list all test report files
app.get('/api/reports', (req, res) => {
  try {
    const testResultsDir = path.join(__dirname, 'test-results');
    
    if (!fs.existsSync(testResultsDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(testResultsDir)
      .filter(file => file.endsWith('.json') && file.startsWith('test-report-'))
      .sort()
      .reverse()
      .map(file => ({
        filename: file,
        path: `/test-results/${file}`,
        timestamp: file.match(/test-report-([\d\-T_]+)\.json/)?.[1] || 'unknown'
      }));
    
    res.json(files);
  } catch (error) {
    console.error('Error listing reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the dashboard at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Test Dashboard Server Started!`);
  console.log(`📊 Dashboard URL: http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🔄 Auto-refresh enabled (30 seconds)`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down dashboard server...');
  process.exit(0);
});