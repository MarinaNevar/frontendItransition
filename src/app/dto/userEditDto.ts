import {Theme, Language} from '../model';

export class UserEditDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  theme: Theme;
  language: Language;
  deleted: boolean;
}
