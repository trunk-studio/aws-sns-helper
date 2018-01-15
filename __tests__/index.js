const SNSHelper = require('./../index')
const config = require('config');



test('ios apns sending message', async () => {
  
    let {
      AWS_SNS_ARN_APNS, 
      AWS_SNS_ARN_APNS_SANDBOX, 
      AWS_SNS_ARN_GCM,
      SNS_KEY,SNS_SECRET,
      SNS_REGION
    } = config.aws
  
    let {IS_ON_SERVER, ENV} = config;
  
    let constructorParams = {
      AWS_SNS_ARN_APNS, 
      AWS_SNS_ARN_APNS_SANDBOX, 
      AWS_SNS_ARN_GCM,
      SNS_KEY,SNS_SECRET,SNS_REGION, 
      IS_ON_SERVER, ENV
    }

    // if (config.get('env') === 'staging' || config.get('env') === 'development') {         
    //   awsPushSNS._awsPushSNS('APNS_SANDBOX', deviceToken, dataAPNS);     
    // }
    
    let snsHelper = new SNSHelper(constructorParams);
    let props = {
      platform: "APNS_SANDBOX",
      deviceToken: config.test.IOS_DEVICE_TOKEN_APNS,
      message: "test message",
      notification: "test notification",
      notifyCount: 0,
      messageAttributes: {
        //http://docs.aws.amazon.com/sns/latest/dg/SNSMessageAttributes.html#SNSMessageAttributes.DataTypes
        'hello': {
          DataType: 'String', /* required */
          StringValue: 'hi'
        },      
      }
    }
  
    let result = await snsHelper.pushNotification(props);  
    console.log("result", JSON.stringify(result, null, 2));
  
    // result = {
    //   "result": {
    //     "ResponseMetadata": {
    //       "RequestId": "01cda537-7f45-5aab-b5a1-f7aef5437b3a"
    //     },
    //     "MessageId": "8d68d961-185c-5686-9fa5-8bf8925a3717"
    //   },
    //   "message": {
    //     "data": {
    //       "message": "test message"
    //     }
    //   },
    //   "success": true
    // }
  
  })
  

test.only('fcm sending message', async () => {

  let {
    AWS_SNS_ARN_APNS, 
    AWS_SNS_ARN_APNS_SANDBOX, 
    AWS_SNS_ARN_GCM,
    SNS_KEY,SNS_SECRET,
    SNS_REGION
  } = config.aws

  let {IS_ON_SERVER} = config;

  let constructorParams = {
    AWS_SNS_ARN_APNS, 
    AWS_SNS_ARN_APNS_SANDBOX, 
    AWS_SNS_ARN_GCM,
    SNS_KEY,SNS_SECRET,SNS_REGION, 
    IS_ON_SERVER
  }
  
  let snsHelper = new SNSHelper(constructorParams);
  let props = {
    platform: "GCM",
    deviceToken: config.test.ANDROID_DEVICE_TOKEN,
    message: "test message",
    messageAttributes: {
      //http://docs.aws.amazon.com/sns/latest/dg/SNSMessageAttributes.html#SNSMessageAttributes.DataTypes
      'hello': {
        DataType: 'String', /* required */
        StringValue: 'hi'
      },      
    }
  }

  let result = await snsHelper.pushNotification(props);  
  console.log("result", JSON.stringify(result, null, 2));

  // result = {
  //   "result": {
  //     "ResponseMetadata": {
  //       "RequestId": "01cda537-7f45-5aab-b5a1-f7aef5437b3a"
  //     },
  //     "MessageId": "8d68d961-185c-5686-9fa5-8bf8925a3717"
  //   },
  //   "message": {
  //     "data": {
  //       "message": "test message"
  //     }
  //   },
  //   "success": true
  // }

})


test('fcm sending message', async () => {
  
  let {
    AWS_SNS_ARN_APNS, 
    AWS_SNS_ARN_APNS_SANDBOX, 
    AWS_SNS_ARN_GCM,
    SNS_KEY,SNS_SECRET,
    SNS_REGION
  } = config.aws

  let {IS_ON_SERVER} = config;

  let constructorParams = {
    AWS_SNS_ARN_APNS, 
    AWS_SNS_ARN_APNS_SANDBOX, 
    AWS_SNS_ARN_GCM,
    SNS_KEY,SNS_SECRET,SNS_REGION, 
    IS_ON_SERVER
  }
  
  let snsHelper = new SNSHelper(constructorParams);
  let props = {
    messages: [
      {
        platform: "GCM",
        deviceToken: config.test.ANDROID_DEVICE_TOKEN,
        message: "test message",
        messageAttributes: {
          
          'hello': {
            DataType: 'String', /* required */
            StringValue: 'hi'
          },      
        }
      }
    ],
    defaultMessageAttributes: {
      'hello': {
        DataType: 'String', /* required */
        StringValue: 'hi'
      },      
    }
  }

  let result = await snsHelper.pushNotificationBatch(props);

  console.log("result", JSON.stringify(result, null, 2));
  

  // result = [
  //   {
  //     "result": {
  //       "ResponseMetadata": {
  //         "RequestId": "be39876a-1efb-54b2-aa6a-d5f3975599e1"
  //       },
  //       "MessageId": "f3ad6d5c-8ed6-5f11-bc23-3fc50778f242"
  //     },
  //     "message": {
  //       "data": {
  //         "message": "test message"
  //       }
  //     },
  //     "success": true
  //   }
  // ]
})