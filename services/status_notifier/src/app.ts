import TelegramNotifier from './notifiers/TelegramNotifier';
import { serializeDynamodbRecord } from './helpers/dynamodb';

export const lambdaHandler = async (event) => {
  const statusData = serializeDynamodbRecord(event.Records[0]);

  const notifier = new TelegramNotifier(statusData);

  await notifier.notifyClient();
};
