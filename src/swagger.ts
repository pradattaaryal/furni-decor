import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENUM_APP_ENVIRONMENT } from './common/constants/app.constant';
import { AdminRouterModule } from './router/routes/admin.route.module';
import { CustomerRouterModule } from './router/routes/customer.route.module';
import { MarketingRouterModule } from './router/routes/marketing.route.module';
 

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>(
    'app.env',
    ENUM_APP_ENVIRONMENT.DEVELOPMENT,
  );

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
  
    const adminDocumentBuild = new DocumentBuilder()
      .setTitle('Furni Decor Admin API')
      .setDescription('Rest APIs for Furni Decor Admin')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentBuild,
      {
        deepScanRoutes: true,
        include: [AdminRouterModule],
      },
    );

    SwaggerModule.setup('/backend/admin-docs', app, adminDocument, {
      explorer: true,
      customSiteTitle: 'Furni Decor Admin',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

    // for public user
    const customerDocumentBuild = new DocumentBuilder()
      .setTitle('Furni Decor Public User API')
      .setDescription('Rest APIs for Furni Decor Public User')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const CustomerDocument = SwaggerModule.createDocument(
      app,
      customerDocumentBuild,
      {
        deepScanRoutes: true,
        include: [CustomerRouterModule],
      },
    );

    SwaggerModule.setup('/backend/public-user-docs', app, CustomerDocument, {
      explorer: true,
      customSiteTitle: 'Furni Decor Public User',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

  
    // for marketing user
    const partnerDocumentBuild = new DocumentBuilder()
      .setTitle('Furni Decor Marketing User API')
      .setDescription('Rest APIs for Furni Decor Partner User')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const partnerDocument = SwaggerModule.createDocument(
      app,
      partnerDocumentBuild,
      {
        deepScanRoutes: true,
        include: [MarketingRouterModule],
      },
    );

    SwaggerModule.setup('/backend/marketing-docs', app, partnerDocument, {
      explorer: true,
      customSiteTitle: 'Furni Decor Partner User',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });
  }
}
