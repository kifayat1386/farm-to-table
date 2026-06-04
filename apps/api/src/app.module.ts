import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IotModule } from './iot/iot.module';
import { MarketModule } from './market/market.module';
import { LogisticsModule } from './logistics/logistics.module';
import { OrdersModule } from './orders/orders.module';
import { AppService } from './app.service';

@Module({
  imports: [IotModule, MarketModule, LogisticsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
