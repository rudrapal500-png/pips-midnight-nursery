import { createServer } from 'node:http';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(__dirname, 'data');
const dataFile = path.join(dataDirectory, 'milestones.json');

const port = Number(process.env.PORT) || 3001;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);

const emptyMilestones = {
  firstHello: false,
  dreamExplorer: false,
  stardustKeeper: false,
};

async function readDatabase() {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

let writeQueue = Promise.resolve();

function saveDatabase(database) {
  // Queue writes so simultaneous requests don't overwrite each other.
  writeQueue = writeQueue.then(async () => {
    await mkdir(dataDirectory, { recursive: true });

    const temporaryFile = `${dataFile}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(database, null, 2), 'utf8');
    await rename(temporaryFile, dataFile);
  });

  return writeQueue;
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;

      if (body.length > 10_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });

    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });

    request.on('error', reject);
  });
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }

  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, PUT, OPTIONS',
  );
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
  );

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const match = url.pathname.match(/^\/api\/milestones\/([a-zA-Z0-9-]{1,80})$/);

  if (!match) {
    sendJson(response, 404, { error: 'Route not found.' });
    return;
  }

  const visitorId = match[1];

  try {
    if (request.method === 'GET') {
      const database = await readDatabase();
      sendJson(response, 200, database[visitorId] ?? emptyMilestones);
      return;
    }

    if (request.method === 'PUT') {
      const body = await readRequestBody(request);
      const milestones = {
        firstHello: body.firstHello === true,
        dreamExplorer: body.dreamExplorer === true,
        stardustKeeper: body.stardustKeeper === true,
      };

      const database = await readDatabase();
      database[visitorId] = milestones;
      await saveDatabase(database);

      sendJson(response, 200, milestones);
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: 'The server could not process the request.' });
  }
});

server.listen(port, () => {
  console.log(`Pip backend running at http://localhost:${port}`);
});