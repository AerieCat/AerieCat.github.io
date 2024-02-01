import express from 'express';
import https from 'https';
import winston from 'winston';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Function to format error message as HTML
function formatErrorHTML(errorMessage) {
  return `
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Error</h1>
        <p>${errorMessage}</p>
      </body>
    </html>
  `;
}

app.get('/test', (req, res) => {
  res.send('This is a test endpoint!');
});

app.get('/lgbt-rights/:state', (req, res) => {
  const state = req.params.state.replace(/ /g, '_');
  if (state.toLowerCase() === 'georgia') {
    state += '_(U.S._state)';
  }
  const url = `https://en.wikipedia.org/wiki/LGBT_rights_in_${state}`;

  // Log the constructed URL for debugging
  console.log('Fetching data from:', url);

  // Perform HTTPS GET request
  const request = https.get(url, (response) => {
    let html = '';
    response.on('data', (chunk) => {
      html += chunk;
    });
    response.on('end', () => {
      // Find the start index of the summary table
      const startIndex = html.indexOf('<span class="mw-headline" id="Summary_table">Summary table</span>');
      if (startIndex === -1) {
        // If summary table not found, send error response
        const errorMessage = 'Summary table not found';
        console.error(errorMessage);
        const errorHTML = formatErrorHTML(errorMessage);
        res.status(500).send(errorHTML);
        return;
      }

      // Find the end index of the next "</table>" after the start index of the summary table
      const endIndex = html.indexOf('</table>', startIndex);
      if (endIndex === -1) {
        // If end of table not found, send error response
        const errorMessage = 'End of table not found';
        console.error(errorMessage);
        const errorHTML = formatErrorHTML(errorMessage);
        res.status(500).send(errorHTML);
        return;
      }

      // Extract the HTML section between the summary table and the next "</table>"
      const summaryChart = html.substring(startIndex, endIndex + '</table>'.length);

      // Send the extracted HTML section as the response
      res.send(summaryChart);
    });
  });

  // Handle HTTPS request errors
  request.on('error', (error) => {
    console.error('Error fetching data:', error);
    const errorHTML = formatErrorHTML(`Error fetching data: ${error.message}`);
    res.status(500).send(errorHTML);
  });

  request.end();
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
