import express from 'express';
import * as dotenv from 'dotenv';
const app = express();
import cors from 'cors';
import morgan from 'morgan';
import bodyparser from 'body-parser';
import OpenAI from 'openai';
dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const corsOptions = {
    origin: 'http://localhost:5173', // URL of your frontend
    optionsSuccessStatus: 200
};

app.use(bodyparser.json());
app.use(cors(corsOptions));
app.use(morgan('tiny'));

app.get('/api/get-recipe', (req, res) => {
    res.send('backend')
})

app.post('/api/get-recipe', async (req, res) => {
    const { diet } = req.body;
    console.log(diet)
    const prompt = `Provide a ${diet} recipe in JSON format with keys of name, servings, ingredients array with quantity,measurement, and instruction (i.e. chopped, diced, etc.) and instructions string array. Also include a common image URL of the dish that is known to be valid and publicly accessible`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_tokens: 1500,
            n: 1,
            stop: null,
            temperature: 0.6,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" }
        });

        const recipe = response.choices.map(choice => choice.message.content);
        const parsedRecipe = JSON.parse(recipe);
        res.json({ recipe: parsedRecipe });
        console.log(parsedRecipe);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Error fetching recipes');
    }
});





const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening to Andre ${port}`)
}); 

export default app; 
