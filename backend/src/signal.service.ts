import { Injectable } from '@nestjs/common';
import { Server } from 'http';

@Injectable()
export class ShutdownService {
  private server: Server;

  constructor() {}

  public init(server: Server): void {
    this.server = server;

    // Register signal handlers
    process.on('SIGTERM', this.handleSignal);
    process.on('SIGINT', this.handleSignal);
  }

  private handleSignal = (): void => {
    console.log('Received shutdown signal');

    // Close server to stop accepting new connections
    this.server.close(() => {
      console.log('Server has stopped accepting new connections');

      // Cleanup any resources
      // ...

      // Exit the process
      process.exit(0);
    });
  };
}