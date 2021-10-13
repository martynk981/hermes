import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InventoryFileDto } from './dto/inventory-file.dto';
import { ProductsFileDto } from './dto/products-file.dto';
import { InventoryService } from './services/inventory.service';

@Controller({
  version: '1',
  path: '/data-loader',
})
export class DataLoaderController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('inventory')
  @UseInterceptors(FileInterceptor('file'))
  uploadInventory(@UploadedFile() file: Express.Multer.File) {
    const fileContent = JSON.parse(file.buffer.toString()) as InventoryFileDto;
    this.inventoryService.loadInventory(fileContent.inventory);
  }

  @Post('products')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    const fileContent = JSON.parse(file.buffer.toString()) as ProductsFileDto;
    const ids = await this.inventoryService.loadProducts(fileContent.products);
    console.log(ids);
  }
}
