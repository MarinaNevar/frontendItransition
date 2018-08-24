import {Category, Step} from '../model';

export class NewsInfoDto {
  id: number;
  name: string;
  description: string;
  text: string;
  publishDate: string;
  id_user: number;
  userImage: string;
  authorName: string;
  value_rating: number;
  tags: Step[];
  categories: Category[];

  constructor() {
    this.id = null;
    this.name = '';
    this.description = '';
    this.text = '';
    this.publishDate = '';
    this.id_user = null;
    this.userImage = '';
    this.authorName = '';
    this.value_rating = null;
    this.tags = [];
    this.categories = [];
  }
}
