import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import {AdminGuard, ReaderGuard, WriterGuard} from './auth/guards';
import { JwtInterceptor } from './auth/helpers';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';
import {
  InstructionService,
  UserService,
  ProfileService,
  SectionService,
  InfoService,
  AuthenticationService,
  RegularService,
  ErrorService
} from './service';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RestorePasswordComponent } from './auth/restore-password/restore-password.component';
import { RememberComponent } from './auth/remember/remember.component';
import { UsersListComponent } from './user/users-list/users-list.component';
import { ProfileNewsComponent } from './user/profile/profile-news/profile-news.component';
import { Exception404Component } from './exception/exception404/exception404.component';
import { ProfileInfoComponent } from './user/profile/profile-info/profile-info.component';
import {MarkdownModule} from 'ngx-markdown';
import { AceEditorModule } from 'ng2-ace-editor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {FileUploadModule} from 'ng2-file-upload';
import { EditInstructionComponent } from './instruction/edit-instruction/edit-instruction.component';
import { ViewInstructionComponent } from './instruction/view-instruction/view-instruction.component';
import { CommentComponent } from './instruction/comment/comment.component';
import { RatingComponent } from './instruction/rating/rating.component';
import {AccordionModule} from 'primeng/accordion';
import {SliderModule} from 'primeng/slider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HomeComponent} from './home/home.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        NgbModule.forRoot(),
        BrowserModule,
        AccordionModule,
        SliderModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        MDBBootstrapModule.forRoot(),
        MarkdownModule.forRoot({ loader: HttpClient }),
        AceEditorModule,
        FileUploadModule,
      CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'mycloudname'}),
        routing
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        HeaderComponent,
        FooterComponent,
        ProfileComponent,
        RestorePasswordComponent ,
        RememberComponent,
        UsersListComponent,
        ProfileNewsComponent,
        Exception404Component,
        ProfileInfoComponent,
        EditInstructionComponent,
        ViewInstructionComponent,
        CommentComponent,
        RatingComponent
    ],
  schemas: [NO_ERRORS_SCHEMA],
    providers: [
        AdminGuard,
        WriterGuard,
        ReaderGuard,
        AuthenticationService,
        InstructionService,
        ProfileService,
        SectionService,
        InfoService,
        RegularService,
        ErrorService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
