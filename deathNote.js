/*global require*/
/*global module*/
/*global console*/
/*global process*/
/*global setTimeout*/

var fs = require( "fs" );
var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');
var transporter = nodemailer.createTransport(sendmailTransport({path:"/usr/sbin/sendmail"}));

var DeathNote = module.exports.DeathNote =
{
    sendEmail: function( to, from, subject, message, cb )
    {
        var mailOptions =
        {
            from: from,
            to: to,
            subject: subject,
            text: message,
            html:  message
        };

        // send mail with defined transport object
        transporter.sendMail( mailOptions, function(cb, error, info)
        {
            var result = {};
            if( error )
            {
                result = { error: error };
            }
            else
            {
                if ( info.response )
                {
                    result = { success: true, msg: "Message sent to " + to + ", from " + from + ": " + info.response };
                }
                else
                {
                    result = { success: true, msg: "Message sent to " + to + ", from " + from + "." };
                }
            }
            
            if ( result.error)
            {
                console.log( "ERROR: " + result.error );
            }
            else
            {
                console.log( "Success. " + result.msg );
            }
            
            if ( cb )
            {
                cb( result );
            }
        }.bind( this, cb ));
    },

    getMessage: function( messageLoc )
    {
        if ( messageLoc.lastIndexOf( ".html" ) === messageLoc.length - ".html".length )
        {
            return fs.readFileSync( messageLoc, "utf8" );
        }
        return messageLoc;
    },
    
    sendDeathNote: function( params, cb )
    {
        if ( !this.areValidParams( params ) )
        {
            if ( cb )
            {
                cb( { error: "Invalid params" } );
                return;
            }
        }
        
        if ( params.timeout )
        {
            var seconds = Number( params.timeout );
            var ms = Math.floor( seconds * 1000 );
            console.log( "Delaying for " + seconds + " seconds..." );
            setTimeout( function( params, cb )
                        {
                            this.sendEmail( params.to, params.from, params.subject, this.getMessage( params.body ), cb );
                        }.bind( this, params, cb ), ms );
        }
        else
        {
            this.sendEmail( params.to, params.from, params.subject, this.getMessage( params.body ), cb );
        }
    },
    
    areValidParams: function( params )
    {
        if ( !params )
        {
            return false;
        }
        
        if ( !params.to || !params.from || !params.subject || !params.body )
        {
            return false;
        }
        
        return true;
    }
};

//for executing from the command line
if ( process.argv.length >= 2 && process.argv[1] === "deathNote.js" )
{
    if ( process.argv.length < 6 )
    {
        console.log( "Usage: node deathNote.js <to> <from> <subject> <message> [timeout in seconds]" );
        //console.log( JSON.stringify( process.argv ) );
    }
    else
    {
        var deathNoteParams =
        {
            to: process.argv[ 2 ],
            from: process.argv[ 3 ],
            subject: process.argv[ 4 ],
            message: process.argv[ 5 ]
        };
        
        if ( process.argv.length >= 7 )
        {
            deathNoteParams.timeout = process.argv[6];
        }
        
        DeathNote.sendDeathNote( deathNoteParams );
    }
}