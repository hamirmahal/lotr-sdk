import fetch from 'node-fetch';

interface MovieData {
  docs: Movie[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}
interface Movie {
  _id: string;
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
}

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

  /**
   * This method retrieves information about all movies in the Lord of the Rings API.
   * @returns a `Promise` resolving to the movie data
   * @throws an `Error` if the API key is missing
   * @example
   * ```typescript
   * const actualMovies = await lotrSDK.getMovies();
   * ```
   */
  public async getMovies(): Promise<MovieData> {
    if (!this.apiKey) {
      throw new Error(
        'API key is missing in ' + this.getMovies.name + ' call.'
      );
    }

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch('https://the-one-api.dev/v2/movie', {
      headers
    });

    return await response.json();
  }
}
