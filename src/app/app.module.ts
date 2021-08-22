import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElaboratorLobbyComponent } from './component/elaborator-lobby/elaborator-lobby.container';
import { ElaboratorReviewLobbyComponent } from './component/elaborator-review/elaborator-review.container';
import { ElaboratorQuestionComponent } from './component/elaborator-question/elaborator-question.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import {
  ElaboratorEffect,
  ElaboratorState,
  elaboratorReducer,
  ReviewState,
  reviewReducer,
  ReviewEffect,
} from './state';
import { EffectsModule } from '@ngrx/effects';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LobbyComponent } from './component/lobby/lobby.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './component/notification/notification.component';
import { OneTimeCodeInterceptor } from './service/one-time-code.interceptor';
import { CountdownClockComponent } from './component/elaborator-question/countdown-clock/countdown-clock.component';
import { ContactFooterComponent } from './component/contact-footer/contact-footer.component';
import { DemoComponent } from './component/elaborator-lobby/demo/demo.component';

export interface AppState {
  elaborator: ElaboratorState;
  review: ReviewState;
}

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: OneTimeCodeInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    ElaboratorLobbyComponent,
    ElaboratorQuestionComponent,
    ElaboratorReviewLobbyComponent,
    LobbyComponent,
    NotificationComponent,
    CountdownClockComponent,
    ContactFooterComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    StoreModule.forRoot({
      elaborator: elaboratorReducer,
      review: reviewReducer,
    }),
    EffectsModule.forRoot([ElaboratorEffect, ReviewEffect]),
  ],
  providers: [...httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
