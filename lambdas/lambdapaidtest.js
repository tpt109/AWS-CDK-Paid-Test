const AWS = require('aws-sdk');
var rdsdataservice = new AWS.RDSDataService();

exports.main = async function(event, context) {
  
  var sqlStatement = 'SELECT NOW();';

  // The Lambda environment variables for the Aurora Cluster Arn, Database Name, and the AWS Secrets Arn hosting the master credentials of the serverless db
  var DBSecretsStoreArn = process.env.PASSWORD;
  var DBAuroraClusterArn = process.env.ENDPOINT;
  var DatabaseName = process.env.DATABASE;
  
  const params = {
    awsSecretStoreArn: DBSecretsStoreArn,
    dbClusterOrInstanceArn: DBAuroraClusterArn,
    sqlStatements: sqlStatement,
    database: DatabaseName
  }

  try {
    let dbResponse = await RDS.executeSql(params)
    console.log(JSON.stringify(dbResponse, null, 2))
    
    return JSON.stringify(dbResponse)

  } catch (error) {
      console.log(error)
    return error
  }
}