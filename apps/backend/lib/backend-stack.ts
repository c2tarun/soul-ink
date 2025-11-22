import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type { Note } from '@soul-ink/shared';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: Add AWS resources here (DynamoDB, Lambda, API Gateway, etc.)
    // Example usage of shared types:
    // const noteTable = new dynamodb.Table(this, 'NotesTable', {
    //   partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    // });

    new cdk.CfnOutput(this, 'StackName', {
      value: this.stackName,
      description: 'Soul Ink Backend Stack',
    });
  }
}
