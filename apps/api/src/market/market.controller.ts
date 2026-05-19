import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('v1/market')
export class MarketController {

  @Get('interactive-map')
  async getInteractiveMap() {
    const farms: any[] = await prisma.$queryRaw`
      SELECT
        id,
        name,
        district,
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude
      FROM "Farm"
    `;
    return farms;
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
