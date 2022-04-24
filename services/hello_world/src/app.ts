import AWS from 'aws-sdk';
import MidPassFetcher from "./fetchers/MidPassFetcher"
import { getRequest, putRequest } from "./helpers/dynamodb"

AWS.config.update({ region: 'eu-central-1' });

export const lambdaHandler = async () => {
  const statusFetcher = new MidPassFetcher(process.env.APPLICATION_ID);
  const newStatusObject = await statusFetcher.getStatus();

  const oldStatusObject = await getRequest(newStatusObject.uid)

  return {
    statusCode: 200,
    body: JSON.stringify({
      newStatusObject
    }),
  };
}

lambdaHandler()
