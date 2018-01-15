module.exports = {
    // aws services
    IS_ON_SERVER: false,
    ENV: 'development',
    aws: {

        // SNS
        SNS_KEY: '',
        SNS_SECRET: '',
        SNS_REGION: '',

        /*
        * SNS 通知相關設定
        */
        AWS_SNS_ARN_APNS: '',
        AWS_SNS_ARN_APNS_SANDBOX: '',
        AWS_SNS_ARN_GCM: '',

    },
    test: {
        ANDROID_DEVICE_TOKEN: '',
        IOS_DEVICE_TOKEN_APNS: '',
        IOS_DEVICE_TOKEN_GCM: ''
    }
};
