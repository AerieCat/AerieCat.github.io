import express from 'express';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/lgbt-rights/:state', async (req, res) => {
  const state = req.params.state.replace(/ /g, '_');
  const url = `https://en.wikipedia.org/wiki/LGBT_rights_in_${state}#Summary_table`;
  
  // Perform HTTP GET request
  http.get(url, (response) => {
    let html = '';
    response.on('data', (chunk) => {
      html += chunk;
    });
    response.on('end', () => {
      res.send(html);
    });
  }).on('error', (error) => {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
