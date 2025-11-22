import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

interface BackendStackProps extends cdk.StackProps {
  environment: 'dev' | 'prod';
}

export class BackendStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { environment } = props;

    // Create Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `soul-ink-users-${environment}`,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: environment === 'dev' ? 6 : 8,
        requireLowercase: environment === 'prod',
        requireUppercase: environment === 'prod',
        requireDigits: environment === 'prod',
        requireSymbols: environment === 'prod',
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: environment === 'dev'
        ? cdk.RemovalPolicy.DESTROY
        : cdk.RemovalPolicy.RETAIN,
    });

    // Create User Pool Client
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      userPoolClientName: `soul-ink-client-${environment}`,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      preventUserExistenceErrors: true,
    });

    // Create Lambda function for echo endpoint
    const echoFunction = new lambdaNodejs.NodejsFunction(this, 'EchoFunction', {
      functionName: `soul-ink-echo-${environment}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, '../src/lambda/echo.ts'),
      bundling: {
        minify: environment === 'prod',
        sourceMap: true,
        externalModules: ['@aws-sdk/*'],
      },
      environment: {
        ENVIRONMENT: environment,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Create API Gateway
    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: `soul-ink-api-${environment}`,
      description: `Soul Ink API - ${environment}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'Authorization',
          'X-Amz-Date',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
        allowCredentials: true,
      },
      deployOptions: {
        stageName: environment,
        throttlingRateLimit: environment === 'dev' ? 100 : 1000,
        throttlingBurstLimit: environment === 'dev' ? 200 : 2000,
      },
    });

    // Create Cognito authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'CognitoAuthorizer',
      {
        cognitoUserPools: [this.userPool],
        authorizerName: `soul-ink-authorizer-${environment}`,
      }
    );

    // Create /echo endpoint
    const echo = this.api.root.addResource('echo');
    echo.addMethod('POST', new apigateway.LambdaIntegration(echoFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // CloudFormation Outputs
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `${this.api.url}echo`,
      description: 'Echo API Endpoint',
    });

    // Add tags
    cdk.Tags.of(this).add('Environment', environment);
    cdk.Tags.of(this).add('Project', 'SoulInk');
  }
}
