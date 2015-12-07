/*
 * grunt-ssis
 * https://github.com/lee/grunt-ssis
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

var includesRE  = /<!--#include\s+(file|virtual)\s*=\s*(?!-->)(.+?)\s*-->/ig,
    variablesRE = /<!--#set\s+var\s*=\s*(?!-->)(.+?)\s*-->/ig,
    echoesRE    =  /<!--#echo\s+(?!-->)(.+?)\s*-->/ig
;


function SsiConverter (args) {
    this.documentRoot = args.documentRoot;
}

SsiConverter.prototype.convert = function (filePath, variables) {
    var name,
        self = this,
        thisDir = path.dirname( filePath ),

        html = fs.readFileSync(filePath, "utf8"),

        includeMatches  = html.match(includesRE) || [],
        variableMatches = html.match(variablesRE) || [],
        echoMatches     = html.match(echoesRE) || []
    ;

    variables = variables || {};

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

        var dir = path.isAbsolute(includePath)? this.documentRoot : thisDir;

        includePath = path.resolve( path.join( dir, includePath ));

        var includeHtml = this.convert( includePath, variables );

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

    grunt.registerMultiTask('ssis', 'Parse server-side includes to generate HTML', function() {
        var path = require('path');
        var done = this.async();
        var totalProcessed = 0;
        var converter = new SsiConverter({
            documentRoot: path.resolve(this.data.documentRoot || './' )
        });
        var ext = this.data.ext || '.html';

        this.files.forEach(function(files) {
            grunt.verbose.writeln('Processing ' + files.src.length + ' files.');
            files.src.forEach( function(file){
                var fileBits = path.parse(file);
                var destFile = path.join(
                    fileBits.dir, fileBits.name + ext
                );
                grunt.verbose.write('Now processing %s as %s:', file, destFile);
                var html = converter.convert(file);
                converter.save(destFile, html);
                grunt.verbose.write( " - done.\n");
                if (++totalProcessed === files.src.length) {
                    done(files);
                }
            });
        });
    });
};
