import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { ProductInsertDto } from 'src/data-loader/dto/products/product-insert.dto';

@Injectable()
export class ProductsRepository {
  private tableName = 'products';
  private tableNameProductsContent = 'products_content';

  constructor(@InjectKnex() private readonly knex: Knex) {}

  async insertProducts({ products, productsContent }: ProductInsertDto) {
    let newProductQuantity;
    await this.knex.transaction((tr) => {
      return this.knex(this.tableName)
        .transacting(tr)
        .returning('id')
        .insert(products)
        .then((response) => {
          newProductQuantity = response.length;
          const productContentModels = [];
          response.forEach((productId, index) => {
            productsContent[index].forEach((productContentModel) => {
              productContentModel.product_id = productId;
              productContentModels.push(productContentModel);
            });
          });

          return this.knex(this.tableNameProductsContent)
            .transacting(tr)
            .insert(productContentModels)
            .then(() => response);
        })
        .then(tr.commit)
        .catch(tr.rollback);
    });

    return newProductQuantity;
  }
}
