import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InventoryService } from './infentory.service';

@Controller({
  version: '1',
  path: '/inventory',
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.buffer.toString());
  }

  @Get('/test')
  getEntitlements(): string {
    return 'we are here!!!' + this.inventoryService.getInventory();
  }
}
