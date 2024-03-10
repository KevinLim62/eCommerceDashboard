import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem, OrderItemEntity } from './orderItem.entity';
import { UserEntity } from 'src/users/entities/user.entity';

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

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

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
