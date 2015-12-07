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
    path = require('path')
;

var includesRE  = /<!--#include\s+virtual\s*=\s*(?!-->)(.+?)\s*-->/ig,
    variablesRE = /<!--#set\s+var\s*=\s*(?!-->)(.+?)\s*-->/ig,
    echoesRE    =  /<!--#echo\s+(?!-->)(.+?)\s*-->/ig
;


function SsiConverter (args) {
    this.documentRoot = args.documentRoot;
}

SsiConverter.prototype.convert = function (filePath, variables) {
    var name,
        self = this,
        root = path.dirname( filePath ),

        html = fs.readFileSync(filePath, "utf8"),

        includeMatches  = html.match(includesRE) || [],
        variableMatches = html.match(variablesRE) || [],
        echoMatches     = html.match(echoesRE) || []
    ;

    variables = variables || {};
    // this.documentRoot

    // Set vars
    variableMatches.forEach( function (matchedSsi){
        var m, name, value;
        if ((m = matchedSsi.match(/'(.+?)'.*?'(.+?)'/)) !== null){
            name = m[1];
            value = m[2];
        }
        else if ((m = matchedSsi.match(/"(.+?)".*?"(.+?)"/)) !== null){
            name = m[1];
            value = m[2];
        }
        variables[name] = value;
        html = html.replace( matchedSsi, '');
    });

    // Render vars
    echoMatches.forEach( function (matchedSsi){
        var m, name;
        if ((m = matchedSsi.match(/var\s*=\s*'(.+?)'/)) !== null){
            name = m[1];
        }
        else if ((m = matchedSsi.match(/var\s*=\s*"(.+?)"/)) !== null){
            name = m[1];
        }
        html = html.replace( matchedSsi, variables[name]);
    });

    includeMatches.forEach( function (matchedSsi){
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

        // var includeHtml = fs.readFileSync(includePath, "utf8");
        var includeHtml = this.convert( includePath, variables );

        // // Change this to parse the include for SSIs, maybe caching:
        html = html.replace( matchedSsi, includeHtml, 'gi' );
    }, this);

    return html;
};

SsiConverter.prototype.save = function (path, html) {
    fs.writeFileSync(path, html);
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
                var html = converter.convert(file);
                converter.save(destFile, html);
                if (++totalProcessed === files.src.length) {
                    done(true);
                }
            });
        });
    });
};
