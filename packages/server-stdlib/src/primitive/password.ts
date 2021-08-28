// @graph-mind
// Remove the previous line to stop Ada from updating this file
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(
    passwordHash: string,
    plaintextPassword: string,
): Promise<boolean> {
    return bcrypt.compare(plaintextPassword, passwordHash);
}

async function stall(): Promise<void> {
    try {
        await bcrypt.compare(
            '0000000',
            '$2b$12$oni8R8R2iS1a5eRHCdsTkeIOsIhegSRD22acWunAoXN2oePwp5F0W',
        );
        // eslint-disable-next-line no-empty
    } catch (e) {}
}

export default {
    hash,
    compare,
    stall,
    SALT_ROUNDS,
};