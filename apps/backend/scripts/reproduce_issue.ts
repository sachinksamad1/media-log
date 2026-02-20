import { IncomingMessage } from 'http';
import { Socket } from 'net';

import busboy from 'busboy';

const BOUNDARY = '--------------------------321586558451833071649666';

const body = [
  `--${BOUNDARY}`,
  'Content-Disposition: form-data; name="test_field"',
  '',
  'test_value',
  `--${BOUNDARY}--`,
  '',
].join('\r\n');

// Mock a request
const socket = new Socket();
const req = new IncomingMessage(socket);
req.headers = {
  'content-type': `multipart/form-data; boundary=${BOUNDARY}`,
  'content-length': Buffer.byteLength(body).toString(),
};

const bb = busboy({ headers: req.headers });

bb.on('file', (name, file, info) => {
  // eslint-disable-next-line no-console
  console.log(
    `File [${name}]: filename: ${info.filename}, encoding: ${info.encoding}, mimetype: ${info.mimeType}`,
  );
  file
    .on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`File [${name}] got ${data.length} bytes`);
    })
    .on('close', () => {
      // eslint-disable-next-line no-console
      console.log(`File [${name}] done`);
    });
});

bb.on('field', (name, val, _info) => {
  // eslint-disable-next-line no-console
  console.log(`Field [${name}]: value: ${val}`);
});

bb.on('close', () => {
  // eslint-disable-next-line no-console
  console.log('Done parsing form!');
});

bb.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Busboy error:', err);
});

req.pipe(bb);
req.push(body);
req.push(null);
