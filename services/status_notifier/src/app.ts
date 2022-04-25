import AWS from 'aws-sdk';
import applicationStatusData from './models/applicationStatus';
import TelegramNotifier from './notifiers/telegramNotifier';

AWS.config.update({ region: 'eu-central-1' });

export const lambdaHandler = async () => {
  const passportStatus = new AWS.Lambda();

  const params = {
    FunctionName: 'application_status_api',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{}'
  };

  const response = await passportStatus.invoke(params).promise();
  const payload = JSON.parse(response.Payload.toString());

  if (payload.statusCode !== 200 || !payload.body.changed) return;

  const applicationStatus = JSON.parse(payload.body.applicationStatus) as applicationStatusData;

  const notifier = new TelegramNotifier(applicationStatus);
  await notifier.notifyClient();
};

lambdaHandler();
