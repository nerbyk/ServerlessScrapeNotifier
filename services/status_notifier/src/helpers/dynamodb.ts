import applicationStatusData from '../models/applicationStatus';

export function serializeDynamodbRecord(record): applicationStatusData {
  const data = record.dynamodb.NewImage;

  return {
    uid: data.uid.S,
    status: data.status.S,
    internalStatus: data.internalStatus.S,
    percent: data.percent.N,
    createdAt: data.createdAt.S,
    updatedAt: data.updatedAt.S,
  };
}
