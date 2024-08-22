import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';

// import { setupSwagger } from 'core/docs/swagger';

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

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
