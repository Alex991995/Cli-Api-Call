import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

import { getRandomJoke, getJoke, getTenRandomJokes } from './utils/services.js';
import { invalidInputInfo } from './utils/constants.js';

// const jokes = await import('../jokes.json', {
//   assert: { type: 'json' }
// });




const rl = readline.createInterface({ input, output });

const str = `1. Get a random joke
2. Search for a joke by keyword
3. Get 10 random jokes
4. Get the most popular joke
5. Quit\n`;

rl.setPrompt(str);
rl.prompt();

rl.on('line', main);


async function main(answer) {
  if (answer == 1) {

    const res = await getRandomJoke();
    console.log(`\n${res}`);
    rl.prompt();

  } else if (answer == 2) {

    rl.question('Enter the word you are looking for:\n', async msg => {
      try {
        const res = await getJoke(msg);
        console.log(`\n${res}\n`);
        rl.prompt();
        
      } catch (error) {
        console.log(error)
        rl.prompt();
      }
    });
    
  } else if (answer == 3) {

    const res = await getTenRandomJokes();
    console.log(`\n${res}\n`);
    rl.prompt();

  } else if (answer == 4) {
    console.log(jokes)
    // const arrayJokes = JSON.parse(jokes)
    // for (const key in object) {
    //   if (Object.prototype.hasOwnProperty.call(object, key)) {
    //     const element = object[key];
        
    //   }
    // }
//     const res = Object.fromEntries(jokes)
// console.log(Object.keys(res))
// console.log(Object.values(jokes) )



  } 
    
  else if (answer == 5) {
    rl.close();
  }
  else {
    console.log(`\n${invalidInputInfo}\n`);
    rl.prompt();
  }
}
