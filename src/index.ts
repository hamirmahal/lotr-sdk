import fetch from 'node-fetch';

/**
 * This is the main class for interacting with the Lord of the Rings API.
 * @example
 * ```typescript
 * import { LordOfTheRingsSDK } from 'lotr-sdk';
 *
 * const lotrSDK = new LordOfTheRingsSDK();
 * ```
 */
export class LordOfTheRingsSDK {
  private apiKey: string;

  /**
   * This method authenticates using the provided API key,
   * and returns true if authentication was successful, and false otherwise.
   *
   * This functions tells whether an API key is valid by making a small API request.
   * @param apiKey the API key to use for authentication
   * @returns `true` if authentication was successful, and `false` otherwise
   * @example
   * ```typescript
   * let result = await lotrSDK.authenticate('INVALID_API_KEY');
   * expect(result).toBe(false);
   *
   * result = await lotrSDK.authenticate('SOME_VALID_API_KEY');
   * expect(result).toBe(true);
   * ```
   */
  public async authenticate(apiKey: string): Promise<boolean> {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(
      'https://the-one-api.dev/v2/movie/5cd95395de30eff6ebccde56',
      {
        headers
      }
    );

    if (response.status === 200 && response.statusText === 'OK') {
      this.apiKey = apiKey;
      return true;
    }

    return false;
  }
}
