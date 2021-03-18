// paymentsNotifications.js
const aws = require('aws-sdk');
const sqs = new aws.SQS({ region: `${process.env.REGION}` });

function generateResponse (code, payload) {
  console.log(payload)
  return {
    statusCode: code,
    body: JSON.stringify(payload)
  }
}

async function publishToSQS (data) {
    const params = {
        MessageBody: JSON.stringify(data),
        QueueUrl: process.env.PAYMENTS_NOTIFICATIONS_QUEUE
    };
    return sqs.sendMessage(params).promise();
  }

module.exports.handler = async (event) => {
    console.log('event: paymentsNotifications.js: ', event);
    const data = JSON.parse(event.Records[0].Sns.Message)
    try {
        const metadata = await publishToSQS(data);
        return generateResponse(200, {
          message: 'Successfully added the payment.',
          data: metadata
        });
      } catch (err) {
        console.log('Error: ', err);
        return generateError(500, new Error('Couldn\'t add the payment due to an internal error.'));
      }
  }