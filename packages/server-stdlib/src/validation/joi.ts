// @graph-mind
// Remove the previous line to stop Ada from updating this file
import joiDateValidation from '@joi/date';
import * as JoiBase from 'joi';
import joiIdValidation, { JoiIdInterface } from './joiIdValidation';
import joiMoneyValidation, { JoiMoneySchema } from './joiMoneyValidation';
import joiPaginationValidation, {
    JoiPaginationSchema,
} from './joiPaginationValidation';
import joiPhoneValidation, { JoiPhoneSchema } from './joiPhoneValidation';

// prettier-ignore
export type JoiValidationType = JoiBase.Root
    & JoiIdInterface
    & { money(): JoiMoneySchema }
    & { pagination(): JoiPaginationSchema }
    & { phone(): JoiPhoneSchema };

// eslint-disable-next-line import/no-mutable-exports
let joi: JoiValidationType = JoiBase as JoiValidationType;
joi = joi.extend(joiDateValidation);
joi = joi.extend(joiIdValidation);
joi = joi.extend(joiMoneyValidation);
joi = joi.extend(joiPhoneValidation);
joi = joi.extend(joiPaginationValidation);

export default joi;