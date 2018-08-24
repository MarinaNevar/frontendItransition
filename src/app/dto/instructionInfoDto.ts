import {Category, Step} from '../model';

export class InstructionInfoDto {
  id: number;
  name: string;
  description: string;
  publishDate: string;
  id_user: number;
  userImage: string;
  authorName: string;
  value_rating: number;
  steps: Step[];
  categories: Category[];

  constructor() {
    this.id = null;
    this.name = '';
    this.description = '';
    this.publishDate = '';
    this.id_user = null;
    this.userImage = '';
    this.authorName = '';
    this.value_rating = null;
    this.steps = [];
    this.categories = [];
  }
}
