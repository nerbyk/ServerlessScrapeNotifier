import AWS from 'aws-sdk';
import MidPassFetcher from './fetchers/MidPassFetcher';
import { getRequest, putRequest } from './helpers/dynamodb';
import applicationStatusData from './models/applicationStatus';

AWS.config.update({ region: 'eu-central-1' });

export const lambdaHandler = async () => {
  const statusFetcher = new MidPassFetcher(process.env.APPLICATION_ID);
  const newStatusData: applicationStatusData = await statusFetcher.getStatus();
  const oldStatusData: applicationStatusData = await getRequest(newStatusData.uid);

  if (oldStatusData?.status !== newStatusData.status) {
    await putRequest(newStatusData)
  }
};

lambdaHandler()
