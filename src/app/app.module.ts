import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElaboratorLobbyComponent } from './component/elaborator-lobby/elaborator-lobby.component';
import { ElaboratorQuestionComponent } from './component/elaborator-question/elaborator-question.component';
import { MatRadioModule } from '@angular/material/radio';
import { StoreModule } from '@ngrx/store';
import { elaboratorReducer } from './state/elaborator.reducer';
import { ElaboratorEffect } from './state';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    ElaboratorLobbyComponent,
    ElaboratorQuestionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    StoreModule.forRoot({ elaborator: elaboratorReducer }),
    EffectsModule.forRoot([ElaboratorEffect]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
