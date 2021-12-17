import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';
async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('/api');
  app.use(
    cookieSession({
      name: 'nest-server-cookie',
      keys: ['dffdfdfdf', 'dsdss'],
      sameSite: 'lax',
      httpOnly: true,
    }),
  );
  app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  // app.use(function (req, res, next) {
  //   var token = req.csrfToken();
  //   res.cookie('XSRF-TOKEN', token);
  //   res.locals.csrfToken = token;
  //   next();
  // });

  app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(port);
}
bootstrap();
