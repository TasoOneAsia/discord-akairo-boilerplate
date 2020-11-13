import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class UptimeCommand extends Command {
  constructor() {
    super('uptime', {
      aliases: ['uptime'],
      category: 'Utility',
      description: {
        content: 'See current uptime for Bot instance',
        usage: 'uptime',
        examples: ['uptime'],
      },
    });
  }

  public exec(message: Message): Promise<Message> {
    const days = Math.floor(this.client.uptime / 86400000);
    const hours = Math.floor(this.client.uptime / 3600000) % 24;
    const minutes = Math.floor(this.client.uptime / 60000) % 60;
    const seconds = Math.floor(this.client.uptime / 1000) % 60;

    const embed = new MessageEmbed()
      .setColor('#ff8f00')
      .setDescription(
        `**🕒 Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s`
      );

    return message.util.send(embed);
  }
}
