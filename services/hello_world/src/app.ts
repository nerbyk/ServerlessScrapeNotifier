export const lambdaHandler = async() => {
  return { 
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/html',
    },
    body:  'Hello World',
  }
}

lambdaHandler()
