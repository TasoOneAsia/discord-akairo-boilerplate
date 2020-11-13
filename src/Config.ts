require('dotenv').config();

export const defaultPrefix = '!';
export const owners = [];
export const token = process.env.TOKEN;
console.log(process.env.TOKEN);

export const verboseLevel = 'info';

export const logOutFile = process.env.LOG_TO_FILE;

export const staticGlobals = {
  globalBotName: 'TestBot',
  creatorName: 'Taso',
};
