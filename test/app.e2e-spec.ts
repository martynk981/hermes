import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { knex } from 'knex';
import * as fs from 'fs';

describe('Hermes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dbClinet = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA,
      },
    });
    await dbClinet.raw('TRUNCATE TABLE product_content RESTART IDENTITY');
    await dbClinet.raw('TRUNCATE TABLE articles RESTART IDENTITY CASCADE');
    await dbClinet.raw('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should upload articles', async () => {
    return request(app.getHttpServer())
      .post('/data-loader/articles')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', fs.createReadStream(__dirname + '/data/inventory.json'))
      .expect({ uploaded: 4 });
  });

  it('should upload products', () => {
    return request(app.getHttpServer())
      .post('/data-loader/products')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', fs.createReadStream(__dirname + '/data/products.json'))
      .expect({ uploaded: 2 });
  });

  it('should return product list', () => {
    return request(app.getHttpServer())
      .get('/shop/product-list')
      .expect(200)
      .expect([
        {
          id: 1,
          name: 'Dining Chair',
          quantity: 2,
        },
        {
          id: 2,
          name: 'Dinning Table',
          quantity: 1,
        },
      ]);
  });

  it('should should sell product', () => {
    return request(app.getHttpServer())
      .post('/shop/sell-product')
      .send({
        productId: 1,
        sellQuantity: 2,
      })
      .expect(201);
  });

  it('should change product availability', () => {
    return request(app.getHttpServer())
      .get('/shop/product-list')
      .expect(200)
      .expect([
        {
          id: 1,
          name: 'Dining Chair',
          quantity: 0,
        },
        {
          id: 2,
          name: 'Dinning Table',
          quantity: 0,
        },
      ]);
  });

  it('should return false in product is not available', () => {
    return request(app.getHttpServer())
      .post('/shop/sell-product')
      .send({
        productId: 1,
        sellQuantity: 2,
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Product is not available',
        error: 'Bad Request',
      });
  });
});
