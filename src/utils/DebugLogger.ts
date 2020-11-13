import { Logger, ILogObject, ISettingsParam } from 'tslog';
import { appendFileSync } from 'fs';
import { staticGlobals, verboseLevel, logOutFile } from '../Config';
import path from 'path';

// Prints out to log file in /logs/{logType}.txt
function logToFile(logObj: ILogObject) {
  const logsPath = path.join(__dirname, `/logs`, `${logObj.logLevel}.txt`);
  appendFileSync(logsPath, JSON.stringify(logObj) + '\n');
}

//Main Logger Function

const logger = new Logger({
  name: staticGlobals.globalBotName,
  prefix: ['main'],
});

if (logOutFile) {
  logger.attachTransport(
    {
      silly: logToFile,
      debug: logToFile,
      trace: logToFile,
      info: logToFile,
      warn: logToFile,
      error: logToFile,
      fatal: logToFile,
    },
    verboseLevel
  );
}

export default logger;
