/*global document*/
/*global XMLHttpRequest*/
/*global alert*/

var isValidEmail = function( text )
{
    var atIndex = text.indexOf( "@" );
    var periodIndex = text.indexOf( "." );
    
    if ( atIndex < 0 || periodIndex < 0 || atIndex > periodIndex )
    {
        return false;
    }
    
    return true;
};

var showResult = function( text )
{
    var results = document.getElementById( "responseDiv" );
    results.innerHTML = text;
    //setTimeout( function() { results.innerHTML = ""; }, 10000 );
};

var sendDeathNote = function()
{
    var toField = document.getElementById( "toField" );
    var fromField = document.getElementById( "fromField" );
    var subjectField = document.getElementById( "subjectField" );
    var bodyField = document.getElementById( "bodyField" );
    var timeoutField = document.getElementById( "timeoutField" );
    var sendButton = document.getElementById( "sendButton" );
    
    if ( !toField || !fromField || !subjectField || !bodyField )
    {
        alert( "WTF the site is broke you deleted the text fields?!?" );
        return;
    }
    
    if ( !toField.value )
    {
        showResult( "You didn't enter someone to Death Note in the to: field." );
        return;
    }
    
    if ( !fromField.value )
    {
        showResult( "You didn't enter someone to Death Note in the from: field." );
        return;
    }
    
    if ( !subjectField.value )
    {
        showResult( "You didn't enter anything into the subject: field." );
        return;
    }
    
    if ( !bodyField.value )
    {
        showResult( "You didn't enter anything into the body: field." );
        return;
    }
    
    if ( !isValidEmail( toField.value ) )
    {
        showResult( "You didn't enter a valid email in the to: field." );
        return;
    }
    
    if ( !isValidEmail( fromField.value ) )
    {
        showResult( "You didn't enter a valid email in the from: field." );
        return;
    }
    
    var params =
    {
        to: toField.value,
        from: fromField.value,
        subject: subjectField.value,
        body: bodyField.value
    };
    
    if ( timeoutField.value )
    {
        params.timeout = Number( timeoutField.value );
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if ( xhr.readyState === 4 )
        {
            showResult( xhr.responseText );
            sendButton.disabled = false;
        }
    };
    
    xhr.open( "POST", "deathNote" );
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send( JSON.stringify( params ) );
    
    sendButton.disabled = true;
    showResult( "Sending death note..." );
};