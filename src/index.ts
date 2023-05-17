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

interface QuoteData {
  docs: Quote[];
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

interface Quote {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
  id: string;
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
  private apiKey?: string;

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
    const headers = this.getHeaders(`${this.getMovies.name}()`);

    const response = await fetch('https://the-one-api.dev/v2/movie', {
      headers
    });

    return await response.json();
  }

  /**
   * This method retrieves information about a specific movie in the Lord of the Rings API.
   * @param movieId the ID of the movie to retrieve
   * @returns a `Promise` resolving to the movie data
   * @throws an `Error` if the API key is missing, or if the movie ID does not exist
   * @example
   * ```typescript
   * try {
   *   const actualMovie = await lotrSDK.getMovie('5cd95395de30eff6ebccde5c');
   *   console.log(actualMovie);
   * } catch (error) {
   *   // This block shouldn't execute.
   *   console.error(error);
   * }
   *
   * try {
   *   const actualMovie = await lotrSDK.getMovie('INVALID_MOVIE_ID');
   * } catch (error) {
   *   // This block will execute.
   *   console.error(error);
   * }
   * ```
   */
  public async getMovie(movieId: string): Promise<MovieData> {
    const headers = this.getHeaders(`${this.getMovie.name}('${movieId}')`);

    const response = await fetch(
      `https://the-one-api.dev/v2/movie/${movieId}`,
      {
        headers
      }
    );

    const json = await response.json();

    if (json.message === 'Something went wrong.' && json.success === false) {
      throw new Error(
        this.getMovie.name + ' did not find a movie with id "' + movieId + '".'
      );
    }

    return json;
  }

  /**
   * This method retrieves quotes for a specific movie in the Lord of the Rings API.
   * @param movieId the ID of the movie for which to retrieve quotes
   * @returns a `Promise` resolving to the quotes data
   * @throws an `Error` if the API key is missing, or if a movie with id `movieId` does not exist
   * @example
   * ```typescript
   * try {
   *   const quotes = await lotrSDK.getQuotesForMovie('5cd95395de30eff6ebccde5c');
   *   console.log(quotes);
   * } catch (error) {
   *   // This block shouldn't execute.
   *   console.error(error);
   * }
   *
   * try {
   *   const quotes = await lotrSDK.getQuotesForMovie('INVALID_MOVIE_ID');
   * } catch (error) {
   *   // This block should execute.
   *   console.error(error);
   * }
   * ```
   */
  public async getQuotesForMovie(movieId: string): Promise<QuoteData> {
    const headers = this.getHeaders(
      `${this.getQuotesForMovie.name}('${movieId}')`
    );

    const response = await fetch(
      `https://the-one-api.dev/v2/movie/${movieId}/quote`,
      {
        headers
      }
    );

    const json = await response.json();

    if (json.message === 'Something went wrong.' && json.success === false) {
      throw new Error(
        this.getQuotesForMovie.name +
          ' did not find a movie with id "' +
          movieId +
          '".'
      );
    }

    return json;
  }

  /**
   * This method retrieves all quotes from the Lord of the Rings API.
   * @returns a `Promise` resolving to the quotes data
   * @throws an `Error` if the API key is missing
   * @example
   * ```typescript
   * const quotes = await lotrSDK.getAllQuotes();
   * ```
   */
  public async getAllQuotes(): Promise<QuoteData> {
    const headers = this.getHeaders(`${this.getAllQuotes.name}()`);

    const response = await fetch('https://the-one-api.dev/v2/quote', {
      headers
    });

    return await response.json();
  }

  /**
   * This method retrieves a specific quote from the Lord of the Rings API.
   * @param quoteId the ID of the quote to retrieve
   * @returns a `Promise` resolving to the quote data
   * @throws an `Error` if the API key is missing, or if a quote with id `quoteId` does not exist
   * @example
   * ```typescript
   * try {
   *   const quote = await lotrSDK.getQuote('5cd96e05de30eff6ebcced6b');
   *   console.log(quote);
   * } catch (error) {
   *   // This block shouldn't execute.
   *   console.error(error);
   * }
   *
   * try {
   *   const quote = await lotrSDK.getQuote('INVALID_QUOTE_ID');
   *   console.log(quote);
   * } catch (error) {
   *   // This block should execute.
   *   console.error(error);
   * }
   * ```
   */
  public async getQuote(quoteId: string): Promise<QuoteData> {
    const headers = this.getHeaders(`${this.getQuote.name}('${quoteId}')`);

    const response = await fetch(
      `https://the-one-api.dev/v2/quote/${quoteId}`,
      {
        headers
      }
    );

    const json = await response.json();

    if (json.message === 'Something went wrong.' && json.success === false) {
      throw new Error(
        this.getQuote.name + ' did not find a quote with id "' + quoteId + '".'
      );
    }

    return json;
  }

  /**
   * This is a helper function to get the `headers` object with
   * `Authorization` and `Content-Type`.
   * @param originalFnCall the original function call that needs an API key
   * @returns The headers object with Authorization and Content-Type headers.
   * @throws an `Error` if the API key is missing
   * @example
   * ```typescript
   * public async getQuote(quoteId: string): Promise<QuoteData> {
   *   const headers = this.getHeaders(
   *     `API key is missing in ${this.getQuote.name}('${quoteId}') call.`
   *   );
   *   ...
   * }
   * ```
   */
  private getHeaders(originalFnCall: string): {
    Authorization: string;
    'Content-Type': 'application/json';
  } {
    if (!this.apiKey) {
      throw new Error(
        'Invalid API key for ' +
          originalFnCall +
          ' call. Make sure `authenticate` returns successfully before using any other methods.'
      );
    }

    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }
}
