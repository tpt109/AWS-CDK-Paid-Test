import {App, Duration, Stack, StackProps} from "@aws-cdk/core";
import {DatabaseCluster,DatabaseClusterEngine,DatabaseInstance, DatabaseInstanceEngine, StorageType, ParameterGroup,} from '@aws-cdk/aws-rds';
import {ISecret, Secret} from '@aws-cdk/aws-secretsmanager';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import {InstanceClass, InstanceSize, InstanceType, Peer, SubnetType, Vpc} from "@aws-cdk/aws-ec2";
import ec2 = require('@aws-cdk/aws-ec2');

export interface RDSStackProps extends StackProps {
    vpc: Vpc;
}

export class RDSStack extends Stack {

    //secret1:secretsmanager.ISecret;
    readonly auroraPostgresRDSCluster: DatabaseCluster;
    readonly dbUser = 'admincluster';
    readonly dbSchema = 'paidtest';
    readonly dbPort = 5432;

    constructor(scope: App, id: string, props: RDSStackProps) {
        super(scope, id, props);

        // Place your resource definitions here
        //this.secret = Secret.fromSecretAttributes(this, '12345678', {
        //    secretArn: 'arn:aws:secretsmanager:ap-southeast-1:paidtest:secret:ImportedSecret-paidtest',
        //});

        //this.secret = new Secret(this, 'Secret');
      

    // Place your resource definitions here
    this.auroraPostgresRDSCluster = new DatabaseCluster(this, 'paidtestdb', {
        engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
        //engineVersion: '11.4',
        engineVersion: "11.6",
        clusterIdentifier: `auroraPostgresRdsDatabaseCluster`,
        masterUser: {
            username: this.dbUser,
            //password: new Secret.SecretValue("Admin12345?")
        },
        instanceProps: {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
            vpcSubnets: {
                subnetName:'rds'
            },
            parameterGroup: ParameterGroup.fromParameterGroupName(this, 'DBClusterParameterGroup', 'default.aurora-postgresql11'),
            vpc:props.vpc
        }
    });

   
    //this.secret1 = cluster.secret;

    }
}