import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { Product, ProductEntity } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.schema';
import { createStripeProduct } from 'src/utils/stripe';

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

    const Product = await this.productsRepository.save(product);
    await createStripeProduct(product, Product.id.toString());
    return Product;
  }

  async retrieveAllProducts(): Promise<Product[]> {
    // Create Stripe Product Script
    // const allProducts = await this.productsRepository.find();
    // allProducts.forEach(async (product) => {
    //   const payload: CreateProductDto = {
    //     name: product.name,
    //     price: product.price,
    //     imageSrc: product.imageSrc,
    //     description: product.description,
    //   };
    //   await createStripeProduct(payload, product.id.toString());
    // });

    return this.productsRepository.find();
  }

  async retrieveProductById(id: number): Promise<Product> {
    return this.productsRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async retrieveProductByName(name: string): Promise<Product> {
    return this.productsRepository.findOne({
      where: {
        name: name,
      },
    });
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
