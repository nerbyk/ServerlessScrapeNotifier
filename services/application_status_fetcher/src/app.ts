import { MidPassFetcher, MidPassStatus } from './fetchers/midPassFetcher';
import { DBClient } from './helpers/DBClient';
import { ApplicationStatus } from './models/applicationStatus';


const statusFetcher = new MidPassFetcher();
const dbClient = new DBClient({ region: 'eu-central-1', tableName: process.env.TABLE_NAME });
const applicationId = process.env.APPLICATION_ID;

export const lambdaHandler = async () => {
  const newStatus: Promise<MidPassStatus> = statusFetcher.getStatus(applicationId);
  const oldStatus: Promise<ApplicationStatus> = dbClient.getRequest(applicationId);

  const [newStatusResult, oldStatusResult] = await Promise.all([
    newStatus,
    oldStatus,
  ]);

  if (oldStatusResult?.status !== newStatusResult?.status)
    await dbClient.putRequest(newStatusResult);
};
