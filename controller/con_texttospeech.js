"use strict";
const axios = require('axios');
require('dotenv').config();
var sdk = require("microsoft-cognitiveservices-speech-sdk");
const { Storage } = require('@google-cloud/storage')
var fs = require('fs');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const util = require('util')
const { spawn } = require('child_process');
// const { cwd } = require('process');
const { PythonShell } = require('python-shell');
const { response } = require('express');


const CREDENTIAL = JSON.parse(process.env.CREDENTIALS_GCP_STORAGE)

const gc = new Storage({
    credentials: CREDENTIAL,
    projectId: CREDENTIAL.project_id
})

const gtts = new TextToSpeechClient({
    credentials: CREDENTIAL,
    projectId: CREDENTIAL.project_id
})

const AZURE_TTS_SUBSCRIPTION_KEY = process.env.AZURE_TTS_SUBSCRIPTION_KEY;
const AZURE_RESOURCE_LOCATION = process.env.AZURE_RESOURCE_LOCATION

//============================================= CONVERT TEXT TO SPEECH

exports.tts = async (req, res) => {

    const { text, user, fpuuid } = req.body

    var filename = `${user}-${fpuuid}`;


    const request = {
        input: { text: text },

        voice: {
            languageCode: 'en-US',
            ssmlGender: 'NEUTRAL',
            name: 'en-US-Wavenet-F'
        },

        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await gtts.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`mp3/${filename}`, response.audioContent, 'binary');

    const w2lip = w2l(filename, user, res)


    console.log('Audio content written to file: output.mp3');

    //panggil python disini

    console.log("Now synthesizing to: " + filename);

}

//============================================= UPLOAD AUDIO FILE TO GOOGLE STORADGE

const updloadToBucket = async (filename, user, res) => {

    console.log("FORMATING....");

    // await formatFolder(user);

    console.log("UPLOADING....");

    let response
    const createFile = await gc.bucket(`tegiai-bucket`).upload(`/media/assets/${filename}.mp4`, {
        destination: `${user}/${filename}.mp4`
    });

    const url = createFile[0].metadata.selfLink;
    // await gc.bucket('tegiai-bucket').file(filename).makePublic();
    console.log(url)
    // fs.unlinkSync(`/media/tegi/${filename}`)
    if (url !== '') {
        res.json({
            status: 200,
            url: `https://storage.googleapis.com/tegiai-bucket/${user}/${filename}.mp4`
        })
    }
}

const w2l = async (file, user, res) => {

    console.log("Masuk sini")

    const ls = spawn('python3', ['/media/Wav2Lip/inference.py', '--checkpoint_path', '/media/Wav2Lip/checkpoints/wav2lip.pth', '--face', '/media/assets/video.mp4', '--audio', `/media/tegi-backend/mp3/${file}`, '--outfile', `/media/assets/${file}.mp4` , '--resize_factor', '2']);

    ls.stdout.on('data', (data) => {
        console.log(`stdout xxx: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr xxxx: ${data}`);
    });

    ls.on('close', (code) => {
        if(code === 0){
            const upload = updloadToBucket(file, user, res)
        }
    });

}