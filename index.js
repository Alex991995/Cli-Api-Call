import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import https from 'node:https';

import { API_URL } from './utils/constants.js';

const headers = {
  Accept: 'text/plain',
};

const rl = readline.createInterface({ input, output });

const str = `1. Get a random joke
2. Search for a joke by keyword
3. Get 10 random jokes
4. Quit\n`;

rl.setPrompt(str);
rl.prompt();

rl.on('line', main);

function main(answer) {
  if (answer == 1) {
    https.get(API_URL, { headers }, res => {
      res.on('data', data => {
        const res = data.toString('utf8');

        console.log(`${res}\n`);
        rl.prompt();
      });
    });
  } else if (answer == 2) {
    rl.question('Enter the word you are looking for:\n', msg => {
      https.get(`${API_URL}/search?term=${msg}`, { headers }, res => {
        res.on('data', data => {
          const res = data.toString('utf8');

          console.log(`\n${res}\n`);
          rl.prompt();
        });
      });
    });
  } else if (answer == 3) {
    https.get(`${API_URL}/search`, { headers }, res => {
      res.on('data', data => {
        const res = data.toString('utf8');

        console.log(`\n${res}\n`);
        rl.prompt();
      });
    });
  } else if (answer == 4) {
    rl.close();
  }
}
