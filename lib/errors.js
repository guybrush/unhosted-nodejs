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
    'user': 'Please specify the user'
    ,'keyPath': 'Please specify which key path you are setting'
    , 'value': 'Please specify a value for the key you are setting'
};

errors['GET'] = {
    'user': 'Please specify the user'
    ,'keyPath': 'Please specify which key path you are getting'
}

errors['SEND'] = {
    'user': 'Please specify the user'
    , 'keyPath': 'Please specify which key path you are setting'
    , 'value': 'Please specify a value for the key you\'re setting'
}

errors['RECEIVE'] = {
    'user': 'Please specify the user'
    , 'keyPath': 'Please specify which key path you are getting'
}

module.exports = errors