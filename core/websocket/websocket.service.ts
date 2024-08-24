import { Injectable, NotFoundException } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SessionService } from 'core/session/session.service';
import { UserSessionPayload } from 'shared/business/auth/user-session';

@Injectable()
export class WebsocketsService {
    @WebSocketServer() private server: Server

    constructor(
        private readonly sessionService: SessionService
    ) {}

    async addClient(cognitoId: string, socketId: string) {
        const userSession = await this.sessionService.getSession<UserSessionPayload>(cognitoId);
        if (!userSession) {
            throw new NotFoundException('Session not found');
        }
        console.log("Connect to server");
        await this.sessionService.addSession<UserSessionPayload>(
            cognitoId,
            {
                socketIds: [...new Set([...userSession.socketIds || [], socketId])]
            }
        );
    }

    async removeClient(cognitoId: string, socketId: string) {
        const userSession = await this.sessionService.getSession<UserSessionPayload>(cognitoId);
        if (!userSession) {
            throw new NotFoundException('Session not found');
        }
        console.log("Disconnect from server");
        await this.sessionService.addSession<UserSessionPayload>(
            cognitoId,
            {
                ...userSession,
                socketIds: (userSession.socketIds || []).filter(id => id !== socketId)
            }
        );
    }   

    broadcastToAll(event: string, data: any) {
        this.server.emit(event, data);
    }
}