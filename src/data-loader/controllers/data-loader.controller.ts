import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InventoryFileDto } from '../dto/inventory/inventory-file.dto';
import { ProductsFileDto } from '../dto/products/products-file.dto';
import { DataLoaderService } from '../services/data-loader.service';

@Controller({
  version: '1',
  path: '/data-loader',
})
export class DataLoaderController {
  private readonly logger = new Logger(DataLoaderController.name);

  constructor(private readonly dataLoaderService: DataLoaderService) {}

  @Post('articles')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArticles(@UploadedFile() file: Express.Multer.File) {
    this.logger.debug('Starting uploading articles');

    try {
      const fileContent = JSON.parse(file.buffer.toString()) as InventoryFileDto;
      this.logger.debug(`Articles to insert/update: ${fileContent.inventory.length}`);

      if (fileContent.inventory.length) {
        await this.dataLoaderService.uploadArticles(fileContent.inventory);
      }

      return {
        uploaded: fileContent.inventory.length,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('products')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    this.logger.debug('Starting uploading products');
    try {
      const fileContent = JSON.parse(file.buffer.toString()) as ProductsFileDto;
      this.logger.debug(`Products to insert: ${fileContent.products.length}`);

      if (fileContent.products.length) {
        await this.dataLoaderService.uploadProducts(fileContent.products);
      }

      return {
        uploaded: fileContent.products.length,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
