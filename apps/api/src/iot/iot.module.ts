import { Module } from '@nestjs/common';
import { IotGateway } from './iot.gateway';

@Module({
  providers: [IotGateway],
})
export class IotModule {}
