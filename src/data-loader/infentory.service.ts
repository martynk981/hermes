import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class InventoryService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  public getInventory(): string {
    return 'here';
  }
}
