import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { Lang, LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonLabel,
    IonHeader,
    TranslateModule,
    IonSelect,
    IonSelectOption,
  ],
})
export class SettingsPage {
  constructor(public lang: LanguageService) {}

  onLangChange(v: string) {
    this.lang.set(v as Lang);
  }
}
