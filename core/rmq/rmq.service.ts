import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

import { ConfigService } from 'core/config/config.service';

@Injectable()
export class RmqService {
	constructor(private readonly configService: ConfigService) {}

	getOptions(queue: string, noAck = false): RmqOptions {
		return {
			transport: Transport.RMQ,
			options: {
				queue,
				noAck,
				persistent: true,
				urls: [this.configService.getRabitMQConfig().uri],
			},
		};
	}

	ack(context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMessage = context.getMessage();
		channel.ack(originalMessage);
	}
}
