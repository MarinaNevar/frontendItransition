import {Component, Input, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, InstructionService} from '../../service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {InstructionInfoDto} from '../../dto';
import * as jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
@Component({
  selector: 'app-view-instruction',
  templateUrl: './view-instruction.component.html',
  styleUrls: ['./view-instruction.component.css']
})
export class ViewInstructionComponent implements OnInit {
  @Input() instruction: InstructionInfoDto;
  commentForm: FormGroup;
  numberStep = 0;
  new = true;
  id: number;
  constructor(private route: ActivatedRoute,
              private instructionService: InstructionService,
              private formBuilder: FormBuilder,
              private router: Router,
              public authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.instruction === undefined) {
      this.route.params.subscribe(
        (params: any) => {
          if (params.hasOwnProperty('id')) {
            this.id = params['id'];
            this.new = false;
            this.instructionService.getInstructionById(this.id).pipe(first()).subscribe((data: InstructionInfoDto) => {
              this.id = data.id;
            },
              () => {
              this.router.navigate(['/exception404']);
              });
          }
        });
    }
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  deleteInstruction(id: number) {
    this.instructionService.deleteInstruction(id).pipe(first())
      .subscribe(
        () => {
          this.router.navigate([`/`]);
        });
  }

  getCurrentUsername(): string {
    return this.authenticationService.getCurrentUsername();
  }

  // downloadPdf() {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data).then(canvas => {
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     var options = { pagesplit: true,'background': '#fff' };
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }
  //     pdf.save(this.post.name.concat(".pdf")); // Generated PDF
  //   });
  // }

  showEdit(): boolean {
    return (!this.new && this.authenticationService.isLogin() ?
      ((this.authenticationService.getCurrentUsername() === this.instruction.authorName || this.authenticationService.isAdmin())) : false);
  }

  showAddComment(): boolean {
    return this.authenticationService.isLogin() && !this.new;
  }

  showComments(): boolean {
    return !this.new;
  }

  showRating(): boolean {
    return !this.new;
  }

  canSetRating(): boolean {
    return !this.authenticationService.isLogin();
  }

  leftrightStep(num: number) {
    this.numberStep += num;
  }

  correctLeftStep(): boolean {

    return this.numberStep - 1 < 0 ? true : false;
  }

  correctRightStep(): boolean {
    return this.numberStep + 1 > this.instruction.steps.length - 1 ? true : false;
  }

}
