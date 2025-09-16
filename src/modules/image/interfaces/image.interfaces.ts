import { FILE_ASSOCIATION_TYPE } from "../constants/association-type.enum";

export interface IImageInterface {
  path?: string;
  filename?: string;
  mime?: string;
  size?: number;
  type?: string | null;
}
