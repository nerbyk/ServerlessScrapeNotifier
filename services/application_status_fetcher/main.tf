variable "global_name" { default = "application_status_api" }
variable "table_name" { default = "passport_status" }
variable "application_id" { }
terraform {
  required_providers { 
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.9.0"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir = "./dist"
  output_path = "./builds/lambda"
}

resource "aws_lambda_function" "lambda" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = var.global_name
  role             = aws_iam_role.lambda.arn
  
  source_code_hash = filebase64sha256(data.archive_file.lambda_zip.output_path)
  memory_size      = 128
  
  runtime          = "nodejs14.x"
  handler          = "app.lambdaHandler"
  timeout          = 30

   environment {
    variables = {
      APPLICATION_ID = var.application_id
      TABLE_NAME = var.table_name
    }
  }
}

resource "aws_iam_role" "lambda" {
  name = var.global_name

  assume_role_policy = <<-POLICY
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "sts:AssumeRole",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
        }
      ]
    }
  POLICY
}

resource "aws_dynamodb_table" "passport_status" {
  name = var.table_name
  read_capacity  = 20
  write_capacity = 20

  hash_key = "uid"
  attribute {
    name = "uid"
    type = "S"
  }
}

data "aws_iam_policy_document" "dynamo" {
  statement {
    actions = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"]
    resources = [aws_dynamodb_table.passport_status.arn]
  }
}

resource "aws_iam_role_policy" "lambda_dynamo" {
  name   = "DynamoDB"
  policy = data.aws_iam_policy_document.dynamo.json
  role   = aws_iam_role.lambda.id
}
