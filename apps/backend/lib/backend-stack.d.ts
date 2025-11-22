import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
interface BackendStackProps extends cdk.StackProps {
    environment: 'dev' | 'prod';
}
export declare class BackendStack extends cdk.Stack {
    readonly userPool: cognito.UserPool;
    readonly userPoolClient: cognito.UserPoolClient;
    readonly api: apigateway.RestApi;
    constructor(scope: Construct, id: string, props: BackendStackProps);
}
export {};
