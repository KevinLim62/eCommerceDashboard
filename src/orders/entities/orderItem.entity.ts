import { Product, ProductEntity } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order, OrderEntity } from './order.entity';

@Entity('orderItems')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ProductEntity)
  @JoinColumn()
  product: ProductEntity;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, (orders) => orders.orderItem)
  order: OrderEntity;
}

export type OrderItem = {
  id: number;
  product: Product;
  quantity: number;
  order: Order;
};
