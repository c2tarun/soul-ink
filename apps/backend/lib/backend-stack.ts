import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

interface BackendStackProps extends cdk.StackProps {
  environment: 'dev' | 'prod';
}

export class BackendStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly api: apigateway.RestApi;
  public readonly notesTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { environment } = props;

    // Create DynamoDB table for notes
    this.notesTable = new dynamodb.Table(this, 'NotesTable', {
      tableName: `soul-ink-notes-${environment}`,
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: environment === 'prod',
      removalPolicy: environment === 'dev'
        ? cdk.RemovalPolicy.DESTROY
        : cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for sorting by updatedAt
    this.notesTable.addGlobalSecondaryIndex({
      indexName: 'ByUpdatedAt',
      partitionKey: {
        name: 'GSI_PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI_SK',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

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

    // Create Lambda functions for notes CRUD
    const listNotesFunction = new lambdaNodejs.NodejsFunction(
      this,
      'ListNotesFunction',
      {
        functionName: `soul-ink-list-notes-${environment}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/lambda/notes/list.ts'),
        bundling: {
          minify: environment === 'prod',
          sourceMap: true,
          externalModules: ['@aws-sdk/*'],
        },
        environment: {
          TABLE_NAME: this.notesTable.tableName,
        },
        timeout: cdk.Duration.seconds(30),
      }
    );

    const getNoteFunction = new lambdaNodejs.NodejsFunction(
      this,
      'GetNoteFunction',
      {
        functionName: `soul-ink-get-note-${environment}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/lambda/notes/get.ts'),
        bundling: {
          minify: environment === 'prod',
          sourceMap: true,
          externalModules: ['@aws-sdk/*'],
        },
        environment: {
          TABLE_NAME: this.notesTable.tableName,
        },
        timeout: cdk.Duration.seconds(30),
      }
    );

    const createNoteFunction = new lambdaNodejs.NodejsFunction(
      this,
      'CreateNoteFunction',
      {
        functionName: `soul-ink-create-note-${environment}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/lambda/notes/create.ts'),
        bundling: {
          minify: environment === 'prod',
          sourceMap: true,
          externalModules: ['@aws-sdk/*'],
        },
        environment: {
          TABLE_NAME: this.notesTable.tableName,
        },
        timeout: cdk.Duration.seconds(30),
      }
    );

    const updateNoteFunction = new lambdaNodejs.NodejsFunction(
      this,
      'UpdateNoteFunction',
      {
        functionName: `soul-ink-update-note-${environment}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/lambda/notes/update.ts'),
        bundling: {
          minify: environment === 'prod',
          sourceMap: true,
          externalModules: ['@aws-sdk/*'],
        },
        environment: {
          TABLE_NAME: this.notesTable.tableName,
        },
        timeout: cdk.Duration.seconds(30),
      }
    );

    const deleteNoteFunction = new lambdaNodejs.NodejsFunction(
      this,
      'DeleteNoteFunction',
      {
        functionName: `soul-ink-delete-note-${environment}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../src/lambda/notes/delete.ts'),
        bundling: {
          minify: environment === 'prod',
          sourceMap: true,
          externalModules: ['@aws-sdk/*'],
        },
        environment: {
          TABLE_NAME: this.notesTable.tableName,
        },
        timeout: cdk.Duration.seconds(30),
      }
    );

    // Grant DynamoDB permissions to Lambda functions
    this.notesTable.grantReadData(listNotesFunction);
    this.notesTable.grantReadData(getNoteFunction);
    this.notesTable.grantWriteData(createNoteFunction);
    this.notesTable.grantReadWriteData(updateNoteFunction);
    this.notesTable.grantWriteData(deleteNoteFunction);

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

    // Create /notes endpoints
    const notes = this.api.root.addResource('notes');

    // GET /notes - List all notes
    notes.addMethod('GET', new apigateway.LambdaIntegration(listNotesFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // POST /notes - Create note
    notes.addMethod('POST', new apigateway.LambdaIntegration(createNoteFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // /notes/{id} endpoints
    const note = notes.addResource('{id}');

    // GET /notes/{id} - Get note
    note.addMethod('GET', new apigateway.LambdaIntegration(getNoteFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // PUT /notes/{id} - Update note
    note.addMethod('PUT', new apigateway.LambdaIntegration(updateNoteFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // DELETE /notes/{id} - Delete note
    note.addMethod('DELETE', new apigateway.LambdaIntegration(deleteNoteFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Create /echo endpoint (for testing)
    const echo = this.api.root.addResource('echo');
    echo.addMethod('POST', new apigateway.LambdaIntegration(echoFunction), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // CloudFormation Outputs
    new cdk.CfnOutput(this, 'NotesTableName', {
      value: this.notesTable.tableName,
      description: 'DynamoDB Notes Table Name',
    });

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
