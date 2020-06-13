import {App, Duration, Stack, StackProps} from "@aws-cdk/core";
import {DatabaseCluster,DatabaseClusterEngine,DatabaseInstance, DatabaseInstanceEngine, StorageType, ParameterGroup} from '@aws-cdk/aws-rds';
import {ISecret, Secret} from '@aws-cdk/aws-secretsmanager';
import {InstanceClass, InstanceSize, InstanceType, Peer, SubnetType, Vpc} from "@aws-cdk/aws-ec2";

export interface RDSStackProps extends StackProps {
    vpc: Vpc;
}

export class RDSStack extends Stack {

    readonly secret: ISecret;
    readonly auroraPostgresRDSCluster: DatabaseCluster;
    readonly dbUser = 'admin';
    readonly dbSchema = 'paidtest';
    readonly dbPort = 5432;

    constructor(scope: App, id: string, props: RDSStackProps) {
        super(scope, id, props);

    // Place your resource definitions here
    this.secret = Secret.fromSecretAttributes(this, '12345678', {
        secretArn: 'arn:aws:secretsmanager:{region}:{organisation-id}:secret:ImportedSecret-paidtest',
    });
    
    this.auroraPostgresRDSCluster = new DatabaseCluster(this, 'aurora-postgres-cluster', {
        engine: DatabaseInstanceEngine.AURORA_POSTGRESQL,
        engineVersion: '11.4',
        clusterIdentifier: `auroraPostgresRdsDatabaseCluster`,
        defaultDatabaseName: this.dbSchema,
        masterUser: {
            username: this.dbUser,
            password: this.secret.secretValue
        },
        instanceProps: {
            vpc: props.vpc,
            vpcSubnets: {
                subnetName: "rds",
            },
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO)
        },
        parameterGroup: ParameterGroup.fromParameterGroupName(this, 'auroraPostgresRdsDatabaseParameterGroup', 'default.aurora-postgresql11.4'),
        storageEncrypted: false,
        port: this.dbPort
    });




    }
}