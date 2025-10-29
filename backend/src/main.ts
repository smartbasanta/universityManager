import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exceptions/global.exception';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getRepository } from 'typeorm';
// import { staffPermissionEntity } from './model/staffPermission.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically strip non-whitelisted properties
    transform: true, // Automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  }));
  
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Research Shock')
    .setDescription('API Documentation for Research Shock')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'Enter access-token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: `
    body {
      background-color: #000 !important;
    }

    .swagger-ui {
      background-color: #ffffff !important;
      color: #000000 !important;
    }

    .swagger-ui .topbar {
      background-color: #f8f9fa !important;
    }

    .swagger-ui .info,
    .swagger-ui .info h1,
    .swagger-ui .scheme-container,
    .swagger-ui .opblock-tag,
    .swagger-ui .opblock-summary-description,
    .swagger-ui .opblock-description-wrapper,
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .response-col_status,
    .swagger-ui .model-box {
      color: #000000 !important;
      background-color: #ffffff !important;
    }

    .swagger-ui .opblock {
      background-color: #f0f0f0 !important;
    }

    .swagger-ui .opblock .opblock-summary {
      background-color: #e8e8e8 !important;
    }

    .swagger-ui .opblock .opblock-summary-description {
      color: #333333 !important;
    }

    .swagger-ui .btn {
      background-color: #007bff !important;
      color: #ffffff !important;
    }

    .swagger-ui .btn:hover {
      background-color: #0056b3 !important;
    }

    .swagger-ui .responses-inner,
    .swagger-ui .response {
      background-color: #f9f9f9 !important;
    }

    .swagger-ui .model-box-control {
      color: #000000 !important;
    }
  `,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap()
  .then(() => {
    console.log(`Server started in http://localhost:${process.env.PORT}/api`);
  })
  .catch((e) =>
    console.error(`Error started while server starting as \n ${e.message}`),
  );
