// @graph-mind
// Remove the previous line to stop Ada from updating this file
import stdlib from '@local/server-stdlib';
import startup from './server';

startup().catch((error) => {
    stdlib.Logger.lowLevelEmergency('Fatal startup', error);
    process.exitCode = 1;
    process.exit(1);
});