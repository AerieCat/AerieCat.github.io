import express from 'express';
import fetch from 'node-fetch';
const { default: nodeFetch } = fetch;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/lgbt-rights/:state', async (req, res) => {
  const state = req.params.state;
  const url = `https://en.wikipedia.org/wiki/LGBT_rights_in_${state}#Summary_table`;
  try {
    const response = await nodeFetch(url);
    const html = await response.text();
    res.send(html);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
