import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Lang, LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
})
export class CreatePage implements OnInit {
  constructor(public lang: LanguageService) {}

  ngOnInit() {}

  onLangChange(v: string) {
    this.lang.set(v as Lang);
  }
}
