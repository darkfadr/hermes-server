# Base Api

This is the sample service to use as a starting point for building an API with node.js

## Getting Started
1. Create a `.env` file similar to the `.env.sample` file for RabbitMQ.
2. Run the below commands
```sh
$ npm install
$ npm start
```
### Prerequisites
- Requires Node version 6.11 or greater installed

## Running the tests

```sh
$ npm test

# to execute test on file changes
$ npm run test:watch
```

## What does this do



## Deployment
In order to leverage the latest language features, we are using Babel to transpile our code to ES5 in order to ensure backwards compatibility with older versions of node.js.

```sh
npm run build
```
* On Linux/Unix
  * Use a process manager to serve up the application. `pm2` or `forever`
* On Windows Server
  * If the application is being run on a windows server, `iismode` is a required dependency that would need to be installed on that machine. Include the `iisnode.yml` and `Web.config` so that IIS can serve the app



## Built With
* [node](https://nodejs.org/en/)

## Contributing
Send us a pull request on [bitbucket]

## Versioning
We use [SemVer](guide/how-tos/versioning.md) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors
* Ashley Narcisse
