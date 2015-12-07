# grunt-ssi

> Parse server-side includes to generate HTML

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ssi --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ssi');
```

## The "ssi" task

### Overview
In your project's Gruntfile, add a section named `ssi` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ssi: {
    build: {
      documentRoot: '.',
      src: ['test/fixtures/1.shtml']
    }
  },
});
```

### Options

#### documentRoot
Type: `String`
Default value: `.`

A string value that is used as the base HTML directory of the server,
ala the Apache document root.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

