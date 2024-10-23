POC to connect AWS lambda, AWS s3 and AWS bedrock

# Prerequisits
Bedrock models should be enabled in desired region. To request access visit this link https://us-west-2.console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess

## Deploy
This repo uses cloudformation cdk with nodejs. To deploy use following commands

```bash
$> export AWS_REGION=us-west-2 
$> npm ci
$> npx cdk bootstrap
$> npx cdk deploy
```

To generage CFN template
```bash
$> npx cdk synth 
```

## Structural flow
```mermaid
sequenceDiagram
    actor User
    User ->> S3: Upload file
    S3 -->> User: File uploaded
    S3 -->> Lambda: Object created
    activate Lambda
    Lambda ->> S3: Read object
    S3 -->> Lambda: Object content
    Lambda ->> Bedrock: generate embedding
    Bedrock -->> Lambda: embedding, number of input tokens
    Lambda -> Lambda: print embedding result
    deactivate Lambda
```    