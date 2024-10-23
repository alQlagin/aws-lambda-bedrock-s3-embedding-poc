import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class JsccPocCfnBedrockStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {...props, stackName: 'jsccPocCFNBedrock'});

    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'jscc-poc-cfn-bedrock-bucket', {
      versioned: true,
    });

    // Create a Lambda function
    const myFunction = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log("request:", JSON.stringify(event, undefined, 2));
          return { statusCode: 200, body: "Hello from Lambda!" };
        };
      `),
    });

    // Grant Lambda permission to read/write from the bucket
    bucket.grantReadWrite(myFunction);
  }
}
