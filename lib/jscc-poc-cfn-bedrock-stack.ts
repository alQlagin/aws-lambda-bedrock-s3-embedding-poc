import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3_notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

import * as path from 'node:path';

export class JsccPocCfnBedrockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, stackName: 'jsccPocCFNBedrock' });

    // Step 1: Create an S3 bucket
    const bucket = new s3.Bucket(this, 'jscc-poc-cfn-bedrock-bucket', {
      versioned: true,
    });

    // Step 2: Create a Lambda function
    const myFunction = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
    });

    // Step 3: Grant Lambda permission to read/write from the bucket
    bucket.grantReadWrite(myFunction);

    // Step 4: Create a policy for invoking Bedrock models
    const bedrockPolicy = new iam.PolicyStatement({
      actions: [
        "bedrock:InvokeModel", // Permissions to invoke the model
      ],
      resources: ['*'], // Replace with the ARN of your Bedrock model if needed
    });

    myFunction.addToRolePolicy(bedrockPolicy);

    // Step 5: Add S3 bucket notification to trigger the Lambda function
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3_notifications.LambdaDestination(myFunction));
  }
}
