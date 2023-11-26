import OpenAI from "openai";
import express from 'express';
import bodyParser from 'body-parser';
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const app = express()
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.setHeader('Access-Control-Allow-Methods', '*');
  next()
});

app.get('/tranquilizar', async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  const { text } = req.query;
  try {
    if (!text) throw new Error("No text provided");
    if (text.length > 500) throw new Error("Text too long");
    if (text.length < 1) throw new Error("Text too short");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Altera el mensaje recibido para que sea mas tranquilo y no ofenda a nadie. Por favor solo contesta con un mensaje y hacelo lo mas breve y consiso posible.",
        },
        {
          role: "user",
          content: text,
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 500,
      temperature: 0.9,
      top_p: 1,
    });

    if (!completion) throw new Error("No completion");
    
    res.send(`<p>${completion.choices[0].message.content}</p>`);
  }
  catch (e) {
    console.error(e)
    res.status(500);
  }
});

app.listen(3000, function() {
    console.log("App started")
});