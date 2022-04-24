import MidPassFetcher from "./fetchers/MidPassFetcher"
export const lambdaHandler = async () => {
  const statusFetcher = new MidPassFetcher(process.env.APPLICATION_ID);
  const newStatusObject = await statusFetcher.getStatus();
  return {
    statusCode: 200,
    body: JSON.stringify({
      newStatusObject
    }),
  };
}

lambdaHandler()
