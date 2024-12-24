// // src/utils/log-routes.ts
// import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { RoutesResolver, HttpAdapterHost } from '@nestjs/core';

// @Injectable()
// export class RouteLoggerService implements OnApplicationBootstrap {
//   constructor(
//     private readonly routesResolver: RoutesResolver,
//     private readonly httpAdapterHost: HttpAdapterHost,
//   ) {}

//   onApplicationBootstrap() {
//     const server = this.httpAdapterHost.httpAdapter.getHttpServer();
//     const router = server._events.request._router;

//     console.log('📚 List of API Routes:');
//     router.stack
//       .filter((r) => r.route)
//       .forEach((r) => {
//         console.log(
//           `${Object.keys(r.route.methods).join(', ').toUpperCase()} -> ${r.route.path}`,
//         );
//       });
//   }
// }
