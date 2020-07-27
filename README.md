# Repo

[![Downloads](https://img.shields.io/npm/dt/Backend.svg?style=flat-square)](https://npmjs.org/package/Backend) [![Version](https://img.shields.io/npm/v/Backend.svg?style=flat-square)](https://npmjs.org/package/Backend) [![XO code style](https://img.shields.io/badge/code%20style-XO-red.svg?style=flat-square)](https://github.com/xojs/xo) 

## Installation

Module available through the [npm registry](https://www.npmjs.com/). It can be installed using the [`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) or [`yarn`](https://yarnpkg.com/en/) command line tool.

```sh
# Yarn (Recomend)
yarn install
# NPM 
npm install --save
```

## Running

Create `.env`

```
BASIC_TOKEN01=TOKEN
BASIC_TOKEN02=TOKEN
PORT=3000
```

Add SSL certs in `/certs/`

```sh
yarn dev
# or
yarn start
```

## Tests

To run the test suite, first install the dependencies, then run `test`:

```sh
# Using Yarn
yarn test
```

## Dependencies

<details>
	<summary><a href="https://ghub.io/axios">axios</a>: Promise based HTTP client for the browser and node.js</summary>
	<b>Author</b>: Matt Zabriskie</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: ^0.19.2
</details>
<details>
	<summary><a href="https://ghub.io/body-parser">body-parser</a>: Node.js body parsing middleware</summary>
	<b>Author</b>: dougwilson</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: ^1.19.0
</details>
<details>
	<summary><a href="https://ghub.io/express">express</a>: Fast, unopinionated, minimalist web framework</summary>
	<b>Author</b>: TJ Holowaychuk</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: ^4.17.1
</details>
<details>
	<summary><a href="https://ghub.io/jsonfile">jsonfile</a>: Easily read/write JSON files.</summary>
	<b>Author</b>: JP Richardson</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: ^6.0.1
</details>
<details>
	<summary><a href="https://ghub.io/qs">qs</a>: A querystring parser that supports nesting and arrays, with a depth limit</summary>
	<b>Author</b>: hueniverse, ljharb, nlf</br>
	<b>License</b>: BSD-3-Clause</br>
	<b>Version</b>: ^6.9.4
</details>
<details>
	<summary><a href="https://ghub.io/uuid">uuid</a>: RFC4122 (v1, v4, and v5) UUIDs</summary>
	<b>Author</b>: broofa, ctavan, defunctzombie, vvo</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: ^8.2.0
</details>

## Dev Dependencies

<details>
	<summary><a href="https://ghub.io/env-cmd">env-cmd</a>: Executes a command using the environment variables in an env file</summary>
	<b>Author</b>: Todd Bluhm</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: 10.1.0
</details>
<details>
	<summary><a href="https://ghub.io/nodemon">nodemon</a>: Simple monitor script for use during development of a node.js app.</summary>
	<b>Author</b>: Remy Sharp</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: 2.0.4
</details>
<details>
	<summary><a href="https://ghub.io/xo">xo</a>: JavaScript/TypeScript linter with great defaults</summary>
	<b>Author</b>: Sindre Sorhus</br>
	<b>License</b>: MIT</br>
	<b>Version</b>: 0.30.0
</details>

## Contributors

Pull requests and stars are always welcome. For bugs and feature requests, please [create an issue](https://github.com/user/repo/issues). [List of all contributors](https://github.com/user/repo/graphs/contributors).

## License

[MIT](LICENSE)