import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/database/base/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository extends BaseRepository<PaymentEntity> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly _paymentRepo: Repository<PaymentEntity>,
  ) {
    super(_paymentRepo);
  }
}
