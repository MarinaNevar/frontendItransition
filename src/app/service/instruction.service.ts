import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CommentAddDto, LikeDto, RatingSetDto, InstructionInfoDto, CommentShowDto} from '../dto';

@Injectable()
export class InstructionService {
  instruction: InstructionInfoDto = new InstructionInfoDto();


  constructor(private http: HttpClient) {}

  addInstruction(instruction: InstructionInfoDto) {
    return this.http.post(`${environment.serverUrl}instructions/addInstr`, instruction);
  }

  getInstructions() {
    return this.http.get<InstructionInfoDto[]>(`${environment.serverUrl}instructions/getAll`);
  }

  getInstructionsByIdUser(idUser: number) {
    return this.http.get<InstructionInfoDto[]>(`${environment.serverUrl}instructions/getedit` + idUser);
  }

  editInstruction(instruction: InstructionInfoDto) {
    return this.http.post(`${environment.serverUrl}instructions/edit`, instruction);
  }

  getInstructionById(id: number) {
    return this.http.get<InstructionInfoDto>(`${environment.serverUrl}instructions/` + id);
  }

  getInstructionsByUsername(username: string) {
    return this.http.get<InstructionInfoDto[]>(`${environment.serverUrl}instructions/allInstructions/` + username);
  }

  addImageToInstruction(image: FormData) {
    return this.http.post<string>(`${environment.serverUrl}instructions/addImageToInstruction`, image);//, {responseType: 'text'}
  }

  deleteInstruction(id: number) {
    return this.http.delete(`${environment.serverUrl}instructions/deleteInstruction/` + id);
  }

  addComment(commentAddDto: CommentAddDto) {
    return this.http.post(`${environment.serverUrl}instructions/addComment`, commentAddDto);
  }

  showComments(idInstruction: number) {
    return this.http.get<CommentShowDto[]>(`${environment.serverUrl}instructions/comments/` + idInstruction);
  }

  sortByName(instructions: InstructionInfoDto[], sortType: number): InstructionInfoDto[] {
    return instructions.sort(function (a: InstructionInfoDto, c: InstructionInfoDto): number  {
      return sortType * (a.name > c.name ? 1 : -1);
    });
  }

  sortByDate(instructions: InstructionInfoDto[], sortType: number): InstructionInfoDto[] {
    return instructions.sort(function (a: InstructionInfoDto, c: InstructionInfoDto): number  {
      return sortType * (a.publishDate.toLowerCase() > c.publishDate.toLowerCase() ? 1 : -1);
    });
  }

  searchByFragment(instructions: InstructionInfoDto[], fragment: string): InstructionInfoDto[] {
    const ans: InstructionInfoDto[] = [];
    instructions.forEach(function (instruction: InstructionInfoDto) {
      if (instruction.name.toLowerCase().includes(fragment.toLowerCase())
        || instruction.description.toLowerCase().includes(fragment.toLowerCase())) {
        ans.push(instruction);
      }
    });
    return ans;
  }

  addLike(likeDto: LikeDto) {
    return this.http.post(`${environment.serverUrl}instructions/addLike`, likeDto);
  }

  sortComments(commentsShowDto: CommentShowDto[]) {
    return commentsShowDto.sort(function (a: CommentShowDto, c: CommentShowDto): number {
      return (a.publish_date > c.publish_date ? 1 : -1);
    });
  }

  setRatingPost(ratingSetDto: RatingSetDto) {
    return this.http.post<number>(`${environment.serverUrl}instructions/setRating`, ratingSetDto);
  }

  getInstructionRating(idInstruction: number) {
    return this.http.get<number>(`${environment.serverUrl}instructions/getRating/` + idInstruction);
  }
}
