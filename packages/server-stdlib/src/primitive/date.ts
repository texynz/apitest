// @graph-mind
// Remove the previous line to stop Ada from updating this file
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import addMinutes from 'date-fns/addMinutes';
import addMonths from 'date-fns/addMonths';
import addSeconds from 'date-fns/addSeconds';
import addWeeks from 'date-fns/addWeeks';
import addYears from 'date-fns/addYears';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';
import subMinutes from 'date-fns/subMinutes';
import subMonths from 'date-fns/subMonths';
import subSeconds from 'date-fns/subSeconds';
import subWeeks from 'date-fns/subWeeks';
import subYears from 'date-fns/subYears';

const isBeforeOrEqual = (leftDate, rightDate) =>
    isBefore(leftDate, rightDate) || isEqual(leftDate, rightDate);
const isAfterOrEqual = (leftDate, rightDate) =>
    isAfter(leftDate, rightDate) || isEqual(leftDate, rightDate);
const isNotEqual = (leftDate, rightDate) => !isEqual(leftDate, rightDate);

export default {
    addSeconds,
    addMinutes,
    addHours,
    addDays,
    addWeeks,
    addMonths,
    addYears,
    subSeconds,
    subMinutes,
    subHours,
    subDays,
    subWeeks,
    subMonths,
    subYears,
    isBefore,
    isBeforeOrEqual,
    isAfter,
    isAfterOrEqual,
    isEqual,
    isNotEqual,
    startOfDay,
    startOfMonth,
};