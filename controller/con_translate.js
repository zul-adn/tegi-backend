
const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const CREDENTIAL = JSON.parse(process.env.CREDENTIALS_GCP)

const translate = new Translate({
    credentials: CREDENTIAL,
    projectId: CREDENTIAL.project_id
})


exports.index = async (req, res) => {
    try {
        res.json({
            'status': "Welcome to TegiAI API"
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
            "body": response
        })
    } catch (error) {
        console.log(error)
    }
}

exports.translate = async (req, res) => {
    try {
        let { text, tolang } = req.body
        // let response = await translate.translate(text, tolang)
        // res.json({
        //     "body" : response[0]
        // })
        var subscriptionKey = "d35c8598684f491abdfad53a8064e347";
        var endpoint = "https://api.cognitive.microsofttranslator.com";

        // Add your location, also known as region. The default is global.
        // This is required if using a Cognitive Services resource.
        var location = "koreacentral";

        axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': 'en',
                'to': ['ko']
            },
            data: [{
                'text': text
            }],
            responseType: 'json'
        }).then(function (response) {
            res.json({
                "body": response.data[0].translations[0].text
            })
        })

    } catch (error) {
        console.log(error)
    }
}