// processPaymentNotification
module.exports.handler = async (event) => {    
    console.log('event: processPaymentNotification.js: ', event);

    const paymentTransaction = JSON.parse(event.Records[0].body);
    paymentTransaction.status = 'payment-approved';
  
    console.log(`The new status of the order is ${JSON.stringify(paymentTransaction)}.`);
    return paymentTransaction;
  }