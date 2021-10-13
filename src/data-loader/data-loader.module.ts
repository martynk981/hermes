import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { DataLoaderController } from './data-loader.controller';
import { ArticlesRepository } from 'src/database/repositories/articles.repository';
import { ProductsRepository } from 'src/database/repositories/products.repository';

@Module({
  controllers: [DataLoaderController],
  providers: [InventoryService, ArticlesRepository, ProductsRepository],
})
export class DataLoaderModule {}
