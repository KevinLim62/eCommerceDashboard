import { OrderEntity } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column('text', { array: true })
  imageSrc: string[];

  @Column()
  description: string;
}

export type Product = {
  id: number;
  name: string;
  price: number;
  imageSrc: string[];
  description: string;
};
