export class CreateOrderDto {
  userId: string;
  farmId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  userLat: number;
  userLng: number;
}
