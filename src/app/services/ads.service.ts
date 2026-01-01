import { Injectable } from '@angular/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';
import { ConsentService } from './consent.service';

@Injectable({ providedIn: 'root' })
export class AdsService {
  private initialized = false;

  constructor(private consent: ConsentService) {}

  async init(): Promise<void> {
    if (this.initialized) return;
    await AdMob.initialize();
    this.initialized = true;
  }

  async showBanner(adId: string): Promise<void> {
    await this.init();
    if (!this.consent.state.canRequestAds) return;

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: true, // PROD -> false + test ids correctos
    };

    await AdMob.showBanner(options);
  }

  async hideBanner(): Promise<void> {
    await AdMob.hideBanner();
  }

  async showInterstitial(adId: string): Promise<void> {
    await this.init();
    if (!this.consent.state.canRequestAds) return;

    await AdMob.prepareInterstitial({ adId, isTesting: true });
    await AdMob.showInterstitial();
  }
}
