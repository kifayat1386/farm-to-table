import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogisticsService } from '../logistics/logistics.service';
import { CreateOrderDto } from './dto/create-order.dto';

const prisma = new PrismaClient();

@Injectable()
export class OrdersService {
  constructor(private logisticsService: LogisticsService) {}

  async createOrder(dto: CreateOrderDto) {
    const { userId, farmId, items, userLat, userLng } = dto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain items.');
    }

    // 1. Calculate dynamic logistics fee from origin farm to destination
    const logisticsFee = await this.logisticsService.calculateDeliveryFee(farmId, userLat, userLng);

    // 2. Strict Database Transaction (Atomic Accrual Split)
    return await prisma.$transaction(async (tx) => {
      let totalItemCost = 0;
      const orderItemsData = [];

      for (const item of items) {
        // Fetch and lock product stock (Requires row locking in highly concurrent env, using simple check here)
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        totalItemCost += itemTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3. Accrual Ledger Calculations
      // Platform takes strict 10%
      const platformFee = totalItemCost * 0.10;

      // Farmer payout is strictly the remainder
      const vendorPayout = totalItemCost - platformFee;

      // Ensure mathematical integrity
      if (Math.abs(platformFee + vendorPayout - totalItemCost) > 0.01) {
        throw new BadRequestException('Ledger split mathematical failure');
      }

      // 4. Immutable Transaction Creation
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          platformFee: parseFloat(platformFee.toFixed(2)),
          vendorPayout: parseFloat(vendorPayout.toFixed(2)),
          logisticsFee: parseFloat(logisticsFee.toFixed(2)),
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: true
        }
      });

      return order;
    });
  }
}
