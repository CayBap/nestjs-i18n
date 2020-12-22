"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldResolve = void 0;
function shouldResolve(e) {
    return (typeof e === 'function' ||
        (e.hasOwnProperty('use') && e.hasOwnProperty('options')));
}
exports.shouldResolve = shouldResolve;
//# sourceMappingURL=util.js.map