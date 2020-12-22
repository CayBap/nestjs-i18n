"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptLanguageResolver = void 0;
const common_1 = require("@nestjs/common");
const accept_language_parser_1 = require("accept-language-parser");
let AcceptLanguageResolver = class AcceptLanguageResolver {
    async resolve(context) {
        let req;
        let service;
        switch (context.getType()) {
            case 'http':
                req = context.switchToHttp().getRequest();
                service = req.i18nService;
                break;
            case 'graphql':
                [, , { req, i18nService: service }] = context.getArgs();
                if (!req)
                    return undefined;
                break;
            default:
                return undefined;
        }
        const lang = req.raw
            ? req.raw.headers['accept-language']
            : req.headers['accept-language'];
        if (lang) {
            return accept_language_parser_1.pick(await service.getSupportedLanguages(), lang);
        }
        return lang;
    }
};
AcceptLanguageResolver = __decorate([
    common_1.Injectable()
], AcceptLanguageResolver);
exports.AcceptLanguageResolver = AcceptLanguageResolver;
//# sourceMappingURL=accept-language.resolver.js.map