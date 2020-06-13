# Welcome cdk type script project!
## Infrastructure
![Alt text](img/paid-test-cdk-architecture.png?raw=true "infrastructure")
## How to run
* $ `npm i`  install node module 
* $ `npm run` build && cdk synth compile typescript to js and emits the synthesized CloudFormation template
* $ cd ~/.aws && vi config
[profile cdk]
aws_access_key_id= cdk_ACCESS_KEY_ID
aws_secret_access_key= cdk_SECRET_ACCESS_KEY
region=eu-west-1
* $ `cdk deploy --profile cdk` deploy all of stack to aws 
