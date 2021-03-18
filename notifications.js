// notifications.js
const aws = require('aws-sdk')
const sns = new aws.SNS({ region: `${process.env.REGION}` })

function generateResponse (code, payload) {
  console.log(payload)
  return {
    statusCode: code,
    body: JSON.stringify(payload)
  }
}

async function publishToSnsTopic (data) {
  const params = {
    Message: JSON.stringify(data),
    TopicArn: `arn:aws:sns:${process.env.REGION}:${process.env.ACCOUNT_ID}:payment-notification-topic`
  };
  return sns.publish(params).promise();
}

module.exports.handler = async (event) => {
  const data = JSON.parse(event.body)
  console.log(data);
  const paymentTransaction = {
    "status": data.status,
    "isActive": data.paymentData.transactions[0].isActive,
    "transactionId": data.paymentData.transactions[0].transactionId,
    "merchantName": data.paymentData.transactions[0].merchantName,
    "payments": data.paymentData.transactions[0].payments[0]
  }

  try {
    const metadata = await publishToSnsTopic(paymentTransaction);
    return generateResponse(200, {
      message: 'Successfully added the payment.',
      data: metadata
    })
  } catch (err) {
    console.log('Error: ', err);
    return generateError(500, new Error('Couldn\'t add the payment due to an internal error.'))
  }
}