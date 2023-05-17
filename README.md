# Installation

You can run `npm install @hamirmahal/lotr-sdk` in your terminal to install this SDK for use in TypeScript and JavaScript projects.

# Usage

## TypeScript

```typescript
import { LordOfTheRingsSDK } from '@hamirmahal/lotr-sdk';

const lotrSDK = new LordOfTheRingsSDK();

const runDemo = async () => {
  const result = await lotrSDK.authenticate('YOUR_API_KEY_HERE');
  console.log('Authentication result: ', result);

  const movies = await lotrSDK.getMovies();
  console.log('Movies: ', movies);
};

runDemo();
```

## JavaScript

```javascript
const { LordOfTheRingsSDK } = require('@hamirmahal/lotr-sdk');

const lotrSDK = new LordOfTheRingsSDK();

const runDemo = async () => {
  const result = await lotrSDK.authenticate('YOUR_API_KEY_HERE');
  console.log('Authentication result: ', result);

  const movies = await lotrSDK.getMovies();
  console.log('Movies: ', movies);
};

runDemo();
```

# Testing

1. Create a `.env` file at the root of this repository if it does not exist already, and update the contents of the file with your API key.

```
API_KEY=replace_everything_after_the_equals_sign_with_your_api_key
```

2. You should now be able to run `npm test` to verify this SDK words as intended.
