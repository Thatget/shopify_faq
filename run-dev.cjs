const { spawn } = require('child_process');

const fs = require('fs');
const dotenv = require('dotenv');

// can we load multiple file env?
const dotenvBackend = './.env';
const dotenvFrontend = './frontend/.env';

if (fs.existsSync(dotenvBackend)) {
  console.log('\x1b[33m%s\x1b[0m', 'Load .env from file .env');
  dotenv.config({ path: dotenvBackend });
}
if (fs.existsSync(dotenvFrontend)) {
  console.log('\x1b[33m%s\x1b[0m', 'Load .env from file frontend/.env');
  dotenv.config({ path: dotenvFrontend });
}

// override process.env.HOST for vite hrm
if (!process.env.HOST) {
  process.env.HOST = 'localhost';
}
if (!process.env.PORT) {
  process.env.PORT = 80;
}
// override process.env.FRONTEND_PORT
if (!process.env.FRONTEND_PORT) {
  process.env.FRONTEND_PORT = 3001;
}
if (!process.env.BACKEND_PORT) {
  process.env.BACKEND_PORT = process.env.PORT;
}
// if (!process.env.CLOUDFLARED_PORT) {
//   CLOUDFLARED_PORT = process.env.FRONTEND_PORT ?? process.env.BACKEND_PORT ?? process.env.PORT;
//   process.env.CLOUDFLARED_PORT = CLOUDFLARED_PORT;
// }

console.log('\x1b[33m%s\x1b[0m', 'FRONTEND_PORT', process.env.FRONTEND_PORT);
console.log('\x1b[33m%s\x1b[0m', 'BACKEND_PORT', process.env.BACKEND_PORT);
console.log('\x1b[33m%s\x1b[0m', 'PORT', process.env.PORT);
console.log('\x1b[33m%s\x1b[0m', 'HOST', process.env.HOST);
// console.log('\x1b[33m%s\x1b[0m', 'CLOUDFLARED_PORT', CLOUDFLARED_PORT);


// Run the backend command
const backendCommand = spawn('npm', ['run', 'dev', '--prefix', './']);
backendCommand.stdout.pipe(process.stdout);
backendCommand.stderr.pipe(process.stderr);

backendCommand.on('close', (code) => {
  if (code === 0) {
    console.log('Backend command exited without errors.');
  } else {
    console.error(`Backend command exited with code ${code}.`);
  }
});


// Run the frontend command
const frontendCommand = spawn('npm', ['run', 'dev', '--prefix', './frontend']);
frontendCommand.stdout.pipe(process.stdout);
frontendCommand.stderr.pipe(process.stderr);
frontendCommand.on('close', (code) => {
  if (code === 0) {
    console.log('Frontend command exited without errors.');
  } else {
    console.error(`Frontend command exited with code ${code}.`);
  }
});


// Listen for Ctrl+C (SIGINT) and perform cleanup
process.on('SIGINT', () => {
  if (backendCommand) {
    console.log('Kill Backend');
    backendCommand.kill('SIGINT'); // Terminate backendCommand gracefully
  }
  if (frontendCommand) {
    console.log('Kill Frontend');
    frontendCommand.kill('SIGINT'); // Terminate frontendCommand gracefully
  }
  
  process.exit(0); // Exit the script
});


