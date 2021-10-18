const { default: axios } = require("axios")
require('dotenv').config();

const ENDPOINT = process.env.BLENDERBOTAPI

exports.blenderbot = (req, res) => {
    try {
        let {text} = req.body
        console.log(text)
        axios.post(`${ENDPOINT}/add_input`,{
            'text' : text
        }).then(response => {
            console.log(response)
            res.json({
                "data" : response.data
            })
        }) 

    } catch (error) {
        
    }
}

exports.blenderbotreset = (req, res) => {
    try {
        let {text} = req.body
        console.log(text)
        axios.post(`${ENDPOINT}/reset`).then(response => {
            console.log(response)
            res.json({
                "data" : response.data
            })
        }) 

    } catch (error) {
        
    }
}