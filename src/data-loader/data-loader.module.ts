import { Module } from '@nestjs/common';
import { InventoryService } from './services/infentory.service';
import { InventoryController } from './inventory.controller';
import { ArticleRepository } from 'src/database/repositories/article.repository';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, ArticleRepository],
})
export class DataLoaderModule {}
