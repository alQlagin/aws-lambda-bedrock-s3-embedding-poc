import boto3
import json

# Create clients for S3 and Bedrock Runtime.
s3_client = boto3.client("s3")
bedrock_client = boto3.client("bedrock-runtime")

# Set the model ID, e.g., Titan Text Embeddings V2.
model_id = "amazon.titan-embed-text-v2:0"

def handler(event, context):
    # Loop through the records in the event (if multiple files were processed)
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        # Get the object from S3
        try:
            s3_response = s3_client.get_object(Bucket=bucket, Key=key)
            input_text = s3_response['Body'].read().decode('utf-8')  # Read and decode the file content

            # Create the request for the model.
            native_request = {"inputText": input_text}

            # Convert the native request to JSON.
            request = json.dumps(native_request)

            # Invoke the model with the request.
            response = bedrock_client.invoke_model(modelId=model_id, body=request)

            # Decode the model's native response body.
            model_response = json.loads(response["body"].read())

            # Extract and log the generated embedding and the input text token count.
            embedding = model_response["embedding"]
            input_token_count = model_response["inputTextTokenCount"]

            print(f"\nFile processed: {key}")
            print(f"Number of input tokens: {input_token_count}")
            print(f"Size of the generated embedding: {len(embedding)}")
            print("Embedding:")
            print(embedding)

        except Exception as e:
            print(f"Error processing file {key} from bucket {bucket}: {str(e)}")

    return {
        'statusCode': 200,
        'body': json.dumps('Processing complete')
    }
