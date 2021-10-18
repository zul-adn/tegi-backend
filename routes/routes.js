'use strict'

const authMidlleware = require('./../middleware/mid_auth');
const TranslateController = require('./../controller/con_translate');
const BlenderBotController = require('./../controller/con_blenderbot');
const TextToSpeechController = require('./../controller/con_texttospeech');

const AuthController = require('./../controller/con_auth');

module.exports = function (app) {
    
    app.get('/', TranslateController.index);
    app.post('/detect', TranslateController.detect);
    app.post('/translate', TranslateController.translate);
    app.post('/getbotreply',  BlenderBotController.blenderbot);
    app.get('/botreset', BlenderBotController.blenderbotreset);
    app.post('/tts',  TextToSpeechController.tts);
    app.get('/gtts',  TextToSpeechController.gtts);

    app.post('/createuser', AuthController.createuser);
    app.post('/login', AuthController.login);

}

