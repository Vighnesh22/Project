# [Scaling Agile Frameworks](https://scaling-agile-hub.sebis.in.tum.de/)

## Getting Started
This project is implemented using React using ES6, styled-components & Webpack
To get you started you can simply clone the [this project](https://oezguensi@bitbucket.org/oezguensi/sah.git) repository and install all its dependencies:

### Prerequisites

You need git to clone the [this project](https://oezguensi@bitbucket.org/oezguensi/sah.git)  repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test [recomender-system](https://oezguensi@bitbucket.org/oezguensi/sah.git). You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone the project

Clone the [recomender-system](https://oezguensi@bitbucket.org/oezguensi/sah.git)  repository using [git](http://git-scm.com/):

```bash
git clone https://oezguensi@bitbucket.org/oezguensi/sah.git
cd sah
```

### Install Dependencies

We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.com).

```bash
npm install
```

### Create a Bundle for the Application

This project use [webpack](https://github.com/webpack/webpack) for creating a bundle of the application and its dependencies

We have pre-configured `npm` to automatically run `webpack` so we can simply do:

```bash
npm run build
```

Behind the scenes this will call `webpack --config webpack.prod.js `.  After, you should find that you have one new folder in your project.

* `dist` - contains all the files of your application and their dependencies.

### Run the Application in a development environment 

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```bash
npm start
```

Now browse to the app at `http://localhost:8000/`.

### Deploy app to GitHub Pages

To deploy this app to defined GitHub Page (see link in the title of this doc), simply run:

```bash
npm run deploy
```