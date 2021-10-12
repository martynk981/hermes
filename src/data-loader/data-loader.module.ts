import { Module } from '@nestjs/common';
import { InventoryService } from './infentory.service';
import { InventoryController } from './inventory.controller';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class DataLoaderModule {}
