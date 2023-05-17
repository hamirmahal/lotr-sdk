import * as dotenv from 'dotenv';
import { LordOfTheRingsSDK } from '../src/index';
import allMovies from './fixtures/allMovies';

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
  it('should throw an error with a useful message if requesting movies without successful authentication', async () => {
    expect(lotrSDK.getMovies()).rejects.toThrowError(
      'API key is missing in ' + lotrSDK.getMovies.name + ' call.'
    );
  });

  // All tests beyond this point should have a valid API key.
  it('should authenticate without error with a correct API key', async () => {
    const validAPIKey = process.env.API_KEY || '';
    const authenticationWasSuccessful = await lotrSDK.authenticate(validAPIKey);
    expect(authenticationWasSuccessful).toBe(true);
  });
  it('should fetch movies once authenticated', async () => {
    const actualMovies = await lotrSDK.getMovies();
    expect(actualMovies).toEqual(allMovies);
  });
});
