"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextObject = void 0;
function getContextObject(context) {
    switch (context.getType()) {
        case 'http':
            return context.switchToHttp().getRequest();
        case 'graphql':
            const [, , ctx] = context.getArgs();
            return ctx;
        case 'rpc':
            return context.switchToRpc().getContext();
        default:
            console.warn(`context type: ${context.getType()} not supported`);
    }
}
exports.getContextObject = getContextObject;
//# sourceMappingURL=context.js.map