import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway as NestWebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketsService } from './websocket.service';

@NestWebSocketGateway()
export class WebSocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor(
        private readonly webSocketService: WebsocketsService
    ) {}

    afterInit(server: Server) {
        console.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket) {
        const userId = client.handshake.auth.userId;
        this.webSocketService.addClient(userId, client.id);
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.auth.userId;
        this.webSocketService.removeClient(userId, client.id);
    }
}