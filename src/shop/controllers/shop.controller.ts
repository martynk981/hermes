import { BadRequestException, Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ProductAvailabilityDto } from '../../database/dto/product-availability.dto';
import { SellProductDto } from '../dto/sell-product.dto';
import { ShopService } from '../services/shop.service';

@Controller({
  version: '1',
  path: '/shop',
})
export class ShopController {
  private readonly logger = new Logger(ShopController.name);

  constructor(private readonly shopService: ShopService) {}

  @Get('/product-list')
  async productList(): Promise<ProductAvailabilityDto[]> {
    try {
      return await this.shopService.getProductList();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('/sell-product')
  async sellProduct(@Body() sellProductDto: SellProductDto) {
    this.logger.debug('Products to sell:', sellProductDto);
    try {
      const isProductAvailable = await this.shopService.isProductAvailable(sellProductDto);

      if (isProductAvailable) {
        await this.shopService.sellProduct(sellProductDto);
        return {
          success: true,
        };
      }
      throw new BadRequestException('Product is not available');
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
