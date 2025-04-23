import https from 'node:https';
import path from 'node:path';
import fs from 'node:fs';
const __dirname = import.meta.dirname;

import { API_URL } from '../utils/constants.js';

const pathToJsonFile = path.join(__dirname, '..', 'jokes.json');


const headers = {
  Accept: 'text/plain',
};

export function getRandomJoke() {
  return new Promise((resolve, reject) => {
    https
      .get(API_URL, { headers }, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('error', err => {
          reject(err);
        });

        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}


let dataOfJokes = [];
export function getJoke(msg) {
  const writeStream = fs.createWriteStream(pathToJsonFile);

  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/search?term=${msg}`, { headers }, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('error', err => {
        reject(err);
      });

      res.on('end', async () => {
        if (!data.length) reject('There are not any jokes. Please try another input');
        const arrayJokes = data.replace(/^\s/gm, '').split(/\n|\r/gm);
        const res = returnRandomJokeFromArray(arrayJokes);
        if(res) {
          dataOfJokes.push(res);
        }
       
        fs.writeFileSync(pathToJsonFile, JSON.stringify(dataOfJokes));
        resolve(res);
      });
    });
  });
}

export function getTenRandomJokes() {
  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/search`, { headers }, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('error', err => {
        reject(err);
      });

      res.on('end', () => {
        resolve(data);
      });
    });
  });
}

export function getMostPopularJoke() {
  const jsonFile = fs.readFileSync(pathToJsonFile, 'utf-8');
  const parsedJokes = JSON.parse(jsonFile);

  const objectWithUniqKey = parsedJokes.reduce((prev, current) => {
    if (prev[current]) prev[current] += 1;
    else prev[current] = 1;
    return prev;
  }, {});
  const s = Object.entries(objectWithUniqKey).reduce((previous, current) =>
    current[1] >= previous[1] ? current : previous,
  )[0];
}


function returnRandomJokeFromArray(array) {
  const index = randomIntFromInterval(0, array.length - 1);
  return array[index];
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
