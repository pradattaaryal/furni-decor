// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
// import { Repository } from 'typeorm';
// import { PaymentEntity } from '../entities/payment.entity';
  
// @Injectable()
// export class PaymentRepository extends BaseRepository<PaymentEntity> {
//   constructor(
//     @InjectRepository(PaymentEntity)
//     private readonly _paymentRepo: Repository<PaymentEntity>,
//   ) {
//     super(_paymentRepo);
//   } 
  
  
//   getRepo(): Repository<PaymentEntity> {
//     return this._paymentRepo;
//   }
// }
