import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SweetsService {
  constructor(private prisma: PrismaService) {}

  // ✅ THIS METHOD WAS MISSING
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
}
