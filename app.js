const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files if needed (e.g., for a frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to get a specific word
app.get('/api/word/:word', (req, res) => {
  const word = req.params.word.toLowerCase();

  // Basic validation to ensure the word contains only letters
  if (!word || !/^[a-z]+$/.test(word)) {
    return res.status(400).json({ error: 'Invalid word format' });
  }

  const firstLetter = word.charAt(0);
  const filePath = path.join(__dirname, 'data', firstLetter, `${word}.json`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Word not found' });
      }
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const wordData = JSON.parse(data);
      res.json(wordData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Error processing word data' });
    }
  });
});

// API Endpoint to get the index of words
app.get('/api/index', (req, res) => {
  const indexPath = path.join(__dirname, 'data', 'index.json');

  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Index not found' });
      }
      console.error('Error reading index:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const indexData = JSON.parse(data);
      res.json(indexData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Error processing index data' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
