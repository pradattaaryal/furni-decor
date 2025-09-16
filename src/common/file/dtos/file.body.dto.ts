import { ApiProperty } from '@nestjs/swagger';
import { IFile } from '../interfaces/file.interface';

export class FileBodyDto {
  @ApiProperty({
    type: 'number',
    example: '1',
  })
  id: number;
  @ApiProperty({
    type: 'string',
    example: 'Test bucket',
  })
  bucket: string;
  @ApiProperty({
    type: 'string',
    example: 'agent or org',
  })
  module: string;
}

export class CompleteBody extends FileBodyDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: IFile;
}
