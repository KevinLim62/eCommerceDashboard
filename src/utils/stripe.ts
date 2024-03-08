require('dotenv').config();
import { CreateOrderDto } from 'src/orders/dto/order.schema';
import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/products/dto/product.schema';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const createStripePrice = async (price: number, productId: string) => {
  return await stripe.prices.create({
    currency: 'MYR',
    unit_amount: price * 100,
    product: productId,
  });
};

export const createStripeProduct = async (
  product: CreateProductDto,
  productId: string,
) => {
  const stripeProduct = await stripe.products.create({
    id: productId,
    name: product.name,
    description: product.description,
    images: product.imageSrc,
    default_price_data: {
      currency: 'MYR',
      unit_amount: product.price * 100,
    },
  });

  return stripeProduct;
};

export const retrieveStripeProductById = async (productId: string) => {
  return await stripe.products.retrieve(productId);
};

export const updateStripeProduct = async (
  product: UpdateProductDto,
  productId: string,
) => {
  stripe.products.update(productId, {
    name: product.name,
    description: product.description,
    images: product.imageSrc,
  });
};

export const deleteStripeProductById = async (productId: string) => {
  return await stripe.products.del(productId);
};

export const createStripePaymentLink = async (
  orderId: string,
  order: CreateOrderDto,
) => {
  const payload = await Promise.all(
    order.orderItem.map(async (item) => {
      const product = await retrieveStripeProductById(item.productId);
      return {
        price: product.default_price.toString(),
        quantity: item.quantity,
      };
    }),
  );

  const stripePaymentLink = await stripe.paymentLinks.create({
    line_items: payload,
    metadata: {
      userId: order.userId,
      orderId: orderId,
    },
  });

  return stripePaymentLink;
};
