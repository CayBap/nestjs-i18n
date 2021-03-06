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
exports.I18nRequestScopeService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const i18n_service_1 = require("./i18n.service");
let I18nRequestScopeService = class I18nRequestScopeService {
    constructor(req, i18nService) {
        this.req = req;
        this.i18nService = i18nService;
    }
    translate(key, options) {
        options = Object.assign({ lang: this.req.i18nLang }, options);
        return this.i18nService.translate(key, options);
    }
    t(key, options) {
        return this.translate(key, options);
    }
};
I18nRequestScopeService = __decorate([
    common_1.Injectable({ scope: common_1.Scope.REQUEST }),
    __param(0, common_1.Inject(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, i18n_service_1.I18nService])
], I18nRequestScopeService);
exports.I18nRequestScopeService = I18nRequestScopeService;
//# sourceMappingURL=i18n-request-scope.service.js.map