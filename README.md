# grunt-ssi

> Parse very basic server-side includes to generate HTML

Supports virtual includes:

    <!--#include virtual="header.shtml" -->
    <!--#include file="header.shtml" -->

Supports variables — but ignores any 'encoding' attribute:

    <!--#echo encoding="none" var="avariable" -->
    <!--#echo var="avariable" -->

Quotation characters may be `'` or `"`.

All encodings are expected to be UTF-8.

By default, files are output alongside input, using the extension supplied in the `ext` parameter (b default, `.html` — see below). Output files can be located elsewhere — see `toRoot` and `fromRoot` below.

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
      ext: '.html',
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

#### ext
Type: `String`
Default value: `.html`

A string value that is used as the extension for output files — should include a dot, if one is required.

#### fromRoot
Type: `String`

See `toRoot` below.

#### toRoot
Type: `String`

If `toRoot` and `fromRoot` are supplied, then the former is replaced in the latter to produce the path for the output file. For example:

```js
grunt.initConfig({
  ssi: {
    build: {
      src: ['test/fixtures/input/foo/1.shtml'],
      fromRoot: 'test/fixtures/input/',
      toRoot: 'test/fixtures/output/'
    }
  },
});
```

In the above example, the file `test/fixtures/input/foo/1.shtml` would be output to `test/fixtures/output/foo/1.shtml`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

