This is an SDK that covers each of the following endpoints.

- /movie
- /movie/{id}
- /movie/{id}/quote
- /quote
- /quote/{id}

This SDK is a `class`, that you first instantiate with `new LordOfTheRingsSDK();`.

The first call of the SDK instance should be to `authenticate('YOUR_API_KEY_HERE')`, which will return `false` if authentication was unsuccessful.

`authenticate` makes an API call immediately, to make sure your API key is valid right off the bat.

The SDK instance stores the API key as a `private` field, so any future calls made to the Lord of the Rings API don't require you to re-specify your API key after a successful `authenticate` call.

Methods on the SDK class that communicate with an endpoint should either return the data you requested, or throw a detailed `Error` message explaining exactly what went wrong.
