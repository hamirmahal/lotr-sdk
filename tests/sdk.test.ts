import * as dotenv from 'dotenv';
import { LordOfTheRingsSDK } from '../src/index';
import expected1000QuotesPage3 from './fixtures/1000QuotesPage3';
import quotes100 from './fixtures/100Quotes';
import allMovies from './fixtures/allMovies';
import allQuotes from './fixtures/allQuotes';
import fellowshipQuotesPage2 from './fixtures/fellowshipQuotesPage2';
import moviesPage3Limit3 from './fixtures/moviesPage3Limit3';
import offsetQuotes from './fixtures/offsetQuotes';
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
      `Invalid API key for ${lotrSDK.getMovies.name}() call. Make sure \`authenticate\` returns successfully before using any other methods.`
    );
  });
  it('should throw an error with a useful message if requesting 1 movie without successful authentication', async () => {
    const validMovieId = '5cd95395de30eff6ebccde5c';
    expect(lotrSDK.getMovie(validMovieId)).rejects.toThrowError(
      `Invalid API key for ${lotrSDK.getMovie.name}('${validMovieId}') call. Make sure \`authenticate\` returns successfully before using any other methods.`
    );
  });
  it('should throw an error with a useful message if requesting quotes without successful authentication', async () => {
    const validMovieId = '5cd95395de30eff6ebccde5c';
    expect(lotrSDK.getQuotesForMovie(validMovieId)).rejects.toThrowError(
      `Invalid API key for ${lotrSDK.getQuotesForMovie.name}('${validMovieId}') call. Make sure \`authenticate\` returns successfully before using any other methods.`
    );
  });
  it('should throw an error with a useful message if requesting all quotes without successful authentication', async () => {
    expect(lotrSDK.getAllQuotes()).rejects.toThrowError(
      `Invalid API key for ${lotrSDK.getAllQuotes.name}() call. Make sure \`authenticate\` returns successfully before using any other methods.`
    );
  });
  it('should throw an error with a useful message if requesting a quote without successful authentication', async () => {
    const validQuoteId = '5cd96e05de30eff6ebcced6b';
    expect(lotrSDK.getQuote(validQuoteId)).rejects.toThrowError(
      `Invalid API key for ${lotrSDK.getQuote.name}('${validQuoteId}') call. Make sure \`authenticate\` returns successfully before using any other methods.`
    );
  });

  // All tests beyond this point should have valid authentication.
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
  it('should throw an error with a useful message if requesting an invalid quote ID', async () => {
    expect(
      lotrSDK.getQuote('THIS_IS_AN_INVALID_QUOTE_ID')
    ).rejects.toThrowError(
      lotrSDK.getQuote.name +
        ' did not find a quote with id "THIS_IS_AN_INVALID_QUOTE_ID".'
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
  it('should fetch a quote with a valid ID without error', async () => {
    const actualQuote = await lotrSDK.getQuote('5cd96e05de30eff6ebcced6b');
    const expectedQuote = {
      docs: [
        {
          _id: '5cd96e05de30eff6ebcced6b',
          dialog: 'Frodo! Frodo!',
          movie: '5cd95395de30eff6ebccde5c',
          character: '5cd99d4bde30eff6ebccfd06',
          id: '5cd96e05de30eff6ebcced6b'
        }
      ],
      total: 1,
      limit: 1000,
      offset: 0,
      page: 1,
      pages: 1
    };
    expect(actualQuote).toEqual(expectedQuote);
  });
  it('should correctly handle pages and limits', async () => {
    const oneQuote = await lotrSDK.getAllQuotes({ limit: 1 });
    const actualQuotesPage3 = await lotrSDK.getAllQuotes({ page: 3 });
    const actual100Quotes = await lotrSDK.getAllQuotes({ limit: 100 });
    const actualMoviesPage3Limit3 = await lotrSDK.getMovies({
      limit: 3,
      page: 3
    });
    const actualFellowshipQuotes = await lotrSDK.getQuotesForMovie(
      '5cd95395de30eff6ebccde5c',
      {
        limit: 500,
        page: 2
      }
    );
    expect(actualFellowshipQuotes).toEqual(fellowshipQuotesPage2);
    expect(actualMoviesPage3Limit3).toEqual(moviesPage3Limit3);
    expect(actualQuotesPage3).toEqual(expected1000QuotesPage3);
    expect(actual100Quotes).toEqual(quotes100);
    expect(oneQuote).toEqual({
      docs: [
        {
          _id: '5cd96e05de30eff6ebcce7e9',
          dialog: 'Deagol!',
          movie: '5cd95395de30eff6ebccde5d',
          character: '5cd99d4bde30eff6ebccfe9e',
          id: '5cd96e05de30eff6ebcce7e9'
        }
      ],
      total: 2384,
      limit: 1,
      offset: 0,
      page: 1,
      pages: 2384
    });
  });
  it('should correctly handle offsets', async () => {
    const actualQuotes = await lotrSDK.getAllQuotes({ offset: 2380 });
    expect(actualQuotes).toEqual(offsetQuotes);
    expect(actualQuotes.docs.length).toBe(
      actualQuotes.total - actualQuotes.offset
    );
  });
});
