import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';

export type Lang = 'es-MX' | 'en-US';
const SUPPORTED: Lang[] = ['es-MX', 'en-US'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  lang: Lang = 'es-MX';

  constructor(private t: TranslateService) {}

  async init(): Promise<Lang> {
    void this.t.setDefaultLang('es-MX');

    const saved = this.getSaved();
    const system = await this.getSystemLang();

    const finalLang = saved ?? system ?? 'es-MX';
    this.set(finalLang);
    return finalLang;
  }

  set(lang: Lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    this.t.use(lang);
  }

  get supported() {
    return [
      { code: 'es-MX' as const, label: 'Español (MX)' },
      { code: 'en-US' as const, label: 'English (US)' },
    ];
  }

  private getSaved(): Lang | null {
    const v = localStorage.getItem('lang');
    return SUPPORTED.includes(v as Lang) ? (v as Lang) : null;
  }

  private async getSystemLang(): Promise<Lang | null> {
    try {
      const info = await Device.getLanguageCode();
      const code = (info?.value || '').toLowerCase();
      const mapped = this.mapToSupported(code);
      if (mapped) return mapped;
    } catch {
    }

    const nav = (navigator.language || '').toLowerCase();
    return this.mapToSupported(nav);
  }

  private mapToSupported(code: string): Lang | null {
    if (!code) return null;

    if (code.startsWith('es')) return 'es-MX';
    if (code.startsWith('en')) return 'en-US';

    return null;
  }
}
