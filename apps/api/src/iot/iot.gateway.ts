import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class IotGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private interval: NodeJS.Timeout;

  afterInit(server: Server) {
    console.log('📡 IoT Gateway initialized');
    // Start emitting simulated data every 5 seconds
    this.interval = setInterval(() => this.broadcastSensorData(), 5000);
  }

  handleConnection(client: Socket) {
    console.log(`🟢 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-farm-stream')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() farmId: string,
  ) {
    if (!farmId) return;
    client.join(farmId);
    console.log(`👤 Client ${client.id} joined farm room: ${farmId}`);
    return { event: 'joined', room: farmId };
  }

  @SubscribeMessage('leave-farm-stream')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() farmId: string,
  ) {
    if (!farmId) return;
    client.leave(farmId);
    console.log(`👤 Client ${client.id} left farm room: ${farmId}`);
    return { event: 'left', room: farmId };
  }

  private broadcastSensorData() {
    // We get all active rooms (excluding default socket.id rooms)
    const rooms = this.server.sockets.adapter.rooms;

    for (const [roomName, clients] of rooms.entries()) {
      // Ignore individual client ID rooms
      if (clients.has(roomName)) continue;

      const mockData = {
        farmId: roomName,
        temperature: parseFloat((Math.random() * (28 - 22) + 22).toFixed(1)),
        ph: parseFloat((Math.random() * (7.5 - 6.5) + 6.5).toFixed(1)),
      };

      this.server.to(roomName).emit('sensor-update', mockData);
    }
  }
}
