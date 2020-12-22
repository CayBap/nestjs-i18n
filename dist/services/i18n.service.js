"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nService = void 0;
const common_1 = require("@nestjs/common");
const format = require("string-format");
const i18n_constants_1 = require("../i18n.constants");
const rxjs_1 = require("rxjs");
const i18n_parser_1 = require("../parsers/i18n.parser");
const operators_1 = require("rxjs/operators");
let I18nService = class I18nService {
    constructor(i18nOptions, translations, supportedLanguages, logger, parser, languagesSubject, translationsSubject) {
        this.i18nOptions = i18nOptions;
        this.translations = translations;
        this.supportedLanguages = supportedLanguages;
        this.logger = logger;
        this.parser = parser;
        this.languagesSubject = languagesSubject;
        this.translationsSubject = translationsSubject;
    }
    async translate(key, options) {
        options = Object.assign({ lang: this.i18nOptions.fallbackLanguage }, options);
        const { args } = options;
        let { lang } = options;
        lang =
            lang === undefined || lang === null
                ? this.i18nOptions.fallbackLanguage
                : lang;
        lang = await this.handleFallbacks(lang);
        const translationsByLanguage = (await this.translations.pipe(operators_1.take(1)).toPromise())[lang];
        const translation = await this.translateObject(key, translationsByLanguage ? translationsByLanguage : key, options);
        if (translationsByLanguage === undefined ||
            translationsByLanguage === null ||
            !translation) {
            if (lang !== this.i18nOptions.fallbackLanguage) {
                const message = `Translation "${key}" in "${lang}" does not exist.`;
                this.logger.error(message);
                return this.translate(key, {
                    lang: this.i18nOptions.fallbackLanguage,
                    args,
                });
            }
        }
        return translation || key;
    }
    t(key, options) {
        return this.translate(key, options);
    }
    async getSupportedLanguages() {
        return this.supportedLanguages.pipe(operators_1.take(1)).toPromise();
    }
    async refresh() {
        const translations = await this.parser.parse();
        if (translations instanceof rxjs_1.Observable) {
            this.translationsSubject.next(await translations.pipe(operators_1.take(1)).toPromise());
        }
        else {
            this.translationsSubject.next(translations);
        }
        const languages = await this.parser.languages();
        if (languages instanceof rxjs_1.Observable) {
            this.languagesSubject.next(await languages.pipe(operators_1.take(1)).toPromise());
        }
        else {
            this.languagesSubject.next(languages);
        }
    }
    async translateObject(key, translations, options) {
        const keys = key.split('.');
        const [firstKey] = keys;
        const { args } = options;
        if (keys.length > 1 && !translations.hasOwnProperty(key)) {
            const newKey = keys.slice(1, keys.length).join('.');
            return translations && translations.hasOwnProperty(firstKey)
                ? await this.translateObject(newKey, translations[firstKey], options)
                : undefined;
        }
        let translation = translations[key];
        if (translation && (args || (args instanceof Array && args.length > 0))) {
            if (translation instanceof Object) {
                return Object.keys(translation).reduce(async (obj, nestedKey) => {
                    return Object.assign(Object.assign({}, (await obj)), { [nestedKey]: await this.translateObject(nestedKey, translation, options) });
                }, Promise.resolve({}));
            }
            translation = format(translation, ...(args instanceof Array ? args || [] : [args]));
        }
        return translation;
    }
    async handleFallbacks(lang) {
        const supportedLanguages = await this.getSupportedLanguages();
        if (this.i18nOptions.fallbacks && !supportedLanguages.includes(lang)) {
            const sanitizedLang = lang.includes('-')
                ? lang.substring(0, lang.indexOf('-')).concat('-*')
                : lang;
            for (const key in this.i18nOptions.fallbacks) {
                if (key === lang || key === sanitizedLang) {
                    lang = this.i18nOptions.fallbacks[key];
                    break;
                }
            }
        }
        return lang;
    }
};
I18nService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(i18n_constants_1.I18N_OPTIONS)),
    __param(1, common_1.Inject(i18n_constants_1.I18N_TRANSLATIONS)),
    __param(2, common_1.Inject(i18n_constants_1.I18N_LANGUAGES)),
    __param(5, common_1.Inject(i18n_constants_1.I18N_LANGUAGES_SUBJECT)),
    __param(6, common_1.Inject(i18n_constants_1.I18N_TRANSLATIONS_SUBJECT)),
    __metadata("design:paramtypes", [Object, rxjs_1.Observable,
        rxjs_1.Observable,
        common_1.Logger,
        i18n_parser_1.I18nParser,
        rxjs_1.BehaviorSubject,
        rxjs_1.BehaviorSubject])
], I18nService);
exports.I18nService = I18nService;
//# sourceMappingURL=i18n.service.js.map