import { Module } from '@nestjs/common';

import { ArticlesRepository } from 'src/database/repositories/articles.repository';
import { ProductsRepository } from 'src/database/repositories/products.repository';
import { ShopController } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService, ProductsRepository, ArticlesRepository],
})
export class ShopModule {}
