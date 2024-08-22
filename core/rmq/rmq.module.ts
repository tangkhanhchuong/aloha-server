import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ConfigService } from 'core/config/config.service';

import { RmqService } from './rmq.service';

interface RmqModuleOptions {
	name: string;
}

@Module({
	providers: [RmqService],
	exports: [RmqService],
})
export class RmqModule {
	static register({ name }: RmqModuleOptions): DynamicModule {
		return {
			module: RmqModule,
			imports: [
				ClientsModule.registerAsync([
					{
						name,
						useFactory: (configService: ConfigService) => ({
							transport: Transport.RMQ,
							options: {
								urls: [configService.getRabitMQConfig().uri],
								queue: name,
							},
						}),
						inject: [ConfigService],
					},
				]),
			],
			exports: [ClientsModule],
		};
	}
}
