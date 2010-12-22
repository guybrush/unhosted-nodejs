/**
 * Error messages
 */

var errors = {};
errors['_NO_REFERER'] = 'This url is an unhosted JSON storage, and only works'
    + ' over CORS-AJAX. Please access using the unhosted JS library'
    + ' (www.unhosted.org).';

errors['_PROTOCOL'] = 'Please specify the protocol version';
errors['_INVALID_JSON'] = 'The "cmd" key in your POST does not seem to be'
    + ' valid JSON';
errors['_NO_METHOD'] = 'Please define a method inside your command';

errors['SET'] = {
    'chan': 'Please specify which channel you want to publish on'
    ,'keyPath': 'Please specify which key path you are setting'
    , 'value': 'Please specify a value for the key you are setting'
};

errors['GET'] = {
    'chan': 'Please specify which channel you want to get a (key, value)-pair'
        + ' from'
    ,'keyPath': 'Please specify which key path you are getting'
}

errors['SEND'] = {
    'chan': 'Please specify which channel you want to send your message to'
    , 'keyPath': 'Please specify which key path you are setting'
    , 'value': 'Please specify a value for the key you\'re setting'
}

errors['RECEIVE'] = {
    'chan': 'Please specify which channel you want to retrieve messages from'
    , 'keyPath': 'Please specify which key path you are getting'
    , 'delete': 'Please specify whether you also want to delete the entries'
        + ' you retrieve'
}

module.exports = errors