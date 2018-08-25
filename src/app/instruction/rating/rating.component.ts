import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {InstructionService} from '../../service';
import {ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';
import {RatingSetDto} from '../../dto';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input() username: string;
  @Input() read: boolean;
  @Input() idInstruction: number;
  currentRating: number;
  changeRatingControl = 2;
  ratingControl = new FormControl();
  constructor(private instructionService: InstructionService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.idInstruction = params['id'];
          this.instructionService.getInstructionRating(this.idInstruction).pipe(first())
            .subscribe(
              (data) => {
                this.currentRating = data;
              });
        }
      });
    if (this.idInstruction !== null) {
      this.instructionService.getInstructionRating(this.idInstruction).pipe(first())
        .subscribe(
          data => {
            this.currentRating = data;
          });
    }
  }

  setRating() {
    if (this.changeRatingControl === 0) {
      this.instructionService.setRatingPost(new RatingSetDto(this.idInstruction, this.username, this.ratingControl.value)).pipe(first())
        .subscribe(
          (currentRating) => {
            this.currentRating = currentRating;
          });
    } else {
      --this.changeRatingControl;
    }
  }
}
