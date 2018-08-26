import {Component, OnInit, OnDestroy} from '@angular/core';
import { first } from 'rxjs/operators';
import {InstructionService} from '../service';
import {ActivatedRoute} from '@angular/router';
import {InstructionInfoDto} from '../dto';
import {Step, Category} from '../model';
import {Subscription} from 'rxjs';
import {SectionService} from '../service';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit, OnDestroy {
  instructions: InstructionInfoDto[] = [];
  viewInstructions: InstructionInfoDto[] = [];
  rangeValues: number[] = [0, 5];
  searchedInstructions: InstructionInfoDto[] = [];
  steps: Step[] = [];
  categories: Category[] = [];
  filterSteps: Step[] = [];
  filterCategories: Category[] = [];
  instructionsSubscription: Subscription;
  routeSubscription: Subscription;
  stepSubscription: Subscription;
  categoriesSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private sectionService: SectionService,
              private instructionService: InstructionService) {
  }

  ngOnInit() {
    this.instructionsSubscription = this.instructionService.getInstructions().pipe(first()).subscribe(instructions => {
      this.instructions = this.instructionService.sortByDate(instructions, -1);
      this.viewInstructions = this.instructions;
      this.viewSearchInstructions();
      this.loadAllSteps();
      this.loadAllCategories();
    });
  }

   loadAllSteps() {
     this.instructionsSubscription = this.sectionService.getSteps().pipe(first()).subscribe((steps: Step[]) => {
       this.steps = steps;
     });
   }

  loadAllCategories() {
    this.categoriesSubscription = this.sectionService.getCategories().pipe(first()).subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  filterInstructionsRate() {
    return this.instructions.filter((obj) => {
      return (obj.value_rating >= this.rangeValues[0]) && (obj.value_rating <= this.rangeValues[1]);
    });
  }

   viewSearchInstructions() {
     this.routeSubscription = this.activatedRoute.queryParams
       .subscribe(params => {
         this.searchedInstructions = [];
         const searchText = params['search'];
         if ((searchText === undefined) || (searchText === '')) {
           this.searchedInstructions = null;
           this.filterInstructions();
           return;
         }
         const re  = new RegExp(searchText, 'gi');
         for (const instructionInfo of this.instructions) {
           if ((instructionInfo.name.search(re) !== -1) || (instructionInfo.description.search(re) !== -1) ||
             (instructionInfo.authorName.search(re) !== -1)) {
             this.searchedInstructions.push(instructionInfo);
           }
           for (const step of instructionInfo.steps)
             if ((step.name.search(re) !== -1) || (step.text.search(re) !== -1)) {
               this.searchedInstructions.push(instructionInfo);
             }
         }
         this.filterInstructions();

       });
   }

   filterInstructions() {
     const rateSuitable = this.filterInstructionsRate();
     const categoriesSuitable = this.filterInstructionsByCategories();
     this.viewInstructions = rateSuitable.filter(o => categoriesSuitable.some((item) => o === item));
     if (this.searchedInstructions !== null)
       this.viewInstructions = this.viewInstructions.filter(o => this.searchedInstructions.some((item) => o === item));
   }

  filterInstructionsByCategories(): InstructionInfoDto[] {
    const suitableArray = [];
    for (const instruction of this.instructions) {
      const isSuitable = this.filterCategories.every((filter) =>
        instruction.categories.some(({id, name}) => filter.id === id && filter.name === name));
      if (isSuitable) {
        suitableArray.push(instruction);
      }
    }
    return suitableArray;
  }

   pasteFilterCategory(category: Category) {
     const index = this.filterCategories.indexOf(category, 0);
     if (index === -1) {
       this.filterCategories.push(category);
     }
     this.filterInstructions();
   }

   removeFilterCategory(category: Category) {
     const index = this.filterCategories.indexOf(category, 0);
     if (index > -1) {
       this.filterCategories.splice(index, 1);
     }
     this.filterInstructions();
   }

  ngOnDestroy() {
    this.instructionsSubscription && this.instructionsSubscription.unsubscribe();
    this.routeSubscription && this.routeSubscription.unsubscribe();
    this.stepSubscription && this.stepSubscription.unsubscribe();
    this.categoriesSubscription && this.categoriesSubscription.unsubscribe();
  }
}
