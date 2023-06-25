# MeerCat - NestJS Logging Middleware

The name comes from the animal, Meerkat, which always monitors every single event for the good of its colony, and CAT, the UNIX utility.

This is a NestJS middleware that serves a simple yet missing functionality in NestJS : logging HTTP requests and errors

## Install and Usage

`npm i meercat`

Then, in your main `app.module.ts`

```
import { MeercatLoggingMiddleware } from 'meercat';

// Declare the middleware on all routes
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MeercatLoggingMiddleware).forRoutes('*');
  }
}
```

## Options

// TODO