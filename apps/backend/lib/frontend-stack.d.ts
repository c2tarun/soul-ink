import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
interface FrontendStackProps extends cdk.StackProps {
    environment: 'dev' | 'prod';
}
export declare class FrontendStack extends cdk.Stack {
    readonly distribution: cloudfront.Distribution;
    readonly bucket: s3.Bucket;
    constructor(scope: Construct, id: string, props: FrontendStackProps);
}
export {};
