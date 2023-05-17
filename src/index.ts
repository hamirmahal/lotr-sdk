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

interface RequestOptions {
  /**
   * This is the amount of results per page.
   */
  limit?: number;
  /**
   * This is the number of results to skip.
   */
  offset?: number;
  /**
   * This is the page number to retrieve.
   * Pages appear to have a default size of `1000`.
   */
  page?: number;
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
   * @param requestOptions optional options to use for the request
   *
   * Set a `limit` if you want to limit the number of results returned.
   *
   * Set an `offset` if you want to skip a number of results.
   *
   * Set a `page` if you want to see a certain page of results.
   * If `limit` is not specified, the assumed page size is 1000.
   * @returns a `Promise` resolving to the movie data
   * @throws an `Error` if the API key is missing
   * @example
   * ```typescript
   * const actualMovies = await lotrSDK.getMovies();
   * const actualMoviesPage3Limit3 = await lotrSDK.getMovies({
   *   limit: 3,
   *   page: 3
   * });
   * ```
   */
  public async getMovies(options?: RequestOptions): Promise<MovieData> {
    const headers = this.getHeaders(`${this.getMovies.name}()`);
    const json = await this.fetchJson(
      'https://the-one-api.dev/v2/movie',
      headers,
      options
    );
    return json;
  }

  /**
   * This method retrieves information about a specific movie in the Lord of the Rings API.
   * @param movieId the ID of the movie to retrieve
   * @param requestOptions optional options to use for the request
   *
   * Set a `limit` if you want to limit the number of results returned.
   *
   * Set an `offset` if you want to skip a number of results.
   *
   * Set a `page` if you want to see a certain page of results.
   * If `limit` is not specified, the assumed page size is 1000.
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
  public async getMovie(
    movieId: string,
    options?: RequestOptions
  ): Promise<MovieData> {
    const headers = this.getHeaders(`${this.getMovie.name}('${movieId}')`);
    const json = await this.fetchJson(
      `https://the-one-api.dev/v2/movie/${movieId}`,
      headers,
      options
    );

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
   * @param requestOptions optional options to use for the request
   *
   * Set a `limit` if you want to limit the number of results returned.
   *
   * Set an `offset` if you want to skip a number of results.
   *
   * Set a `page` if you want to see a certain page of results.
   * If `limit` is not specified, the assumed page size is 1000.
   * @returns a `Promise` resolving to the quotes data
   * @throws an `Error` if the API key is missing, or if a movie with id `movieId` does not exist
   * @example
   * ```typescript
   * try {
   *   const quotes = await lotrSDK.getQuotesForMovie(
   *     '5cd95395de30eff6ebccde5c'
   *   );
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
   *
   * const fellowshipQuotes = await lotrSDK.getQuotesForMovie(
   *   '5cd95395de30eff6ebccde5c',
   *   {
   *     limit: 500,
   *     page: 2
   *   }
   * );
   * ```
   */
  public async getQuotesForMovie(
    movieId: string,
    options?: RequestOptions
  ): Promise<QuoteData> {
    const headers = this.getHeaders(
      `${this.getQuotesForMovie.name}('${movieId}')`
    );

    const json = await this.fetchJson(
      `https://the-one-api.dev/v2/movie/${movieId}/quote`,
      headers,
      options
    );

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
   * @param requestOptions optional options to use for the request
   *
   * Set a `limit` if you want to limit the number of results returned.
   *
   * Set an `offset` if you want to skip a number of results.
   *
   * Set a `page` if you want to see a certain page of results.
   * If `limit` is not specified, the assumed page size is 1000.
   * @returns a `Promise` resolving to the quotes data
   * @throws an `Error` if the API key is missing
   * @example
   * ```typescript
   * const allQuotes = await lotrSDK.getAllQuotes();
   * const quote = await lotrSDK.getAllQuotes({ limit: 1 });
   * const quotesPage3 = await lotrSDK.getAllQuotes({ page: 3 });
   * const offsetQuotes = await lotrSDK.getAllQuotes({ offset: 2380 });
   * ```
   */
  public async getAllQuotes(options?: RequestOptions): Promise<QuoteData> {
    const headers = this.getHeaders(`${this.getAllQuotes.name}()`);
    const json = await this.fetchJson(
      'https://the-one-api.dev/v2/quote',
      headers,
      options
    );
    return json;
  }

  /**
   * This method retrieves a specific quote from the Lord of the Rings API.
   * @param quoteId the ID of the quote to retrieve
   * @param requestOptions optional options to use for the request
   *
   * Set a `limit` if you want to limit the number of results returned.
   *
   * Set an `offset` if you want to skip a number of results.
   *
   * Set a `page` if you want to see a certain page of results.
   * If `limit` is not specified, the assumed page size is 1000.
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
  public async getQuote(
    quoteId: string,
    options?: RequestOptions
  ): Promise<QuoteData> {
    const headers = this.getHeaders(`${this.getQuote.name}('${quoteId}')`);
    const json = await this.fetchJson(
      `https://the-one-api.dev/v2/quote/${quoteId}`,
      headers,
      options
    );

    if (json.message === 'Something went wrong.' && json.success === false) {
      throw new Error(
        this.getQuote.name + ' did not find a quote with id "' + quoteId + '".'
      );
    }

    return json;
  }

  /**
   * This helper method fetches a `JSON` response from `url` with the given headers.
   * @param url the URL to fetch
   * @param headers the headers to include in the request
   * @param requestOptions optional options to use for the request
   *
   * Set a `limit` if you want to limit the number of results returned.
   *
   * Set an `offset` if you want to skip a number of results.
   *
   * Set a `page` if you want to see a certain page of results.
   * If `limit` is not specified, the assumed page size is 1000.
   * @returns the parsed `JSON` response
   * @example
   * ```typescript
   * const headers = this.getHeaders(`${this.getMovies.name}()`);
   * const json = await this.fetchJson(
   *   'https://the-one-api.dev/v2/movie',
   *   headers
   * );
   * console.log(json);
   * ```
   */
  private async fetchJson(
    url: string,
    headers: {
      Authorization: string;
      'Content-Type': 'application/json';
    },
    options?: RequestOptions
  ): Promise<any> {
    const queryParams = new URLSearchParams(
      (options as Record<string, string>) || {}
    ).toString();
    const fetchUrl = queryParams ? `${url}?${queryParams}` : url;
    const response = await fetch(fetchUrl, { headers });
    return await response.json();
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
