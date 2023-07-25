# MeerCat - NestJS Request Logging Middleware

![Meercat](https://dokitek-public.s3.eu-west-3.amazonaws.com/images/meercat.png)

The name comes from the animal, Meerkat, which is always extremely focused on its environment in order to protect its colony, and CAT, the UNIX utility which outputs text.

This is a NestJS middleware that serves a simple yet missing functionality in NestJS : logging HTTP requests and errors, like Morgan with Express. It offers several features like customization and detailed error logging

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

### Custom Logger
By default, Meercat uses the default NestJS logger, only handling the timestamp a bit differently.
You can override this behaviour by providing the token `MEERCAT_LOGGER` with the desired logger.

### MeercatOptions
You can customize the logger behaviour by providing the token `MEERCAT_OPTIONS` with a `MeercatOptions` object :

```
export type MeercatOptions = {
  name?: string;
  logErrorDetails?: boolean; // default true
  blacklisted?: string[]
};

```

`name` : Customize the logger name
`logErrorDetails` : logs the query, body and user agent to the console when the request status >= 400. log level: debug
`blacklisted` : a list of keywords, if the keyword is included in the req.baseUrl, the request won't be logged (can be used to prevent clutter)

Example : 
```
  providers: [
    {
      provide: MEERCAT_OPTIONS,
      useValue: { logErrorDetails: false } as MeercatOptions,
    },
  ],
```