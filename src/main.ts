import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { ConfigService } from "@nestjs/config";
import { CorsConfig, NestConfig, SwaggerConfig } from "./common/configs/config.interface";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { App } from "@slack/bolt";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable shutdown hook
  app.enableShutdownHooks();

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }

  // Slack
  const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });

  // Define a message handler
  slackApp.message('hello', async ({ message, say }) => {
    await say(`Hey there <@${message}>!`);
  });

  // Start the Slack event listener
  await (async () => {
    await slackApp.start(process.env.PORT || 3001);
    console.log('Slack bot is running on port', process.env.PORT || 3001);
  })();

  // Start the NestJS app
  await app.listen(process.env.PORT || nestConfig.port || 3000);
}
bootstrap().then(() => {
  console.log('Bootstrap done!');
});
