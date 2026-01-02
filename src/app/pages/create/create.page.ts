import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ModalController } from '@ionic/angular';
import {
  KindleGroup,
  KindleModel,
  KindleModelPickerComponent,
} from '../../components/kindle-model-picker/kindle-model-picker.component';

import { chevronDown } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HttpClientModule,

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonIcon,
  ],
  providers: [ModalController],
})
export class CreatePage implements OnInit {
  constructor(private http: HttpClient, private modalCtrl: ModalController) {
    addIcons({ chevronDown });
  }

  groups: KindleGroup[] = [];
  selectedModel?: KindleModel;

  async ngOnInit() {
    this.groups = await firstValueFrom(
      this.http.get<KindleGroup[]>('assets/data/kindle-model-groups.json')
    );

    this.selectedModel =
      this.findModelById('paperwhite_2021') ?? this.groups?.[0]?.items?.[0];
  }

  async openModelPicker() {
    const modal = await this.modalCtrl.create({
      component: KindleModelPickerComponent,
      componentProps: {
        groups: this.groups,
        selectedId: this.selectedModel?.id,
      },
      cssClass: 'kindle-modal',
      handle: true,
    });

    await modal.present();

    const res = await modal.onWillDismiss<KindleModel>();
    if (res.role === 'selected' && res.data) {
      this.selectedModel = res.data;
      // aquí después conectamos el cropper
      console.log('Modelo:', this.selectedModel);
    }
  }

  private findModelById(id: string): KindleModel | undefined {
    for (const g of this.groups) {
      const hit = g.items.find((m) => m.id === id);
      if (hit) return hit;
    }
    return undefined;
  }
}
