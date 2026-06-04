import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class LogisticsService {
  /**
   * Calculates dynamic delivery fee based on PostGIS spatial distance.
   * Math: ST_Distance returns meters. We convert to KM and apply rate.
   * Rule: 60 BDT base + 5 BDT per kilometer.
   */
  async calculateDeliveryFee(farmId: string, userLat: number, userLng: number): Promise<number> {
    const BASE_FEE = 60;
    const PER_KM_RATE = 5;

    // We use a raw query to extract the exact distance in meters from the unsupported geography column
    const result: any[] = await prisma.$queryRaw`
      SELECT ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(${userLng}, ${userLat}), 4326)::geography
      ) as distance_meters
      FROM "Farm"
      WHERE id = ${farmId}
    `;

    if (!result || result.length === 0 || result[0].distance_meters === null) {
      throw new NotFoundException(`Geospatial data not found for Farm ID: ${farmId}`);
    }

    const distanceInMeters = result[0].distance_meters;
    const distanceInKm = distanceInMeters / 1000;

    const totalFee = BASE_FEE + (distanceInKm * PER_KM_RATE);

    // Return rounded up to nearest Poisha (2 decimal places) or strict integer
    return Math.ceil(totalFee);
  }
}
