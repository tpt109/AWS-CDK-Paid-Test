import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import {Vpc,SecurityGroup} from '@aws-cdk/aws-ec2'
import {ISecret, Secret} from '@aws-cdk/aws-secretsmanager';
import {Duration, StackProps} from '@aws-cdk/core';

interface ApplicationStackProps extends cdk.StackProps {
    vpc: Vpc;
    inboundDbAccessSecurityGroup: string
    rdsEndpoint: string
    rdsDbUser: string
    rdsDb: string
    rdsPort: Number,
 }

export class ApplicationStack extends cdk.Stack {

  readonly lambdaRoleName = 'AuroraServerPaidTestLambdaRole';
    
  constructor(parent: cdk.App, id: string, props : ApplicationStackProps) {
    super(parent, id, props);
    
    const secret = Secret.fromSecretAttributes(this, '12345678', {
        secretArn: 'arn:aws:secretsmanager:{region}:{organisation-id}:secret:ImportedSecret-paidtest',
    });

    const lambdaRole = new iam.Role(this, this.lambdaRoleName, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
              iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonRDSDataFullAccess'),
              iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
          ]
      });

    const rdsLambda = ApplicationStack.createVpcLambda(this, 'rdsLambda', 'lambdapaidtest.main', props, secret,lambdaRole);

  }

  static createVpcLambda(context: any, name: string, handler: string, props: ApplicationStackProps, secret: ISecret,roleLambda: iam.Role): lambda.Function {
      
    const newLambda = new lambda.Function(context, name, {
        functionName: name,
        role:roleLambda,
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: handler,
        code: lambda.Code.asset("lambdas"),
        timeout: Duration.seconds(350),
        memorySize: 1024,
        vpc: props.vpc,
        vpcSubnets: {subnetName:'rds'},
        securityGroup: SecurityGroup.fromSecurityGroupId(context, 'inboundDbAccessSecurityGroup' + name, props.inboundDbAccessSecurityGroup),
        environment: {
            USERNAME: props.rdsDbUser,
            ENDPOINT: props.rdsEndpoint,
            DATABASE: props.rdsDb,
            PORT: props.rdsPort.toString(),
            PASSWORD: secret.secretValue.toString()
        }
    });

    return newLambda;
 }
}