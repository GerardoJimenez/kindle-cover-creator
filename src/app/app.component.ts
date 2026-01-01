import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { ConsentService } from './services/consent.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private lang: LanguageService,
    private t: TranslateService,
    private title: Title,
    private consent: ConsentService
  ) {
    void this.init();
  }

  private async init() {
    await this.lang.init();
    await this.consent.gatherConsent();
    this.setDocumentTitle();

    this.t.onLangChange.subscribe(() => this.setDocumentTitle());
  }

  private setDocumentTitle() {
    this.title.setTitle(this.t.instant('APP.TITLE'));
  }
}
