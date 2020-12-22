import { I18nResolver } from '../index';
import { ExecutionContext } from '@nestjs/common';
export declare class AcceptLanguageResolver implements I18nResolver {
    resolve(context: ExecutionContext): Promise<string | string[] | undefined>;
}
