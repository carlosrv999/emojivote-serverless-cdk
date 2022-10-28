import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmojiService } from './shared/emoji.service';
import { HttpClientModule } from '@angular/common/http';
import { VotingService } from './shared/voting.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule
  ],
  providers: [
    EmojiService,
    VotingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
