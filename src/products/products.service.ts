import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { Product, ProductEntity } from './entities/product.entity';
import {
  CreateProductDto,
  RetrieveProductDto,
  UpdateProductDto,
} from './dto/product.schema';
import { createStripeProduct } from 'src/utils/stripe';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

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

  async retrieveAllProducts(
    query: RetrieveProductDto,
  ): Promise<Pagination<ProductEntity>> {
    let {
      page = '1',
      limit = '4',
      search = '',
      sort = 'id',
      order = '1',
      minPrice = '',
      maxPrice = '',
    } = query;

    const routeUrl = `${process.env.NEXT_UI_URL}/browse`;
    const queryBuilder = this.productsRepository.createQueryBuilder('p');

    // Search query
    if (search) {
      queryBuilder.where('p.name like :search', { search: `%${search}%` });
    }

    // Price range query
    if (minPrice && maxPrice) {
      queryBuilder.andWhere('p.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    } else if (minPrice) {
      queryBuilder.andWhere('p.price >= :minPrice', { minPrice });
    } else if (maxPrice) {
      queryBuilder.andWhere('p.price <= :maxPrice', { maxPrice });
    }

    queryBuilder.orderBy(`p.${sort}`, order === '1' ? 'ASC' : 'DESC');

    return paginate<ProductEntity>(queryBuilder, {
      limit: parseInt(limit),
      page: parseInt(page),
      route: routeUrl,
    });
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
