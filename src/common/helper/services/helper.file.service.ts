import { Injectable } from '@nestjs/common';
import bytes from 'bytes';

import { readFileSync, writeFileSync } from 'fs';
import { FILE_ASSOCIATION_TYPE } from 'src/modules/image/constants/association-type.enum';
import { UPLOAD_FOLDER_ENUM } from 'src/modules/image/constants/upload.folder.enum.list';
import { read, utils } from 'xlsx';
import {
  IHelperFileReadExcelOptions,
  IHelperFileRows,
} from '../interfaces/helper.interface';

@Injectable()
export class HelperFileService {
  readExcelFromBuffer(
    file: Buffer,
    options?: IHelperFileReadExcelOptions,
  ): IHelperFileRows[][] {
    // workbook
    const workbook = read(file, {
      type: 'buffer',
      password: options?.password,
      sheets: options?.sheet,
    });

    // worksheet
    const worksheetsName: string[] = workbook.SheetNames;
    const sheets: IHelperFileRows[][] = [];
    for (const worksheetName of worksheetsName) {
      const worksheet = workbook.Sheets[worksheetName];

      // rows
      const rows: IHelperFileRows[] = utils.sheet_to_json(worksheet);
      sheets.push(rows);
    }

    return sheets;
  }

  convertToBytes(megabytes: string): number {
    return bytes(megabytes);
  }

  createJson(path: string, data: Record<string, any>[]): boolean {
    const sData = JSON.stringify(data);
    writeFileSync(path, sData);

    return true;
  }
  readJson(path: string): Record<string, any>[] {
    const data: string = readFileSync(path, 'utf8');
    return JSON.parse(data);
  }

  isPhotoAssociatedWith(
    filePath: string,
    checkEnum: UPLOAD_FOLDER_ENUM | FILE_ASSOCIATION_TYPE,
  ): boolean {
    if (filePath.includes(checkEnum.toLowerCase())) {
      return true;
    }
    return false;
  }
}
