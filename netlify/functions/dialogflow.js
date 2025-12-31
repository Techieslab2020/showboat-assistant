const dialogflow = require("@google-cloud/dialogflow");

const client = new dialogflow.SessionsClient({
  credentials: {
    client_email: process.env.DF_CLIENT_EMAIL,
    private_key: process.env.DF_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    const sessionId = Date.now().toString();
    const sessionPath = client.projectAgentSessionPath(
      process.env.DF_PROJECT_ID,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "en",
        },
      },
    };

    const [response] = await client.detectIntent(request);
    const result = response.queryResult;

    // Extract buttons from custom payload
    let buttons = [];
    for (const msg of result.fulfillmentMessages || []) {
      if (msg.payload?.fields?.buttons?.listValue) {
        buttons = msg.payload.fields.buttons.listValue.values.map(v => ({
          text: v.structValue.fields.text.stringValue,
          postback: v.structValue.fields.postback.stringValue,
        }));
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: result.fulfillmentText,
        buttons,
      }),
    };
  } catch (err) {
    console.error("Dialogflow error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
