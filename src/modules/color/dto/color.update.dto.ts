import { PartialType } from '@nestjs/swagger';
import { ColorCreateDto } from './color.create.dto';
import { IColorUpdateDto } from '../interfaces/color.update.dto.interface';

export class ColorUpdateDto
  extends PartialType(ColorCreateDto)
  implements IColorUpdateDto {}
