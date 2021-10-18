
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


        // var subscriptionKey = AZURE_TRANSLATE_SUBSCRIPTION_KEY;
        // var endpoint = AZURE_TRANSLATE_ENDPOINT;
        // var location = AZURE_RESOURCE_LOCATION;

        // console.log(text)

        // axios({
        //     baseURL: endpoint,
        //     url: '/translate',
        //     method: 'post',
        //     headers: {
        //         'Ocp-Apim-Subscription-Key': subscriptionKey,
        //         'Ocp-Apim-Subscription-Region': location,
        //         'Content-type': 'application/json',
        //         'X-ClientTraceId': uuidv4().toString()
        //     },
        //     params: {
        //         'api-version': '3.0',
        //         'from': 'en',
        //         'to': ['ko']
        //     },
        //     data: [{
        //         'text': text
        //     }],
        //     responseType: 'json'
        // }).then(function (response) {
        //     res.json({
        //         "body": response.data[0].translations[0].text
        //     })
        // })

    } catch (error) {
        console.log(error)
    }
}