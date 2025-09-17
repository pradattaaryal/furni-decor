import { ImageEntity } from 'src/modules/image/entities/image.entity';

export interface IPrepareUserCreateData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  image?: ImageEntity | null;
}
