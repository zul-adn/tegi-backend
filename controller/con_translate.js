
const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const CREDENTIAL = JSON.parse(process.env.CREDENTIALS_GCP)
const AZURE_TRANSLATE_SUBSCRIPTION_KEY = process.env.AZURE_TRANSLATE_SUBSCRIPTION_KEY
const AZURE_TRANSLATE_ENDPOINT = process.env.AZURE_TRANSLATE_ENDPOINT
const AZURE_RESOURCE_LOCATION = process.env.AZURE_RESOURCE_LOCATION

const translate = new Translate({
    credentials: CREDENTIAL,
    projectId: CREDENTIAL.project_id
})


exports.index = async (req, res) => {
    try {
        res.json({
            'status': "Welcome to Tegi.ai API"
        })
    } catch (error) {
        console.log(error)
    }
}

exports.detect = async (req, res) => {
    try {
        let { text } = req.body
        let response = await translate.detect(text)
        res.json({
            "body": response[1].data.detections[0][0].language
        })
    } catch (error) {
        console.log(error)
    }
}

exports.translate = async (req, res) => {
    try {

        let { text, target } = req.body

        console.log(target)

        const [translation] = await translate.translate(text, target);
        console.log(`Text: ${text}`);
        console.log(`Translation: ${translation}`);
        res.json({
            "body": translation
        })

    } catch (error) {
        console.log(error)
    }
}