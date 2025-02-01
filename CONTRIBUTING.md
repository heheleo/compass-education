# Contributing

Thank you for considering contributing to this project.

Issues and pull requests are **always welcome**. If you have any questions, please open an issue.

## Stack

This project uses [Node.js](https://nodejs.org/) and [TypeScript](https://www.typescriptlang.org/), [pnpm](https://pnpm.io/) as the package manager, [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting, and [tsup](https://tsup.egoist.sh/) for bundling.

## Workflow

- Fork and clone this repository.
- Create a new branch in your fork based off the main branch.
- Make your changes.
- Commit your changes, and push them.
- Submit a pull request!

## Building

To build the project using tsup, use the following command:

```bash
pnpm build
```

This will output the bundled files in the `dist` directory. The .mjs bundle is for ES modules, and the .js bundle is for CommonJS.

## Testing

This project uses [uvu](https://github.com/lukeed/uvu/) for testing. To run the tests, use the following command:

```bash
pnpm test
```

### Disclaimer
Tests implemented are not strict as endpoints may work differently for different schools. The tests **only** check if the endpoints return valid data, but not schema-validated data.

As a result, if a test fails, this may be due to the fact **that the endpoint is not available for the school** you are testing with, or the endpoint returns different data (although unlikely).

## Linting & Formatting

This project uses ESLint and Prettier for linting and formatting. Please lint and format your code before submitting a pull request.

```bash
pnpm lint # For linting
pnpm format # For formatting
```


## Code of Conduct

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions with this project.



