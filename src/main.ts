import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/filters/httpException.filter';
import { NotFoundFilter } from './utils/filters/notFoundException.filter';
import { GlobalExceptionFilter } from './utils/filters/globalException.filter';
import { PrismaClientExceptionFilter } from './utils/filters/prismaException.filter';
import { SpelunkerModule } from 'nestjs-spelunker'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. Generate the tree as text
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  edges.forEach(e => {
    // console.log('element from module', e.from.module)
    // console.log('element to module', e.to.module)

  })
  const mermaidEdges = edges
    .filter( // I'm just filtering some extra Modules out
      ({ from, to }) =>
        !(
          from.module.name === 'ConfigHostModule' ||
          to.module.name === 'ConfigHostModule'
        ),
    )
    .map(({ from, to }) => `${from.module.name}-->${to.module.name}`);
  console.log(`graph TD\n\t${mermaidEdges.join('\n\t')}`);
  
  // 2. Copy and paste the log content in "https://mermaid.live/"

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'swagger', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('Reminder API')
    .setDescription('Memberberries')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    disableErrorMessages: process.env.NODE_ENV !== 'development',
  }));

  const adapterHost = app.get(HttpAdapterHost);
  const httpAdapter = adapterHost.httpAdapter;

  app.useGlobalFilters(
    new GlobalExceptionFilter(adapterHost), 
    new HttpExceptionFilter(), 
    new NotFoundFilter(),
    new PrismaClientExceptionFilter(httpAdapter)
  )

  app.use(cookieParser());

  await app.listen(3000);

  process.on('uncaughtException', err => {
    console.log('uncaughtException event in main.ts: ' + err.message)
    process.exit(1)
  })
}

bootstrap();
