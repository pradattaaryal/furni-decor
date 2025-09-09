export interface ICategoryEntity {
  name: string;
  parent_id: number | null;
  parent?: ICategoryEntity | null;
  children?: ICategoryEntity[];
}
