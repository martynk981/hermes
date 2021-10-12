import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataLoaderModule } from './data-loader/data-loader.module';
import { configValidationSchema } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: configValidationSchema,
    }),

    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: {
            user: configService.get('DB_USER'),
            host: configService.get('DB_HOST'),
            database: configService.get('DB_SCHEMA'),
            password: configService.get('DB_PASSWORD'),
            port: 5432,
          },
        },
      }),
    }),

    DataLoaderModule,
  ],
})
export class AppModule {}
