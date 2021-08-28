// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable no-param-reassign */

export default class DateStorageModel {
    public static fromStorage(json: Record<string, any>, fieldName: string) {
        if (!json[fieldName]) {
            return;
        }
        json[fieldName] = new Date(json[fieldName]);
    }
}