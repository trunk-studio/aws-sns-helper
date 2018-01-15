# aws-sns-helper

sample

```
  let snsHelper = new SNSHelper(config);
  let props = {
    platform: "GCM",
    deviceToken: config.test.DEVICE_TOKEN,
    data: { "data": { "message": "test message" } } 
  }
  await snsHelper.pushNotification(props);  
```

npm install


```
npm install trunk-studio/aws-sns-helper
```

## License

MIT
