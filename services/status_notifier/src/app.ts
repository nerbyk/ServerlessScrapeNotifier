import TelegramClient from './notifiers/telegramClient';
import { serializeDynamodbRecord } from './helpers/dynamodb';

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramClientId = process.env.TELEGRAM_CLIENT_ID;

export const lambdaHandler = async (event) => {
  const notifier = new TelegramClient(telegramToken);

  const statusData = serializeDynamodbRecord(event.Records[0]);

  await notifier.notifyClient(statusData, telegramClientId);
};
