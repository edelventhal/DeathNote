/*global console*/
/*global require*/
/*global module*/
/*global __dirname*/
var morgan = require( "morgan" );
var bodyParser = require( "body-parser" );
var express = require( "express" );
var app = express();
var http = require( "http" ).createServer( app );
var fs = require( "fs" );

var DeathNote = require( "./deathNote.js" ).DeathNote;

//call this to do everything
var Server = module.exports.Server =
{
    launchData: null,
    
    runServer: function( cb )
    {
        this.configServer();
        this.setupRouting();
        this.startServer( cb );
    },

    configServer: function()
    {
        //support JSON, urlencoded, and multipart requests
        app.use( bodyParser.json( { extended: true } ) );

        //log the requests using morgan
        app.use( morgan( "combined" ) );

        //specify the Jade views folder
        app.set( "views", __dirname + "/views" );

        //set the view engine to Jade
        app.set( "view engine", "jade" );

        //specify static content
        app.use( express[ "static" ]( "public", __dirname + "/../public" ) ); //using map-access of static so jslint won't bitch
    },

    setupRouting: function()
    {
        //for GET, render the index
        app.get( "/", function( request, response )
        {
            //pass in all the games we support to populate a combo box
            response.render( "index" );
        }.bind( this ) );
        
        //a nice generic way of handling POST requests, splits them into functions by type
        app.post( "/deathNote", function( request, response )
        {            
            //we use the type to decide how to respond, so it must exist
            var data = request.body;
            
            this._doDeathNote( data, function( response, responseData )
            {
                if ( !responseData )
                {
                    response.status( 200 ).json();
                }
                else
                {
                    if ( responseData.error )
                    {
                        response.status( 500 ).json( responseData.error );
                    }
                    else
                    {
                        response.status( 200 ).json( responseData.msg );
                    }
                }
            }.bind( this, response ) );
        }.bind( this ) );
    },

    startServer: function( cb )
    {
        //app.listen( app.get( "port" ), app.get( "ipaddr" ), function()
        http.listen( 12000, "127.0.0.1", function()
        {
            console.log( "Server is started." );
        
            if ( cb )
            {
                cb();
            }
        } );
    },
    
    _doDeathNote: function( data, cb )
    {
        console.log( "Got Death Note data: " + JSON.stringify( data ) );
        if ( !DeathNote.areValidParams( data ) )
        {
            cb( { error: "Invalid params sent. Expect an object with 'to', 'from', 'subject', and 'body' keys, and optionally a 'timeout' key." } );
        }
        
        DeathNote.sendDeathNote( data, cb );
    }
};

Server.runServer();
