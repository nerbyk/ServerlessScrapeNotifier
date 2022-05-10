import MidPassFetcher from './fetchers/MidPassFetcher';
import { DBClient } from './helpers/DBClient';
import applicationStatusData from './models/applicationStatus';

export const lambdaHandler = async (event) => {
  const applicationId = event.applicationId || process.env.APPLICATION_ID;

  const statusFetcher = new MidPassFetcher(applicationId);
  const dbClient = new DBClient('eu-central-1');

  const newStatus: Promise<applicationStatusData> = new Promise((resolve) =>
    resolve(statusFetcher.getStatus())
  );
  const oldStatus: Promise<applicationStatusData> = new Promise((resolve) =>
    resolve(dbClient.getRequest(applicationId))
  );

  const [newStatusResult, oldStatusResult] = await Promise.all([
    newStatus,
    oldStatus,
  ]);

  if (oldStatusResult?.status !== newStatusResult.status)
    await dbClient.putRequest(newStatusResult);
};

lambdaHandler({});