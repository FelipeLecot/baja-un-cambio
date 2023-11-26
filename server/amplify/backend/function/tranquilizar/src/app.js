/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


import OpenAI from "openai";

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
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
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Altera todos los mensajes recibidos para que sean mas tranquilos y no ofendan",
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

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
