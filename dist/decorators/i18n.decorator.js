"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18n = void 0;
const common_1 = require("@nestjs/common");
const i18n_context_1 = require("../i18n.context");
exports.I18n = common_1.createParamDecorator((data, ctx) => {
    switch (ctx.getType()) {
        case 'http':
            return new i18n_context_1.I18nContext(...resolveI18nServiceFromRequest(ctx.switchToHttp().getRequest()));
        case 'graphql':
            return new i18n_context_1.I18nContext(...resolveI18nServiceFromGraphQLContext(ctx.getArgs()));
        case 'rpc':
            return new i18n_context_1.I18nContext(...resolveI18nServiceFromRpcContext(ctx.switchToRpc().getContext()));
        default:
            throw Error(`context type: ${ctx.getType()} not supported`);
    }
});
function resolveI18nServiceFromRequest(req) {
    return [
        req.raw && req.raw.i18nLang ? req.raw.i18nLang : req.i18nLang,
        req.raw && req.raw.i18nService ? req.raw.i18nService : req.i18nService,
    ];
}
function resolveI18nServiceFromGraphQLContext(graphqlContext) {
    const [root, args, ctx, info] = graphqlContext;
    return [ctx.i18nLang, ctx.i18nService];
}
function resolveI18nServiceFromRpcContext(rpcContext) {
    return [rpcContext.i18nLang, rpcContext.i18nService];
}
//# sourceMappingURL=i18n.decorator.js.map