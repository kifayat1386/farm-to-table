import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IotModule } from './iot/iot.module';
import { MarketModule } from './market/market.module';
import { AppService } from './app.service';

@Module({
  imports: [IotModule, MarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
