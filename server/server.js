import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,OpenAIApi } from "openai";

dotenv.config();
let apiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
    apiKey
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",async(req,res)=>{
    res.status(200).send({
        message: "Hello from CodeX",
    })
});

app.post('/', async (req, res) => {
    if (!req.body.prompt) {
        return res.status(400).send({
            error: 'Missing `prompt` in request body.'
        });
    }

    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({err});
    }
});

app.listen(5000,()=> console.log('server is running on port https://localhost:5000'));