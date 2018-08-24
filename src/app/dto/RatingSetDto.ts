export class RatingSetDto {
  idInstruction: number;
  username: string;
  rating: number;

  constructor(idInstruction: number,
              username: string,
              rating: number) {
    this.idInstruction = idInstruction;
    this.username = username;
    this.rating = rating;
  }
}
