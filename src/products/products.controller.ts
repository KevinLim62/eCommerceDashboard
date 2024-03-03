import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from 'src/utils/validationPipe';
import {
  CreateProductDto,
  UpdateProductDto,
  createProductSchema,
  updateProductSchema,
} from './dto/product.schema';
import { Public, Roles } from 'src/utils/middlewares';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @Get()
  async retrieveAllProducts() {
    return this.productsService.retrieveAllProducts();
  }

  @Get(':id')
  async retrieveProductById(@Param('id') id: string) {
    return this.productsService.retrieveProductById(+id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  async updateProductById(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.updateProductById(+id, product);
  }

  @Delete(':id')
  async deleteProductById(@Param('id') id: string) {
    return this.productsService.deleteProductById(+id);
  }
}
