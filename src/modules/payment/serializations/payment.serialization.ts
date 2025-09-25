// import { ApiProperty } from '@nestjs/swagger';
// import {
//   ResponseDefaultSerialization,
//   ResponsePaginationDefaultSerialization,
// } from 'src/common/doc/serializations/response.default.serialization';
// import { PaymentEntity } from '../entities/payment.entity';

// export class PaymentSerialization extends ResponseDefaultSerialization {
//   @ApiProperty({
//     type: PaymentEntity,
//   })
//   data: PaymentEntity;
// }

// export class PaymentPaginationSerialization extends ResponsePaginationDefaultSerialization {
//   @ApiProperty({
//     type: [PaymentEntity],
//   })
//   data: PaymentEntity[];
// } 