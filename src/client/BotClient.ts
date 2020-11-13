import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from 'discord-akairo';

import { Message } from 'discord.js';
import { join } from 'path';
import { defaultPrefix, owners, staticGlobals, token } from '../Config';
import DebugLogger from '../utils/DebugLogger';
import { uriFromConfig } from '../utils/MiscTools';
import { connectToDB } from '../database/Database';
// DB Import
import { Logger } from 'tslog';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    config: BotOptions;
    log: Logger;
    static: StaticGlobals;
  }
}

interface BotOptions {
  token?: string;
  owners?: string | string[];
}

interface StaticGlobals {
  globalBotName: string;
  creatorName?: string;
}

export default class BotClient extends AkairoClient {
  public config: BotOptions;

  public static!: StaticGlobals;

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', 'listeners'),
  });

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: defaultPrefix,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 6e4,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string =>
          `${str}\n\nType \`cancel\` to cancel the commmand...`,
        modifyRetry: (_: Message, str: string): string =>
          `${str}\n\nType \`cancel\` to cancel the commmand...`,
        timeout: 'Command timedout',
        ended: 'You reached the maximum retries, command cancelled.',
        retries: 3,
        time: 3e4,
      },
      otherwise: '',
    },
    ignorePermissions: owners,
  });

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, '..', 'inhibitors'),
  });

  public constructor(config: BotOptions) {
    super({
      ownerID: config.owners,
    });

    this.log = DebugLogger;

    this.static = staticGlobals;
  }

  private async _init(): Promise<void> {
    const initLog = this.log.getChildLogger({
      name: 'BotInit',
    });

    const uri = uriFromConfig();

    initLog.info('Setting Up Command Handler with Inhibitor and Listener');
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    initLog.info('Setting ListenHandler emitters');
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      inhibtorHandler: this.inhibitorHandler,
    });

    initLog.info('Loading Command Handler, Size: ');
    this.commandHandler.loadAll();
    initLog.info('Loading Listener Handlers');
    this.listenerHandler.loadAll();
    initLog.info('Loading Complete');

    await connectToDB();
  }

  public async start(): Promise<string> {
    this.log.info('Starting Bot Process');
    await this._init();
    return this.login(token);
  }
}
