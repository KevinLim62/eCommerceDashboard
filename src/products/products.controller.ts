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
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from 'src/utils/validationPipe';
import {
  CreateProductDto,
  RetrieveProductDto,
  UpdateProductDto,
  createProductSchema,
  retrieveProductSchema,
  updateProductSchema,
} from './dto/product.schema';
import { Public, Roles } from 'src/utils/middlewares';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @Public()
  @Get()
  @UsePipes(new ZodValidationPipe(retrieveProductSchema))
  async retrieveAllProducts(@Query() query: RetrieveProductDto) {
    return this.productsService.retrieveAllProducts(query);
  }

  @Public()
  @Get(':id')
  async retrieveProductById(@Param('id') id: string) {
    return this.productsService.retrieveProductById(+id);
  }

  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  async updateProductById(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.updateProductById(+id, product);
  }

  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Delete(':id')
  async deleteProductById(@Param('id') id: string) {
    return this.productsService.deleteProductById(+id);
  }
}
