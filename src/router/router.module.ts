import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AdminRouterModule } from './routes/admin.route.module';
 

@Module({
  imports: [
    AdminRouterModule,
 
 
    NestJsRouterModule.register([
      {
        path: 'backend/api/admin',
        module: AdminRouterModule,
      },
  
    ]),
  ],
})
export class RouterModule {}
