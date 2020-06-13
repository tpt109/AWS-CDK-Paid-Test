#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import {VpcStack} from "../lib/vpc-stack";
import {ApplicationStack} from "../lib/application-stack";
import {RDSStack} from "../lib/rds-stack";

const app = new cdk.App();
const vpcStack  = new VpcStack(app, 'VpcStack');

const rdsStack = new RDSStack(app, 'RDSStack', {
    vpc: vpcStack.vpc
});

new ApplicationStack(app, 'ApplicationStack', {
    vpc: vpcStack.vpc,
    inboundDbAccessSecurityGroup:  rdsStack.auroraPostgresRDSCluster.connections.securityGroups[0].securityGroupId,
    rdsEndpoint: rdsStack.auroraPostgresRDSCluster.clusterEndpoint.hostname,
    rdsDbUser: rdsStack.dbUser,
    rdsDb: rdsStack.dbSchema,
    rdsPort: rdsStack.dbPort
});

app.synth();
