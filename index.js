import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express().use(bodyParser.json());

// let MY_TOKEN="Tech_titans";

// "start": "node --env-file .env index.js"

app.listen(process.env.PORT, () => {
  console.log(`wehook server is ready ${process.env.PORT}`);
});
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.MY_TOKEN) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  //i want some

  let body_param = req.body;

//   console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    // console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) 
    {
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let name = body_param.entry[0].changes[0].value.contacts[0].profile.name;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log(`from  ${from} \nname ${name} \nbody msg  ${msg_body}`

      axios({
        method: "POST",
        url: ` https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages?access_token=${process.env.TOKEN} `,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: `Hello ${name} \n we're tech titans, \n your message is  ${msg_body}`,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.sendStatus(200);
    } 
    else 
    {
      res.sendStatus(404);
    }
  }
});
