import { Module } from '@nestjs/common';
import { DataLoaderService } from './services/data-loader.service';
import { DataLoaderController } from './controllers/data-loader.controller';
import { ArticlesRepository } from '../database/repositories/articles.repository';
import { ProductsRepository } from '../database/repositories/products.repository';

@Module({
  controllers: [DataLoaderController],
  providers: [DataLoaderService, ArticlesRepository, ProductsRepository],
})
export class DataLoaderModule {}
