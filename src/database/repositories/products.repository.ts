import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { ProductInsertDto } from 'src/data-loader/dto/product-insert.dto';
import { ProductAvailabilityDto } from '../dto/product-availability.dto';
import { ProductContentModel } from '../models/product-content.model';

@Injectable()
export class ProductsRepository {
  private tableName = 'products';
  private tableNameProductContent = 'product_content';

  constructor(@InjectKnex() private readonly knex: Knex) {}

  async insert({ products, productsContent }: ProductInsertDto) {
    await this.knex.transaction((trx) => {
      return this.knex(this.tableName)
        .transacting(trx)
        .returning('id')
        .insert(products)
        .then((response) => {
          const productContentModels = [];
          response.forEach((productId, index) => {
            productsContent[index].forEach((productContentModel) => {
              productContentModel.product_id = productId;
              productContentModels.push(productContentModel);
            });
          });

          return this.knex(this.tableNameProductContent)
            .transacting(trx)
            .insert(productContentModels)
            .then(() => response);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }

  async getProductsAvailability(productId?: number): Promise<ProductAvailabilityDto[]> {
    const filterByProduct = !!productId;
    const query = `
        SELECT
           p.id as id ,
           p.name,
           pa.product_quantity as quantity
        FROM products p
        INNER JOIN (
          ${ProductsRepository.buildQuantityProductQuery(filterByProduct)}
        ) as pa on pa.id = p.id
      `;

    const bindParams = filterByProduct ? { id: productId } : undefined;
    const result = await this.knex.raw(query, bindParams);

    return result.rows as ProductAvailabilityDto[];
  }

  async getProductContent(productId: number): Promise<ProductContentModel[]> {
    return await this.knex<ProductContentModel>(this.tableNameProductContent)
      .where({ product_id: productId })
      .select();
  }

  private static buildQuantityProductQuery(filterByProduct: boolean): string {
    const query = `
      SELECT 
        p2.id as id,
        MIN(ceil(a.stock/pc.quantity)) as product_quantity
      FROM 
        products AS p2
      INNER JOIN products_content pc 
        ON pc.product_id = p2.id 
      INNER JOIN articles a
        ON a.id = pc.article_id
      ${filterByProduct ? `WHERE p2.id = :id` : ``}
      GROUP BY p2.id
    `;

    return query;
  }
}
