import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { I18nService, translateOptions } from './i18n.service';

@Injectable({ scope: Scope.REQUEST })
export class I18nRequestScopeService {
  constructor(
    @Inject(REQUEST) private readonly req,
    private readonly i18nService: I18nService,
  ) {}

  public translate(key: string, options?: translateOptions) {
    options = {
      lang: this.req.i18nLang,
      ...options,
    };
    return this.i18nService.translate(key, options);
  }

  public t(key: string, options?: translateOptions) {
    return this.translate(key, options);
  }
}
