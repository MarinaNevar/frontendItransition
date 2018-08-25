import {Component, OnInit} from '@angular/core';
import {UserEditDto, InstructionInfoDto} from '../../../dto';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {InstructionService, ProfileService, UserService, AuthenticationService} from '../../../service';
import {first} from 'rxjs/internal/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile-news',
  templateUrl: 'profile-news.component.html',
  styleUrls: ['profile-news.component.css']
})
export class ProfileNewsComponent implements OnInit {
  profile = this.profileService;
  user: UserEditDto;
  instructions: InstructionInfoDto[] = [];
  searchForm: FormGroup;
  instructionsInSearch: InstructionInfoDto[] = [];
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  sortByNameType = 1;
  sortByDateType = 1;
  clickSortByName = false;
  clickSortByDate = false;
  username: string;

  constructor(private router: Router,
              private instructionService: InstructionService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private profileService: ProfileService,
              private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.username = params['username'];
      this.instructionService.getInstructionsByUsername(this.username).pipe(first()).subscribe((newsInfoDto: InstructionInfoDto[]) => {
        this.instructionsInSearch = this.instructions = this.instructionService.sortByDate(newsInfoDto, -1);
      });
    });
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required]
    });
  }

  public deletePost(id: number) {
    this.instructionService.deleteInstruction(id).pipe(first()).subscribe(
      () => {
        this.loadAllInstructions();
      });
  }

  private loadAllInstructions() {
    this.instructionService.getInstructionsByIdUser(this.profile.getUser().id).pipe(first()).subscribe(instructions => {
      this.instructions = this.instructionsInSearch = this.instructionService.sortByDate(instructions, -1);
    });
  }

  sortByTitle() {
    this.clickSortByName = true;
    this.clickSortByDate = false;
    this.instructionsInSearch = this.instructionService.sortByName(this.instructionsInSearch, this.sortByNameType);
    this.sortByNameType *= -1;
  }

  sortByDate() {
    this.clickSortByName = false;
    this.clickSortByDate = true;
    this.instructionsInSearch = this.instructionService.sortByDate(this.instructionsInSearch, this.sortByDateType);
    this.sortByDateType *= -1;
  }

  showImageSortByNameDown(): boolean {
    return this.clickSortByName && this.sortByNameType === 1;
  }

  showImageSortByNameUp(): boolean {
    return this.clickSortByName && this.sortByNameType === -1;
  }

  showImageSortByDateDown(): boolean {
    return this.clickSortByDate && this.sortByDateType === 1;
  }

  showImageSortByDateUp(): boolean {
    return this.clickSortByDate && this.sortByDateType === -1;
  }

  search() {
    this.instructionsInSearch = this.instructionService.searchByFragment(this.instructions, this.searchForm.controls.search.value);
  }

  isCanAddInstructions(): boolean {
    return this.authenticationService.isCanAddNews(this.username) && (this.profile.role !== 'Reader');
  }
}
