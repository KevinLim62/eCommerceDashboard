import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { Product, ProductEntity } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(product: CreateProductDto) {
    const existingProduct = await this.retrieveProductByName(product.name);

    if (existingProduct) {
      throw new HttpException('Product already exists', HttpStatus.BAD_REQUEST);
    }

    return this.productsRepository.save(product);
  }

  async retrieveAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async retrieveProductById(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id: id });
  }

  async retrieveProductByName(name: string): Promise<Product> {
    return this.productsRepository.findOneBy({ name: name });
  }

  async updateProductById(
    id: number,
    product: UpdateProductDto,
  ): Promise<Product> {
    await this.productsRepository.update(id, product);
    return this.retrieveProductById(id);
  }

  async deleteProductById(id: number): Promise<DeleteResult> {
    return this.productsRepository.delete(id);
  }
}
