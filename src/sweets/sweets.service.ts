import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  create(dto: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }) {
    return this.prisma.sweet.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.sweet.findMany();
  }

  // ✅ ADD THIS
  async purchase(id: string, amount: number) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet || sweet.quantity < amount) {
      throw new Error('Insufficient stock');
    }

    return this.prisma.sweet.update({
      where: { id },
      data: {
        quantity: sweet.quantity - amount,
      },
    });
  }

  // ✅ ADD THIS
  async restock(id: string, amount: number) {
    const sweet = await this.prisma.sweet.findUnique({
      where: { id },
    });

    if (!sweet) {
      throw new Error('Sweet not found');
    }

    return this.prisma.sweet.update({
      where: { id },
      data: {
        quantity: sweet.quantity + amount,
      },
    });
  }
}
