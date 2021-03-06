import { Logger } from '@nestjs/common';
import { I18nOptions } from '..';
import { I18nTranslation } from '../interfaces/i18n-translation.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { I18nParser } from '../parsers/i18n.parser';
export declare type translateOptions = {
    lang?: string;
    args?: ({
        [k: string]: any;
    } | string)[] | {
        [k: string]: any;
    };
};
export declare class I18nService {
    private readonly i18nOptions;
    private readonly translations;
    private readonly supportedLanguages;
    private readonly logger;
    private readonly parser;
    private readonly languagesSubject;
    private readonly translationsSubject;
    constructor(i18nOptions: I18nOptions, translations: Observable<I18nTranslation>, supportedLanguages: Observable<string[]>, logger: Logger, parser: I18nParser, languagesSubject: BehaviorSubject<string[]>, translationsSubject: BehaviorSubject<I18nTranslation>);
    translate(key: string, options?: translateOptions): Promise<any>;
    t(key: string, options?: translateOptions): Promise<any>;
    getSupportedLanguages(): Promise<string[]>;
    refresh(): Promise<void>;
    private translateObject;
    private handleFallbacks;
}
