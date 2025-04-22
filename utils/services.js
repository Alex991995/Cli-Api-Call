import https from 'node:https';
import path from 'node:path';
import fs from 'node:fs';
import { readFile } from 'fs/promises';
const __dirname = import.meta.dirname;

import { API_URL } from '../utils/constants.js';

const pathToJsonFile = path.join(__dirname, '..', 'jokes.json');
fs.writeFileSync(pathToJsonFile, JSON.stringify({}))
// fs.writeFileSync(pathToJsonFile, JSON.stringify({ data: [] }, null, 2));



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

const mainObj = { data: [] };
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
        const obj = {};
        const arrayJokes = data.replace(/^\s/gm, '').split(/\n|\r/gm);
        const res = returnRandomJokeFromArray(arrayJokes);

        const jsonFile = fs.readFileSync(pathToJsonFile, 'utf-8');
        console.log(jsonFile)
        // const existed = await ifExistJoke(res);
        // console.log(file)

        obj[1] = res;
        mainObj.data.push(obj);

        writeStream.write(JSON.stringify(mainObj));
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

async function ifExistJoke(joke) {
  try {
    const file = await readFile(pathToJsonFile, 'utf8');
    return JSON.parse(file);

    //some logic
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

function returnRandomJokeFromArray(array) {
  const index = randomIntFromInterval(0, array.length - 1);
  return array[index];
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
