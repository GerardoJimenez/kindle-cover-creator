import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
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

import {
  chevronDown,
  imageOutline,
  alertCircleOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

type ImageValidationError = 'TYPE' | 'SIZE' | 'DIMENSIONS' | 'CORRUPT';

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
    IonButton,
  ],
  providers: [ModalController],
})
export class CreatePage implements OnInit, OnDestroy {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private modalCtrl: ModalController) {
    addIcons({
      chevronDown,
      imageOutline,
      alertCircleOutline,
      checkmarkCircle,
    });
  }

  groups: KindleGroup[] = [];
  selectedModel?: KindleModel;

  selectedImageFile?: File;
  selectedImageName?: string;
  selectedImageDims?: { width: number; height: number };

  previewUrl?: string;

  imageErrorKey?: string;
  imageErrorParams: Record<string, any> = {};

  private readonly allowedMime = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);
  private readonly maxBytes = 20 * 1024 * 1024;
  private readonly maxSizeMb = 20;

  async ngOnInit() {
    this.groups = await firstValueFrom(
      this.http.get<KindleGroup[]>('assets/data/kindle-model-groups.json')
    );

    this.selectedModel =
      this.findModelById('paperwhite_2021') ?? this.groups?.[0]?.items?.[0];
  }

  ngOnDestroy() {
    this.revokePreviewUrl();
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
      if (this.selectedImageFile) {
        await this.revalidateCurrentImage();
      }
    }
  }

  openImagePicker() {
    this.imageInput.nativeElement.click();
  }

  async onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!this.allowedMime.has(file.type)) {
      this.resetSelectedImage();
      this.setImageError('TYPE', file);
      return;
    }

    if (file.size <= 0 || file.size > this.maxBytes) {
      this.resetSelectedImage();
      this.setImageError('SIZE', file);
      return;
    }

    const dims = await this.getImageDimensions(file);
    if (!dims) {
      this.resetSelectedImage();
      this.setImageError('CORRUPT', file);
      return;
    }

    const err = await this.validateImageWithDims(file, dims);
    if (err) {
      this.resetSelectedImage();
      this.setImageError(err, file);
      return;
    }

    this.clearImageError();
    this.selectedImageFile = file;
    this.selectedImageName = file.name;
    this.selectedImageDims = dims;

    this.revokePreviewUrl();
    this.previewUrl = URL.createObjectURL(file);
  }

  canCrop(): boolean {
    return (
      !!this.selectedModel && !!this.selectedImageFile && !this.imageErrorKey
    );
  }

  startCrop() {
    if (!this.canCrop()) return;
    console.log('Crop start', {
      model: this.selectedModel,
      file: this.selectedImageFile,
      dims: this.selectedImageDims,
    });
  }

  private resetSelectedImage() {
    this.selectedImageFile = undefined;
    this.selectedImageName = undefined;
    this.selectedImageDims = undefined;
    this.revokePreviewUrl();
  }

  private revokePreviewUrl() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = undefined;
    }
  }

  private clearImageError() {
    this.imageErrorKey = undefined;
    this.imageErrorParams = {};
  }

  private setImageError(err: ImageValidationError, file: File) {
    const ext = (file.name.split('.').pop() ?? '').toUpperCase();
    const type = file.type || ext || 'file';

    this.imageErrorKey =
      err === 'TYPE'
        ? 'CREATE.IMAGE_ERROR_TYPE'
        : err === 'SIZE'
        ? 'CREATE.IMAGE_ERROR_SIZE'
        : err === 'DIMENSIONS'
        ? 'CREATE.IMAGE_ERROR_DIMENSIONS'
        : 'CREATE.IMAGE_ERROR_CORRUPT';

    this.imageErrorParams =
      err === 'TYPE'
        ? { type }
        : err === 'SIZE'
        ? { maxSize: this.maxSizeMb }
        : {};
  }

  private async revalidateCurrentImage() {
    const file = this.selectedImageFile;
    const dims = this.selectedImageDims;
    if (!file || !dims) return;

    const err = await this.validateImageWithDims(file, dims);
    if (err) {
      this.resetSelectedImage();
      this.setImageError(err, file);
      return;
    }

    this.clearImageError();
  }

  private async validateImageWithDims(
    file: File,
    dims: { width: number; height: number }
  ): Promise<ImageValidationError | null> {
    if (!this.allowedMime.has(file.type)) return 'TYPE';
    if (file.size <= 0 || file.size > this.maxBytes) return 'SIZE';

    const m = this.selectedModel;
    if (!m) return null;

    const minW = Math.min(m.width, m.height);
    const minH = Math.max(m.width, m.height);

    const w = Math.min(dims.width, dims.height);
    const h = Math.max(dims.width, dims.height);

    if (w < minW || h < minH) return 'DIMENSIONS';
    return null;
  }

  private getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        URL.revokeObjectURL(url);
        resolve(width && height ? { width, height } : null);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    });
  }

  private findModelById(id: string): KindleModel | undefined {
    for (const g of this.groups) {
      const hit = g.items.find((m) => m.id === id);
      if (hit) return hit;
    }
    return undefined;
  }
}
