import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  public constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client',
    });
  }

  public exec(): void {
    const logChild = this.client.log.getChildLogger({
      name: 'ReadyListener',
    });

    logChild.info(
      `${this.client.static.globalBotName} has started sucessfully!`
    );
    //Sets Presence
    logChild.info('Setting bot presence');
    this.client.user.setPresence({
      activity: { type: 'WATCHING', name: 'for $help command' },
    });
    logChild.info("Set Bot's Presence Sucessfully");
  }
}
