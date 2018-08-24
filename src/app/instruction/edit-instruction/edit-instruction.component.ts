import {Component, OnInit, OnDestroy} from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {ErrorService, InfoService, InstructionService} from '../../service';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InstructionInfoDto} from '../../dto';
import {SectionService} from '../../service';
import {Category, Step} from '../../model/';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-instruction.component.html',
  styleUrls: ['./edit-instruction.component.css']
})
export class EditInstructionComponent implements OnInit, OnDestroy {

  newStep: Step;

  numberSteps = 1;
  instruction = new InstructionInfoDto();
  new = true;
  Title: FormControl;
  Description: FormControl;
  private steps: Step[] = [];
  categories: {
    id: number;
    name: string;
    isActive: boolean;
  }[] = [];
  isFirstTimeOpen = true;
  stepForm: FormGroup;
  viewMode = 'editTab';
  public uploader: FileUploader = new FileUploader({});
  public hasAnotherDropZoneOver = false;
  private uploadSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private instructionService: InstructionService,
              private sectionService: SectionService,
              private router: Router,
              private infoService: InfoService,
              private errorService: ErrorService) {
    this.stepForm = this.formBuilder.group({
      stepName: [''],
      stepText: ['']
    });
    this.sectionService.getCategories().pipe(first()).subscribe((categories: Category[]) => {
      for (const category of categories) {
        this.categories.push({id: category.id, name: category.name, isActive: false});
      }
    });
    this.sectionService.getSteps().pipe(first()).subscribe((steps: Step[]) => {
      this.steps = steps;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        this.instruction.id_user = params['authorId'];
        if (params.hasOwnProperty('id')) {
          const id = params['id'];
          this.new = false;
          this.instructionService.getInstructionById(id).pipe(first()).subscribe((snapshot: InstructionInfoDto) => {
              this.instruction = snapshot;
            },
            () => {
              this.router.navigate(['/exception404']);
            });
        }
      });
    this.Title = new FormControl(this.instruction.name, [Validators.required,
      Validators.minLength(4), Validators.maxLength(30)]);
    this.Description = new FormControl(this.instruction.description, [Validators.required,
      Validators.minLength(4), Validators.maxLength(100)]);
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  imageUpload(files: string) {
    for (const file of files) {
      const formdata: FormData = new FormData();
      formdata.append('file', file);
      this.uploadSubscription = this.instructionService.addImageToInstruction(formdata).pipe(first()).subscribe((data) => {
        this.pasteImageInMarkdown(data);
      });
    }
  }

  pasteImageInMarkdown(url: string) {
    if (this.instruction === undefined) {
      this.instruction.steps = null;
    }
    for(const step of this.instruction.steps){
      step.text += ' <img class="img-fluid" src="' + url + '" style="max-width: 500px; max-heigth: 900px;">';
    }

  }

   addStep() {
     this.newStep = new Step();
     this.newStep.name = this.stepForm.controls.stepName.value;
     this.newStep.text = this.stepForm.controls.stepText.value;
     this.newStep.name = this.newStep.name.trim();
     this.newStep.text = this.newStep.text.trim();
     const existedStep = this.instruction.steps.filter(obj => {
       return obj['name'] === this.newStep.name;
     });
     if ((this.newStep.name.length !== 0) && (this.newStep.name.length < 24) && (this.newStep.text.length !== 0) && (existedStep.length === 0)) {
       this.instruction.steps.push(this.newStep);
     }
   }

   removeStep(step: string) {
     const removableTag = this.instruction.steps.filter(obj => {
       return obj['name'] === step;
     });
     if (removableTag.length !== 0) {
       const index = this.instruction.steps.indexOf(removableTag[0], 0);
       this.instruction.steps.splice(index, 1);
     }
   }

  pasteChecked() {
    if (this.isFirstTimeOpen) {
      for (const category of this.categories) {
        const activeCategory = this.instruction.categories.filter(obj => {
          return obj['name'] === category.name;
        });
        if (activeCategory.length !== 0 ) {
          this.categories[category.id - 1].isActive = true;
        }
      }
      this.isFirstTimeOpen = false;
    }
  }

  onSubmit() {
    if (this.isInvalidForm()) {
      this.showError();
      return;
    }
    this.instruction.value_rating = 0;
    this.setInstructionCategories();
    this.instructionService.addInstruction(this.instruction).pipe(first())
      .subscribe(
        () => {
          this.router.navigate([`/`]);
        });
  }

  onSave() {
    if (this.isInvalidForm()) {
      this.showError();
      return;
    }
    this.setInstructionCategories();
    this.instructionService.editInstruction(this.instruction).pipe(first())
      .subscribe(
        () => {
          this.router.navigate([`/instruction/${this.instruction.id}`]);
        });
  }

  setInstructionCategories() {
    this.instruction.categories = [];
    for (const category of this.categories) {
      if (category.isActive) {
        this.instruction.categories.push({id: category.id, name: category.name});
      }
    }
  }

  disableHideDropdown($event) {
    $event.stopPropagation();
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  private isNullCategories(): boolean {
    this.pasteChecked();
    let answer = false;
    for (const category of this.categories) {
      answer = answer || category.isActive;
    }
    return !answer;
  }

  private isInvalidForm(): boolean {
    return this.isNullCategories() || this.isNullContent() || this.Title.invalid || this.Description.invalid;
  }

  private isNullContent(): boolean {
    return this.instruction.steps === null || this.instruction.steps === undefined;
  }

  private showError() {
    if (this.Title.invalid) {
      this.infoService.alertInformation(this.errorService.ERROR, this.errorService.INVALID_TITLE);
    }
    if (this.Description.invalid) {
      this.infoService.alertInformation(this.errorService.ERROR, this.errorService.INVALID_DESCRIPTION);
    }
    if (this.isNullCategories()) {
      this.infoService.alertInformation(this.errorService.ERROR, this.errorService.IS_NULL_CATEGORIES);
    }
    if (this.isNullContent()) {
      this.infoService.alertInformation(this.errorService.ERROR, this.errorService.IS_NULL_CONTENT);
    }
  }

  ngOnDestroy(): void {
    this.uploadSubscription && this.uploadSubscription.unsubscribe();
  }
}
