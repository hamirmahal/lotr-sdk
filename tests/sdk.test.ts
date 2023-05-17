import * as dotenv from 'dotenv';
import { LordOfTheRingsSDK } from '../src/index';
import allMovies from './fixtures/allMovies';
import allQuotes from './fixtures/allQuotes';
import expectedQuotes from './fixtures/quotes';

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
  it('should throw an error with a useful message if requesting 1 movie without successful authentication', async () => {
    const validMovieId = '5cd95395de30eff6ebccde5c';
    expect(lotrSDK.getMovie(validMovieId)).rejects.toThrowError(
      'API key is missing in ' + lotrSDK.getMovie.name + ' call.'
    );
  });
  it('should throw an error with a useful message if requesting quotes without successful authentication', async () => {
    const validMovieId = '5cd95395de30eff6ebccde5c';
    expect(lotrSDK.getQuotesForMovie(validMovieId)).rejects.toThrowError(
      `API key is missing in ${lotrSDK.getQuotesForMovie.name}('${validMovieId}') call.`
    );
  });
  it('should throw an error with a useful message if requesting all quotes without successful authentication', async () => {
    expect(lotrSDK.getAllQuotes()).rejects.toThrowError(
      'API key is missing in ' + lotrSDK.getAllQuotes.name + ' call.'
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
  it('should throw an error with a useful message if requesting a movie ID that does not exist', async () => {
    expect(
      lotrSDK.getMovie('THIS_IS_AN_INVALID_MOVIE_ID')
    ).rejects.toThrowError(
      lotrSDK.getMovie.name +
        ' did not find a movie with id "THIS_IS_AN_INVALID_MOVIE_ID".'
    );
  });
  it('should throw an error with a useful message if requesting quotes for a movie ID that does not exist', async () => {
    expect(
      lotrSDK.getQuotesForMovie('THIS_IS_AN_INVALID_MOVIE_ID')
    ).rejects.toThrowError(
      lotrSDK.getQuotesForMovie.name +
        ' did not find a movie with id "THIS_IS_AN_INVALID_MOVIE_ID".'
    );
  });
  it('should fetch a valid movie ID without error', async () => {
    const actualMovie = await lotrSDK.getMovie('5cd95395de30eff6ebccde5c');
    const expectedMovie = {
      docs: [
        {
          _id: '5cd95395de30eff6ebccde5c',
          name: 'The Fellowship of the Ring',
          runtimeInMinutes: 178,
          budgetInMillions: 93,
          boxOfficeRevenueInMillions: 871.5,
          academyAwardNominations: 13,
          academyAwardWins: 4,
          rottenTomatoesScore: 91
        }
      ],
      total: 1,
      limit: 1000,
      offset: 0,
      page: 1,
      pages: 1
    };
    expect(actualMovie).toEqual(expectedMovie);
  });
  it('should fetch quotes from a valid movie ID without error', async () => {
    const quotes = await lotrSDK.getQuotesForMovie('5cd95395de30eff6ebccde5c');
    expect(quotes).toEqual(expectedQuotes);
  });
  it('should fetch quotes once authenticated', async () => {
    const actualQuotes = await lotrSDK.getAllQuotes();
    expect(actualQuotes).toEqual(allQuotes);
  });
});
