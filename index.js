const AWS = require('aws-sdk');
const debug = require('debug')('awsPushSNS');


class SNSHelper {
    constructor(config) {
        console.log("config", config)
        this.messageAttributes = {};
        this.AWS_SNS_ARN_APNS = config.AWS_SNS_ARN_APNS;
        this.AWS_SNS_ARN_APNS_SANDBOX = config.AWS_SNS_ARN_APNS_SANDBOX;
        this.AWS_SNS_ARN_GCM = config.AWS_SNS_ARN_GCM;

        this.IS_ON_SERVER = config.IS_ON_SERVER;
        this.ENV = config.ENV;

        if (this.IS_ON_SERVER == null) {
            this.IS_ON_SERVER = this.ENV === 'production' || this.ENV === 'staging';
        }

        AWS.config.update({
            accessKeyId: config.SNS_KEY,
            secretAccessKey: config.SNS_SECRET,
            region: config.SNS_REGION
        });

        this.SNS = new AWS.SNS();

        this.getPlatformArn = (platform) => {
            return {
                APNS: config.AWS_SNS_ARN_APNS,
                APNS_SANDBOX: config.AWS_SNS_ARN_APNS_SANDBOX,
                GCM: config.AWS_SNS_ARN_GCM
            }[platform];
        };


        this.getMsgToSend = (platform, payload) => {
            return {
                APNS: {
                    default: 'message',
                    APNS: payload
                },
                APNS_SANDBOX: {
                    default: 'message',
                    APNS_SANDBOX: payload
                },
                GCM: {
                    default: 'message',
                    GCM: payload,
                    GCM_SANDBOX: payload
                }
            }[platform];
        };

    }

    setDefaultMessageAttributes(messageAttributes) {
        this.messageAttributes = messageAttributes;
    }

    async hello(props) {
        return await new Promise(resolve => {
            resolve('hello world')
        })
    }

    async pushNotification(props) {
        console.log("=== module pushNotification ===")
        let { platform, devicePlatform, deviceToken, message, notification, notifyCount, messageAttributes, title } = props;
        let result;
        let endpoint;
        let data;

        messageAttributes = {
            ...this.messageAttributes,
            ...messageAttributes
        };

        try {
            console.log("deviceToken", deviceToken);
            let platformArn = this.getPlatformArn(platform);

            if (platform.startsWith("APNS")) {
                data = {
                    aps: {
                        alert: {
                            "body": message,
                            ...title ? { title } : {},
                        },
                        sound: "default"
                    },
                    ...messageAttributes
                }
            } else if (platform.startsWith("GCM")) {
                data = {}
                if (devicePlatform == null) devicePlatform = "android";

                if (devicePlatform == "ios") {
                    data = {
                        // 'title': '123123',
                        'notification': {
                            'text': message,
                            ...title ? { title } : {},
                        },
                        'data': {}
                    }

                } else if (devicePlatform == "android") {
                    data = {
                        // 舊版 ＧCM 推播
                        // 'data': {
                        //     'message': message,
                        //     ...title ? { title } : {},
                        // }
                        'notification': {
                            'text': message,
                            ...title ? { title } : {},
                        },
                        'data': {
                            'message': message,
                            ...title ? { title } : {},
                        }
                    }
                }
                data.data = {
                    ...data.data,
                    ...messageAttributes
                }
            }

            /*
             * 非真實寄出，直接回傳假成功資訊
             * */
            if (this.IS_ON_SERVER === false) {
                console.info('---- 非 production mode, 不寄通知');
                return {
                    result: { success: 'fake result' },
                    message: data
                };
            }

            endpoint = await this.SNS.createPlatformEndpoint({
                PlatformApplicationArn: platformArn,
                Token: deviceToken,
            }).promise();
            debug('pushAPNS createPlatformEndpoint %j', endpoint);

            let payload = JSON.stringify(data);
            let msgToSend = this.getMsgToSend(platform, payload);
            console.log("=== payload ===", payload);
            // 參數參考 http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#publish-property
            let publishParams = {
                Message: JSON.stringify(msgToSend),
                MessageStructure: 'json',
                TargetArn: endpoint.EndpointArn
            };




            publishParams.MessageAttributes = messageAttributes;

            result = await this.SNS.publish(publishParams).promise();

            return {
                result: result,
                message: data,
                success: true
            };
        } catch (err) {
            debug('pushAPNS error %j', err);

            if (err.code === 'EndpointDisabled') {
                let data;
                let params = {
                    Attributes: {
                        Enabled: 'True'
                    },
                    EndpointArn: endpoint.EndpointArn
                };

                try {
                    data = await this.SNS.setEndpointAttributes(params).promise();
                    debug('pushAPNS setEndpointAttributes %j', data);
                    return {
                        result: { ...result, err },
                        message: data,
                        success: true
                    };
                } catch (e) {
                    debug('pushAPNS setEndpointAttributes error %j', e);
                    return {
                        result: { ...result, err, e },
                        message: data,
                        success: false
                    };
                }


            }
            return {
                result: { ...result, err },
                message: data,
                success: false
            };

            console.error(err);
        }
    }

    async pushNotificationBatch(props) {
        try {
            let that = this;
            let { messages, defaultAttributesData } = props;

            if (defaultAttributesData)
                this.setDefaultMessageAttributes(defaultAttributesData);

            let promises = messages.map((message) => {
                return that.pushNotification(message);
            });

            let results = await Promise.all(promises);
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SNSHelper;