// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Request,
//   SerializeOptions,
//   NotFoundException,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { PUBLIC_USER_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
// import { ApiDocs } from 'src/common/doc/common-docs';
// import { IdParamDto } from 'src/common/dto/id-param.dto';
// import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
// import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
// import { IResponse } from 'src/common/response/interfaces/response.interface';
// import { GetUser, PublicUserProtected } from 'src/common/auth/decorators/auth.decorators';
// import { IAuthenticatedUser } from 'src/common/interfaces/authenticated.user.interface';
// import { PaymentService } from '../services/payment.service';
// import { PaymentCreateDto } from '../dtos/payment.create.dto';
// import { PaymentUpdateDto } from '../dtos/payment.update.dto';
// import { PaymentEntity } from '../entities/payment.entity';
// import { PaymentSerialization } from '../serializations/payment.serialization';
// import { DataSource } from 'typeorm';

// @SerializeOptions({
//   groups: PUBLIC_USER_ONLY_GROUP,
// })
// @ApiTags('Payments - Public User')
// @Controller('payment')
// export class PaymentPublicUserController {
//   constructor(
//     private readonly _paymentService: PaymentService,
//     private readonly dataSource: DataSource,
//   ) {}
// @ApiDocs({
//   operation: 'Create Payment',
//   serialization: PaymentSerialization,
// })
// @PublicUserProtected()
// @ResponseMessage('Payment created successfully.')
// @Post('/create')
// @HttpCode(HttpStatus.CREATED)
// async createPayment(
//   @Request() req: { user: IAuthenticatedUser },
//   @Body() createPaymentDto: PaymentCreateDto,
// ): Promise<IResponse<{ payment: PaymentEntity; url: string }>> {
//   const queryRunner = this.dataSource.createQueryRunner();
//   await queryRunner.startTransaction();

//   try {
//     const result = await this._paymentService.createAndInitiatePayment(
//       createPaymentDto,
//       req.user.id.toString(),  
//       queryRunner.manager,
//     );

//     await queryRunner.commitTransaction();
//     return { data: result };
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     throw error;
//   } finally {
//     await queryRunner.release();
//   }
// }


//   @ApiDocs({
//     operation: 'Get Payment by ID',
//     serialization: PaymentSerialization,
//     params: [
//       {
//         type: 'number',
//         required: true,
//         name: 'id',
//       },
//     ],
//   })
//   @PublicUserProtected()
//   @RequestParamGuard(IdParamDto)
//   @ResponseMessage('Payment retrieved successfully.')
//   @Get(':id')
//   async getById(@Param('id') id: number): Promise<IResponse<PaymentEntity>> {
//     const data = await this._paymentService.getById(id);
//     if (!data) {
//       throw new NotFoundException('Payment not found');
//     }
//     return { data };
//   }

//   @ApiDocs({
//     operation: 'Process Payment',
//     jwtAccessToken: true,
//   })
//   @PublicUserProtected()
//   @Post('/process')
//   async processPayment(
//     @Body() paymentData: { orderId: number; amount: number; currency: string },
//     @GetUser() __user: IAuthenticatedUser,
//   ): Promise<IResponse<any>> {
//     const data = true //await this._paymentService.processPayment({
//     //   userId: __user.id,
//     //   userEmail: __user.email,
//     //   userType: __user.userType,
//     //   pendingAmount: paymentData.amount,
//     //   currency: paymentData.currency,
//     //   orderId: paymentData.orderId,
//     // });

//     return { data };
//   }

//   @ApiDocs({
//     operation: 'Payment Success',
//     jwtAccessToken: true,
//   })
//   @PublicUserProtected()
//   @Get('/success')
//   async getSuccess(@GetUser() __user: IAuthenticatedUser): Promise<IResponse<any>> {
//     return { 
//       data: { 
//         message: 'Payment successful', 
//         userId: __user.id 
//       } 
//     };
//   }
// }
