import AWS from 'aws-sdk';
import MidPassFetcher from './fetchers/MidPassFetcher';
import { getRequest, putRequest, dynamoDbData } from './helpers/dynamodb';
import applicationStatusData from './models/applicationStatus';

AWS.config.update({ region: 'eu-central-1' });

export const lambdaHandler = async () => {
  const statusFetcher = new MidPassFetcher(process.env.APPLICATION_ID);
  const newStatusData: applicationStatusData = await statusFetcher.getStatus();
  const oldStatusData: dynamoDbData = await getRequest(newStatusData.uid);

  if (oldStatusData?.status === newStatusData.status)
    return {
      statusCode: 200,
      body: {
        changed: false,
        applicationStatus: { ...oldStatusData }
      }
    };

  await putRequest({
    uid: newStatusData.uid,
    status: newStatusData.status,
    updatedAt: new Date().toUTCString()
  });

  return {
    statusCode: 200,
    body: {
      changed: true,
      applicationStatus: JSON.stringify({ ...newStatusData })
    },
  };
};

lambdaHandler()
