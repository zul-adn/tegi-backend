'use strict'

const TranslateController = require('./../controller/con_translate');
const BlenderBotController = require('./../controller/con_blenderbot')

module.exports = function (app) {
    
    // app.route('/').get(MainController.index);
    // app.route('/detect').post(MainController.detect);
    app.route('/translate').post(TranslateController.translate)
    app.route('/getbotreply').post(BlenderBotController.blenderbot)
    app.route('/botreset').get(BlenderBotController.blenderbotreset)
}