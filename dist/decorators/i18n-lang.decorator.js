"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nLang = void 0;
const common_1 = require("@nestjs/common");
const context_1 = require("../utils/context");
exports.I18nLang = common_1.createParamDecorator((data, context) => {
    const ctx = context_1.getContextObject(context);
    if (!ctx) {
        throw Error(`context type: ${context.getType()} not supported`);
    }
    return ctx.i18nLang;
});
//# sourceMappingURL=i18n-lang.decorator.js.map