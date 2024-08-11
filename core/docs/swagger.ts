import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle('Gateway API')
		.setDescription('API description')
		.setVersion('1.0')
		.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
		.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refresh-token')
		.build();
	if (process.env.NODE_ENV !== 'production') {
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('docs', app, document, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		});
	}
};
