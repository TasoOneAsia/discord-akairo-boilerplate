import UsersDB from './schemas/User';
import GuildDB from './schemas/Guild';
import log from '../utils/DebugLogger';
import { uriFromConfig } from '../utils/MiscTools';
import Mongoose, { Connection } from 'mongoose';

const logger = log.getChildLogger({
  name: 'MongoDB',
});

let db: any;

// Query DB for User Document
export const getUserFromDB = async (userID: string) => {
  logger.debug(`Making UserDB call for ${userID}`);
  let queryUser = await UsersDB.findById({ id: userID });

  if (!queryUser) {
    logger.debug(`User not found, creating new user`);
    queryUser = new UsersDB({ id: userID });
    await queryUser.save().catch((e) => logger.error(e));
    logger.debug(`User saved and created!`);
  }

  logger.debug(`Return queried user ${queryUser}`);
  return queryUser;
};

// Query DB for Guild Document
export const getGuildFromDB = async (guildID: string) => {
  logger.debug(`Making GuildDB call for ${guildID}`);
  let queryGuild = await GuildDB.findById({ id: guildID });

  if (!queryGuild) {
    logger.debug(`Guild not found, creating new Guild`);
    queryGuild = new GuildDB({ id: guildID });
    await queryGuild.save().catch((e) => log.error(e));
    logger.debug(`Guild saved and created!`);
  }

  logger.debug(`Return queried user ${queryGuild}`);
  return queryGuild;
};

export const connectToDB = async (): Promise<void> => {
  const uri = uriFromConfig();

  logger.debug(`URI: ${uri}`);

  logger.debug(`Attempting connect`);
  try {
    await Mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    logger.info('DB Connected');
  } catch (err) {
    logger.fatal(`Database failed to connect, ${err}`);
  }
  return;
};

export const dcFromDB = async () => {
  if (!db) return;

  await Mongoose.disconnect().catch((e) =>
    logger.error(`DB Failed to Disconnect, ${e}`)
  );

  logger.info('MongoDB disconnected.');

  return;
};
