import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import * as morgan from 'morgan';

// import { setupSwagger } from 'core/docs/swagger';
import { RmqService } from 'core/rmq/rmq.service';
import { Services } from 'shared/constants/microservice';

import { AppModule } from './app.module';

async function bootstrap() {
	const loggingLevels: LogLevel[] = ['error', 'warn', 'log'];
	let loggingMode = 'combined';

	if (process.env.NODE_ENV != 'production') {
		loggingLevels.push('debug');
		loggingMode = 'dev';
	}
	const app = await NestFactory.create(AppModule, {
		logger: loggingLevels,
		cors: {
			origin: true,
			credentials: true,
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		},
	});

	app.use(morgan(loggingMode));
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	// setupSwagger(app);

	const rmqService = app.get<RmqService>(RmqService);
	app.connectMicroservice<RmqOptions>(rmqService.getOptions(Services.AUTH_SERVICE, true));
	await app.startAllMicroservices();

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
