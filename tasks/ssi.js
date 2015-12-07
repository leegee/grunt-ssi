/*
 * grunt-ssi
 * https://github.com/lee/grunt-ssi
 *
 * Copyright (c) 2015 Lee Goddard
 * Licensed under the MIT license.
 */

'use strict';

/*
    Process simple <!--#include virtual='file.html' --> directives.

    Does not parse the included file for includes.

    Does not cache anything.
*/

var fs   = require('fs'),
    path = require('path');

var RE = /<!--#include\s+virtual\s*=\s*(?!-->)(.+?)\s*-->/ig;

function SsiConverter (args) {
    this.documentRoot = args.documentRoot;
}

SsiConverter.prototype.convert = function (filePath) {
    var name,
        self = this,
        root = path.dirname( filePath );
    this.html = fs.readFileSync(filePath, "utf8");
    // this.documentRoot

    this.html.match(RE).forEach( function (matchedSsi){
        var m, includePath;
        if ((m = matchedSsi.match(/'(.+)'/)) !== null){
            includePath = m[1];
        }
        else if ((m = matchedSsi.match(/"(.+)"/)) !== null){
            includePath = m[1];
        }
        else {
            includePath = matchedSsi.match( /=\s*(\S+)-->\s*$/ );
        }

        includePath = path.resolve( path.join( root, includePath ));
        var includeHtml = fs.readFileSync(includePath, "utf8");
        // // Change this to parse the include for SSIs, maybe caching:
        this.html = this.html.replace( matchedSsi, includeHtml, 'gi' );
    }, this);

    return this;
};

SsiConverter.prototype.save = function (path) {
    fs.writeFileSync(path, this.html);
    return this;
};



module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('ssi', 'Parse server-side includes to generate HTML', function() {
        var path = require('path');
        var done = this.async();
        var totalProcessed = 0;
        var converter = new SsiConverter({
            documentRoot: this.data.documentRoot || __dirname
        });

        this.files.forEach(function(files) {
            grunt.log.writeln('Processing ' + files.src.length + ' files.');
            files.src.forEach( function(file){
                var fileBits = path.parse(file);
                var destFile = path.join(
                    fileBits.dir, fileBits.name + '.html'
                );
                grunt.log.writeln('Now processing %s as %s:', file, destFile);
                converter.convert(file);
                converter.save(destFile);
                if (++totalProcessed === files.src.length) {
                    done(true);
                }
            });
        });
    });
};
