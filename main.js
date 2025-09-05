import express, { response } from 'express'
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import url, { fileURLToPath } from 'node:url';
import env from 'dotenv';

env.config() // inicializar arquivo .env


//Constant variables
const APP = express();
const PORT = 3501;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_KEY = process.env.KEY 




// Middlewares
APP.use(express.urlencoded({extended: true}));
APP.use(express.static(__dirname + "/public"));


//Functions 
const ai = new GoogleGenAI({ apiKey: API_KEY});

async function main(input) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: input,
  });
  console.log(response.text);
}





// Request routes
APP.get('/main', (req,res)=>{
    res.render('main.ejs', {});
});

APP.post('/main', async (req,res)=>{

  await main(req.body.UserInput)
  res.render("main.ejs", {})

} )



//Initialize server
APP.listen(PORT, (err)=>{
    console.log(`App listing on port ${PORT}!`);
    console.log(API_KEY);
    if (err){
        console.log(err)
    };
});


