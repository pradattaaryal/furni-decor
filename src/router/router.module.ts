import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AdminRouterModule } from './routes/admin.route.module';
import { UserRouterModule } from './routes/user.route.module';
import { MarketingRouterModule } from './routes/marketing.route.module';

@Module({
  imports: [
    AdminRouterModule,
    UserRouterModule,
    MarketingRouterModule,
    NestJsRouterModule.register([
      {
        path: 'backend/api/admin',
        module: AdminRouterModule,
      },
      {
        path: 'backend/api/customer',
        module: UserRouterModule,
      },
      {
        path: 'backend/api/marketing',
        module: MarketingRouterModule,
      },
    ]),
  ],
})
export class RouterModule {}
