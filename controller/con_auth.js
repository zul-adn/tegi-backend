const db = require('../models/bundle.model');
const response = require('./../helper/response');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { Storage } = require('@google-cloud/storage');
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')

const CREDENTIAL = JSON.parse(process.env.CREDENTIALS_GCP_STORAGE)

const gc = new Storage({
    credentials: CREDENTIAL,
    projectId: CREDENTIAL.project_id
})

//============================================= CHECK EXISTING USER

const checkUserExist = async (payload) => {

    const { email,username} = payload

    const existUsers = await db.users.findOne({where: {email}})
    .catch(err => {
        console.log(err)
    })

    if(existUsers !== null ) return existUsers

    return false

}

//============================================= CREATE USER CONTROLLER

exports.createuser = async (req, res) => {

    const {
        email,
        username,
        password
    } = req.body

    //Create unique id
    const unique_id = `${username}-${uuidv4()}`;
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new db.users({
        email : email,
        username: username,
        password: hashedPassword,
        unique_id: unique_id
    })

    //Check if user exist
    const userExist = await checkUserExist(req.body)
    if(userExist) {
        return res.json({
            status : 0, 
            message : "Data exist"
        })
    }
    
    //Save user to database
    await newUser.save()
    .catch(err => {
        return res.json({
            message : err
        })
    })

    //Create Folder on Google Bucket
    await createFolderOnBucket(unique_id)
    .catch(err => {
        console.log(err)
    })

    res.json({
        status : 1, 
        message : "Success"
    })


}

//============================================= LOGIN CONTROLLER

exports.login = async (req, res) => {

    const { username,password } = req.body
    const getUser = await db.users.findOne({where: {username}});
    if(!getUser) return res.json({ message : "User does not exist" });

    try {
        if(await bcrypt.compare(password, getUser.password)){
            const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
            res.json({
                status : 1,
                accessToken,
                datas : {
                    username : username,
                    email: getUser.email,
                    unique_id: getUser.unique_id
                }
            })
        }else{
            res.json({
                status : 0,
            })
        }

    } catch (error) {
        
    }

  
}

//============================================= CREATE FOLDER CONTROLLER

const createFolderOnBucket = async (foldername) => {

    const filename = 'init.txt'
    const createFile = await gc.bucket(`tegiai-bucket`).upload(filename, {
        destination: `${foldername}/${filename}`
    });

    const url = createFile[0].metadata.selfLink;
    console.log(url)
    if (url !== '') {
       console.log("Folder success create")
    }

    return "sukses Membuat bucket"
}