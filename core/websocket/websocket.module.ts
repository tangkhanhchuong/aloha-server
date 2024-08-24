import { Module } from '@nestjs/common';

import { SessionModule } from 'core/session/session.module';

import { WebSocketsGateway } from './websocket.gateway';
import { WebsocketsService } from './websocket.service';

@Module({
    imports: [
        SessionModule
    ],
    providers: [
        WebSocketsGateway,
        WebsocketsService
    ]
})
export class WebSocketModule {}
