import { Injectable } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';

export type ConsentResult = {
  canRequestAds: boolean;
  privacyOptionsRequired: boolean;
};

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private canRequestAds = false;
  private privacyOptionsRequired = false;

  get state(): ConsentResult {
    return {
      canRequestAds: this.canRequestAds,
      privacyOptionsRequired: this.privacyOptionsRequired,
    };
  }

  /**
   * Call on every app launch BEFORE showing ads.
   * Uses AdMob plugin UMP integration.
   */
  async gatherConsent(): Promise<ConsentResult> {
    // 1) Ask consent info
    const info = await AdMob.requestConsentInfo({
    });

    if (info.isConsentFormAvailable && info.status === 'REQUIRED') {
      const after = await AdMob.showConsentForm();
      this.canRequestAds = after.status !== 'REQUIRED';
      this.privacyOptionsRequired =
        after.privacyOptionsRequirementStatus === 'REQUIRED';
      return this.state;
    }

    this.canRequestAds = info.status !== 'REQUIRED';
    this.privacyOptionsRequired =
      info.privacyOptionsRequirementStatus === 'REQUIRED';

    return this.state;
  }

  async showPrivacyOptionsIfAvailable(): Promise<void> {
    await AdMob.showPrivacyOptionsForm();
  }
}
