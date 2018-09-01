import {Category, Step} from "../model";

export class InstructionPresent {
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
}
