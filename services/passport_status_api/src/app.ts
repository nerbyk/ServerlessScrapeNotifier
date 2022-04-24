import AWS from 'aws-sdk';
import MidPassFetcher from './fetchers/MidPassFetcher';
import { getRequest, putRequest, dynamoDbData } from './helpers/dynamodb';
import passportStatus from './models/passportStatus';

AWS.config.update({ region: 'eu-central-1' });

export const lambdaHandler = async () => {
  const statusFetcher = new MidPassFetcher(process.env.APPLICATION_ID);
  const newStatusObject: passportStatus = await statusFetcher.getStatus();
  const oldStatusObject: dynamoDbData = await getRequest(newStatusObject.uid);

  if (oldStatusObject?.status === newStatusObject.status) 
    return { statusCode: 200, body: 'No Changes' };

  await putRequest({
    uid: newStatusObject.uid,
    status: newStatusObject.status,
    updatedAt: new Date().toUTCString()
  });

  return {
    statusCode: 200, body: JSON.stringify({ newStatusObject }),
  };
};

lambdaHandler()
