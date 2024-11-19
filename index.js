import functions from '@google-cloud/functions-framework';

import { messagingApi } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;

import { callBot } from './agent.js';

const CHANNEL_ACCESS_TOKEN = 'jaVKUBa3VcyeKEQIBXKk5D7g6w8VsXkV7+FDNXw6L0bPV6zz7D/1Uct8SggG6eCwdmIIFGD8arpeBNhw0YZ/KLZFrmNZAvyN/NLQ+t0UMzoY7X2/DOcsGQJpRfntidK0E31erTNOGO6TI7slhNH2ngdB04t89/1O/w1cDnyilFU='
const CHANNEL_SECRET = '8e8f9d0866fa5c8896c266cee5b8f112'

// LINE configuration
const lineClient = new MessagingApiClient({
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
});


functions.http('lineWebhook', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const events = req.body.events;
    const event = events[0]
    // Only respond to messages
    if (event.type !== 'message' || event.message.type !== 'text') {
        console.warn(">>>>> event not support (skip)", event)
        return;
    }
    const lineId = event.source.userId
    const groupId = event.source.groupId
    const text = event.message.text

    lineClient.showLoadingAnimation({
      chatId: lineId,
      loadingSecond: 30
    })

    switch (text) {
      case "me": {
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages: [
            { type: 'text', text: `lineId=${lineId} groupId=${groupId}` }
          ]
        });
      }
      default: {
        const response = await callBot({ key: lineId, text });
        console.log({ userText: text, aiResponse: response })
        
        await lineClient.replyMessage({
          replyToken: event.replyToken,
          messages: [
            { type: 'text', text: response }
          ]
        });
      }
    }

    res.status(200).json({ok: 'Success' });
  } catch (error) {
    console.error('Error handling LINE webhook:', error);
    res.status(500).json({ msg: 'Internal Server Error', error });
  }
});

