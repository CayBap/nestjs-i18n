"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18N_PARSER_OPTIONS = exports.I18N_RESOLVERS = exports.I18N_RESOLVER_OPTIONS = exports.I18N_LANGUAGES = exports.I18N_TRANSLATIONS = exports.I18N_OPTIONS = void 0;
__exportStar(require("./i18n.module"), exports);
var i18n_constants_1 = require("./i18n.constants");
Object.defineProperty(exports, "I18N_OPTIONS", { enumerable: true, get: function () { return i18n_constants_1.I18N_OPTIONS; } });
Object.defineProperty(exports, "I18N_TRANSLATIONS", { enumerable: true, get: function () { return i18n_constants_1.I18N_TRANSLATIONS; } });
Object.defineProperty(exports, "I18N_LANGUAGES", { enumerable: true, get: function () { return i18n_constants_1.I18N_LANGUAGES; } });
Object.defineProperty(exports, "I18N_RESOLVER_OPTIONS", { enumerable: true, get: function () { return i18n_constants_1.I18N_RESOLVER_OPTIONS; } });
Object.defineProperty(exports, "I18N_RESOLVERS", { enumerable: true, get: function () { return i18n_constants_1.I18N_RESOLVERS; } });
Object.defineProperty(exports, "I18N_PARSER_OPTIONS", { enumerable: true, get: function () { return i18n_constants_1.I18N_PARSER_OPTIONS; } });
__exportStar(require("./i18n.context"), exports);
__exportStar(require("./services/i18n.service"), exports);
__exportStar(require("./services/i18n-request-scope.service"), exports);
__exportStar(require("./interfaces/i18n-options.interface"), exports);
__exportStar(require("./interfaces/i18n-language-resolver.interface"), exports);
__exportStar(require("./interfaces/i18n-translation.interface"), exports);
__exportStar(require("./decorators/i18n-lang.decorator"), exports);
__exportStar(require("./decorators/i18n-languages.decorator"), exports);
__exportStar(require("./decorators/i18n-resolver-options.decorator"), exports);
__exportStar(require("./decorators/i18n.decorator"), exports);
__exportStar(require("./resolvers/header.resolver"), exports);
__exportStar(require("./resolvers/accept-language.resolver"), exports);
__exportStar(require("./resolvers/query.resolver"), exports);
__exportStar(require("./resolvers/cookie.resolver"), exports);
__exportStar(require("./parsers/i18n.parser"), exports);
__exportStar(require("./parsers/i18n.json.parser"), exports);
//# sourceMappingURL=index.js.map