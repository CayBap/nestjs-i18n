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
var I18nModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nModule = void 0;
const common_1 = require("@nestjs/common");
const i18n_constants_1 = require("./i18n.constants");
const i18n_service_1 = require("./services/i18n.service");
const i18n_request_scope_service_1 = require("./services/i18n-request-scope.service");
const i18n_language_interceptor_1 = require("./interceptors/i18n-language.interceptor");
const core_1 = require("@nestjs/core");
const i18n_resolver_options_decorator_1 = require("./decorators/i18n-resolver-options.decorator");
const util_1 = require("./utils/util");
const i18n_parser_1 = require("./parsers/i18n.parser");
const rxjs_1 = require("rxjs");
const logger = new common_1.Logger('I18nService');
const defaultOptions = {
    resolvers: [],
};
let I18nModule = I18nModule_1 = class I18nModule {
    constructor(i18n) {
        this.i18n = i18n;
    }
    async onModuleInit() {
        await this.i18n.refresh();
    }
    static forRoot(options) {
        options = this.sanitizeI18nOptions(options);
        const i18nLanguagesSubject = new rxjs_1.BehaviorSubject([]);
        const i18nTranslationSubject = new rxjs_1.BehaviorSubject({});
        const i18nOptions = {
            provide: i18n_constants_1.I18N_OPTIONS,
            useValue: options,
        };
        const i18nParserProvider = {
            provide: i18n_parser_1.I18nParser,
            useClass: options.parser,
        };
        const i18nParserOptionsProvider = {
            provide: i18n_constants_1.I18N_PARSER_OPTIONS,
            useValue: options.parserOptions,
        };
        const i18nLanguagesSubjectProvider = {
            provide: i18n_constants_1.I18N_LANGUAGES_SUBJECT,
            useValue: i18nLanguagesSubject,
        };
        const i18nTranslationSubjectProvider = {
            provide: i18n_constants_1.I18N_TRANSLATIONS_SUBJECT,
            useValue: i18nTranslationSubject,
        };
        const translationsProvider = {
            provide: i18n_constants_1.I18N_TRANSLATIONS,
            useFactory: async (parser) => {
                try {
                    const translation = await parser.parse();
                    if (translation instanceof rxjs_1.Observable) {
                        translation.subscribe(i18nTranslationSubject);
                    }
                    else {
                        i18nTranslationSubject.next(translation);
                    }
                }
                catch (e) {
                    logger.error('parsing translation error', e);
                }
                return i18nTranslationSubject.asObservable();
            },
            inject: [i18n_parser_1.I18nParser],
        };
        const languagessProvider = {
            provide: i18n_constants_1.I18N_LANGUAGES,
            useFactory: async (parser) => {
                try {
                    const languages = await parser.languages();
                    if (languages instanceof rxjs_1.Observable) {
                        languages.subscribe(i18nLanguagesSubject);
                    }
                    else {
                        i18nLanguagesSubject.next(languages);
                    }
                }
                catch (e) {
                    logger.error('parsing translation error', e);
                }
                return i18nLanguagesSubject.asObservable();
            },
            inject: [i18n_parser_1.I18nParser],
        };
        const resolversProvider = {
            provide: i18n_constants_1.I18N_RESOLVERS,
            useValue: options.resolvers || [],
        };
        return {
            module: I18nModule_1,
            providers: [
                { provide: common_1.Logger, useValue: logger },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: i18n_language_interceptor_1.I18nLanguageInterceptor,
                },
                i18n_service_1.I18nService,
                i18n_request_scope_service_1.I18nRequestScopeService,
                i18nOptions,
                translationsProvider,
                languagessProvider,
                resolversProvider,
                i18nParserProvider,
                i18nParserOptionsProvider,
                i18nLanguagesSubjectProvider,
                i18nTranslationSubjectProvider,
                ...this.createResolverProviders(options.resolvers),
            ],
            exports: [i18n_service_1.I18nService, i18n_request_scope_service_1.I18nRequestScopeService, languagessProvider],
        };
    }
    static forRootAsync(options) {
        const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
        const asyncTranslationProvider = this.createAsyncTranslationProvider();
        const asyncLanguagesProvider = this.createAsyncLanguagesProvider();
        const asyncParserOptionsProvider = this.createAsyncParserOptionsProvider();
        const i18nLanguagesSubject = new rxjs_1.BehaviorSubject([]);
        const i18nTranslationSubject = new rxjs_1.BehaviorSubject({});
        const resolversProvider = {
            provide: i18n_constants_1.I18N_RESOLVERS,
            useValue: options.resolvers || [],
        };
        const i18nParserProvider = {
            provide: i18n_parser_1.I18nParser,
            useClass: options.parser,
        };
        const i18nLanguagesSubjectProvider = {
            provide: i18n_constants_1.I18N_LANGUAGES_SUBJECT,
            useValue: i18nLanguagesSubject,
        };
        const i18nTranslationSubjectProvider = {
            provide: i18n_constants_1.I18N_TRANSLATIONS_SUBJECT,
            useValue: i18nTranslationSubject,
        };
        return {
            module: I18nModule_1,
            imports: options.imports || [],
            providers: [
                { provide: common_1.Logger, useValue: logger },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: i18n_language_interceptor_1.I18nLanguageInterceptor,
                },
                asyncOptionsProvider,
                asyncTranslationProvider,
                asyncLanguagesProvider,
                asyncParserOptionsProvider,
                i18n_service_1.I18nService,
                i18n_request_scope_service_1.I18nRequestScopeService,
                resolversProvider,
                i18nParserProvider,
                i18nLanguagesSubjectProvider,
                i18nTranslationSubjectProvider,
                ...this.createResolverProviders(options.resolvers),
            ],
            exports: [i18n_service_1.I18nService, i18n_request_scope_service_1.I18nRequestScopeService, asyncLanguagesProvider],
        };
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: i18n_constants_1.I18N_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: i18n_constants_1.I18N_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createI18nOptions(),
            inject: [options.useClass || options.useExisting],
        };
    }
    static createAsyncParserOptionsProvider() {
        return {
            provide: i18n_constants_1.I18N_PARSER_OPTIONS,
            useFactory: async (options) => {
                return options.parserOptions;
            },
            inject: [i18n_constants_1.I18N_OPTIONS],
        };
    }
    static createAsyncTranslationProvider() {
        return {
            provide: i18n_constants_1.I18N_TRANSLATIONS,
            useFactory: async (parser, translationsSubject) => {
                try {
                    const translation = await parser.parse();
                    if (translation instanceof rxjs_1.Observable) {
                        translation.subscribe(translationsSubject);
                    }
                    else {
                        translationsSubject.next(translation);
                    }
                }
                catch (e) {
                    logger.error('parsing translation error', e);
                }
                return translationsSubject.asObservable();
            },
            inject: [i18n_parser_1.I18nParser, i18n_constants_1.I18N_TRANSLATIONS_SUBJECT],
        };
    }
    static createAsyncLanguagesProvider() {
        return {
            provide: i18n_constants_1.I18N_LANGUAGES,
            useFactory: async (parser, languagesSubject) => {
                try {
                    const languages = await parser.languages();
                    if (languages instanceof rxjs_1.Observable) {
                        languages.subscribe(languagesSubject);
                    }
                    else {
                        languagesSubject.next(languages);
                    }
                }
                catch (e) {
                    logger.error('parsing translation error', e);
                }
                return languagesSubject.asObservable();
            },
            inject: [i18n_parser_1.I18nParser, i18n_constants_1.I18N_LANGUAGES_SUBJECT],
        };
    }
    static sanitizeI18nOptions(options) {
        options = Object.assign(Object.assign({}, defaultOptions), options);
        return options;
    }
    static createResolverProviders(resolvers) {
        return (resolvers || [])
            .filter(util_1.shouldResolve)
            .reduce((providers, r) => {
            if (r.hasOwnProperty('use') && r.hasOwnProperty('options')) {
                const resolver = r;
                const optionsToken = i18n_resolver_options_decorator_1.getI18nResolverOptionsToken(resolver.use);
                providers.push({
                    provide: resolver.use,
                    useClass: resolver.use,
                    inject: [optionsToken],
                });
                providers.push({
                    provide: optionsToken,
                    useFactory: () => resolver.options,
                });
            }
            else {
                const optionsToken = i18n_resolver_options_decorator_1.getI18nResolverOptionsToken(r);
                providers.push({
                    provide: r,
                    useClass: r,
                    inject: [optionsToken],
                });
                providers.push({
                    provide: optionsToken,
                    useFactory: () => undefined,
                });
            }
            return providers;
        }, []);
    }
};
I18nModule = I18nModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({}),
    __metadata("design:paramtypes", [i18n_service_1.I18nService])
], I18nModule);
exports.I18nModule = I18nModule;
//# sourceMappingURL=i18n.module.js.map