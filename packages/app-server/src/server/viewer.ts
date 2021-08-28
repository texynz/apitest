// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import stdlib from '@local/server-stdlib';

export default class Viewer extends stdlib.Viewer {
    public constructor() {
        super();
        // Development only: Remove once permissions are added
        this.id = 'cuiddevelopmentidentifier';
    }

    // Development only: Remove once permissions are added
    public async isAuthorized(
        rule: string,
        data?: Record<string, any>,
    ): Promise<boolean> {
        return true;
    }

    // Development only: Remove once permissions are added
    public async readAuthorizedData(
        rule: string,
        data: Record<string, any>,
    ): Promise<any> {
        return data;
    }
}
