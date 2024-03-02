import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem, OrderItemEntity } from './orderItem.entity';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItem: OrderItemEntity[];

  //Expire time in seconds
  @Column({ default: '300' })
  expireTime: number;
}

export type Order = {
  id: number;
  orderStatus: OrderStatus;
  orderItem: OrderItem[];
  expireTime: number;
};
