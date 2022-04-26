import AWS from 'aws-sdk';
import TelegramNotifier from './notifiers/TelegramNotifier';
import { serializeDynamodbRecord } from './helpers/dynamodb';

AWS.config.update({ region: 'eu-central-1' });

export const lambdaHandler = async (event) => {
  const statusData = serializeDynamodbRecord(event.Records[0]);

  const notifier = new TelegramNotifier(statusData);

  await notifier.notifyClient();
};
