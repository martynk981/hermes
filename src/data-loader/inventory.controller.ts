import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleModel } from 'src/database/models/article.model';
import { InventoryDto } from './dto/inventory.dto';
import { InventoryService } from './services/infentory.service';

@Controller({
  version: '1',
  path: '/inventory',
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileContent = JSON.parse(file.buffer.toString()) as InventoryDto;
    const articles = fileContent.inventory.map((dto) => {
      const article = new ArticleModel();
      article.id = dto.art_id;
      article.name = dto.name;
      article.stock = dto.stock;

      return article;
    });

    this.inventoryService.addArticles(articles);
  }
}
