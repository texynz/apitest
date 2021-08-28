// @graph-mind
// Remove the previous line to stop Ada from updating this file
import * as transform from 'morphism';
import { array } from './array';
import { entity } from './entity';
import errors from './errors';
import Factory from './factory';
import Logger from './logger';
import { object } from './object';
import * as orm from './orm';
import * as primitive from './primitive';
import rest from './rest';
import Session from './session';
import * as standards from './standards';
import { validation } from './validation';
import Viewer from './viewer';

export default {
    transform,
    validation,
    entity,
    primitive,
    array,
    object,
    orm,
    rest,
    Factory,
    Session,
    Logger,
    Viewer,
    createError: errors,
};

export interface StdlibTypes {
    Factory: Factory;
    Session: Session;
    Logger: Logger;
    primitive: {
        Money: primitive.Money;
    };
    standards: {
        OffsetPaginationInput: standards.OffsetPaginationInput;
        OffsetPaginationInfo: standards.OffsetPaginationInfo;
    };
}