import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express().use(bodyParser.json());
import detect from "./keyword.js";

// let MY_TOKEN="Tech_titans";

// "start": "node --env-file .env index.js"

app.listen(process.env.PORT, () => {
  console.log(`wehook server is ready ${process.env.PORT}`);
});
app.get("/",(req,res)=>{
  console.log("Manvendra");
  
})
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


  let body = req.body;
  let Link=  ` https://graph.facebook.com/v13.0/${process.env.PHONE_NUMBER_ID}/messages?access_token=${process.env.TOKEN} `;



  if (body.object) {
    if (
      body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]
    ) {
       
  console.log(JSON.stringify(body, null, 1));
      let prev_msg_id= body.entry[0].changes[0].value.messages[0].id;
      axios({
        method: "POST",
        url: Link,
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: prev_msg_id,
        },
      });

      let from = body.entry[0].changes[0].value.messages[0].from;
      let name = body.entry[0].changes[0].value.contacts[0].profile.name;



      // let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
      // console.log(`from  ${from} \nname ${name} \nbody msg  ${msg_body}`);
      // let msg;
      // msg = detect(msg_body);

      let greeting = {
        messaging_product: "whatsapp",
        to: from,
        context: {
          message_id: prev_msg_id,
        },
        type: "template",
        template: {
          name: "greeting",
          language: {
            code: "en_GB",
            policy: "deterministic",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: `${name}`,
                },
              ],
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      };
      

      axios({
        method: "POST",
        url: Link,
        data: greeting,
        /*
         text: {
            body: msg
              ? msg
              : `Hello ${name} \nWe're tech titans, \nYour Message is > ${msg_body} `,
          },
        */
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});


