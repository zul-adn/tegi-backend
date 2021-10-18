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
const {PythonShell} = require('python-shell')


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

    var filename = `${user}-${fpuuid}.mp3`;

    // var audioConfig = sdk.AudioConfig.fromAudioFileOutput(`/tmp/${filename}`);
    // var speechConfig = sdk.SpeechConfig.fromSubscription(AZURE_TTS_SUBSCRIPTION_KEY, AZURE_RESOURCE_LOCATION);

    // speechConfig.speechRecognitionLanguage = 'ko-KR';
    // speechConfig.speechSynthesisLanguage = 'ko-KR';

    // var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // synthesizer.speakTextAsync(text,
    //     function (result) {
    //         if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
    //             console.log("synthesis finished.");
    //             const upload = updloadToBucket(filename, user)
    //             res.json({
    //                 "status": "SUKSES"
    //             })
    //         } else {
    //             console.error("Speech synthesis canceled, " + result.errorDetails +
    //                 "\nDid you update the subscription info?");
    //         }
    //         synthesizer.close();
    //         synthesizer = undefined;
    //     },
    //     function (err) {
    //         console.trace("err - " + err);
    //         synthesizer.close();
    //         synthesizer = undefined;
    //     });

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
    console.log('Audio content written to file: output.mp3');

    //panggil python disini

    console.log("Now synthesizing to: " + filename);

}

//============================================= UPLOAD AUDIO FILE TO GOOGLE STORADGE

const updloadToBucket = async (filename, user) => {

    console.log("FORMATING....");

    // await formatFolder(user);

    console.log("UPLOADING....");

    let response
    const createFile = await gc.bucket(`tegiai-bucket`).upload(`/tmp/${filename}`, {
        destination: `${user}/${filename}`
    });

    const url = createFile[0].metadata.selfLink;
    // await gc.bucket('tegiai-bucket').file(filename).makePublic();
    console.log(url)
    fs.unlinkSync(`/tmp/${filename}`)
    if (url !== '') {

        response = {


            "status": "Success"
        }
    }

    return url
}

// const formatFolder = async (user) => {

//     let dirName = user;

//     let files = await gc.bucket(`tegiai-bucket`).getFiles();

//     let dirFiles = files.filter(f => f.id.includes(dirName + "/"))
//     // Delete the files
//     dirFiles.forEach(async file => {
//         await file.delete();
//     })

//     return
// }


exports.gtts = async (req, res) => {

      let options = {
        mode: 'text',
        // pythonPath: 'path/to/python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '/media/Wav2Lip/',
        args: ['--checkpoint_path', '/media/Wav2Lip/checkpoints/wav2lip.pth', '--face', '/media/assets/video.mp4', '--audio', '/media/assets/ko.mp3', '--resize_factor', '2', '--outfile', '/media/assets/result.mp4' ]
      };

    PythonShell.run(`inference.py`, options, function (err) {
        if (err) throw err;
        console.log('finished');
      });

    
    
    // const python = spawn('python', [`${process.cwd()}/controller/test.py`]);

    // python.stdout.on('data', function (data) {
    //     console.log(data);
    // });
    // // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    //     // send data to browser
    // });

}