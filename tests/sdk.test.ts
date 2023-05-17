import * as dotenv from 'dotenv';
import { LordOfTheRingsSDK } from '../src/index';

// Load environment variables, like the API key.
dotenv.config();

describe(LordOfTheRingsSDK.name, () => {
  const lotrSDK = new LordOfTheRingsSDK();

  it('should fail to authenticate with an incorrect API key', async () => {
    const authenticationWasSuccessful = await lotrSDK.authenticate(
      'THIS_IS_AN_INVALID_API_KEY'
    );
    expect(authenticationWasSuccessful).toBe(false);
  });

  it('should authenticate without error with a correct API key', async () => {
    const validAPIKey = process.env.API_KEY || '';
    const authenticationWasSuccessful = await lotrSDK.authenticate(validAPIKey);
    expect(authenticationWasSuccessful).toBe(true);
  });
});
