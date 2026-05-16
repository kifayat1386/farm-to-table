import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('v1/market')
export class MarketController {

  @Get('interactive-map')
  async getInteractiveMap() {
    return prisma.farm.findMany({
      select: {
        id: true,
        name: true,
        district: true,
      }
    });
    // Note: To return latitude/longitude, a raw query on the PostGIS location column is needed.
  }

  @Get('farm/:id/products')
  async getFarmProducts(@Param('id') id: string) {
    return prisma.product.findMany({
      where: { farmId: id },
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
      }
    });
  }
}
