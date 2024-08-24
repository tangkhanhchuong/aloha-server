import { Module } from '@nestjs/common';

import { WebSocketModule } from 'core/websocket/websocket.module';

@Module({
    imports: [WebSocketModule]
})
export class NotificationModule {}
