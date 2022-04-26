variable "global_name" { default = "status_notifier" }
variable "table_name" { default = "passport_status" }
variable "telegram_bot_token" {}
variable "telegram_client_id" {}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
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
  source_dir  = "./dist"
  output_path = "./builds/lambda"
}

data "terraform_remote_state" "database" {
  backend = "s3"

  config = {
    bucket = "passport-observer-tfstate"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}

resource "aws_lambda_function" "lambda" {
  filename      = data.archive_file.lambda_zip.output_path
  function_name = var.global_name
  role          = aws_iam_role.lambda.arn

  source_code_hash = filebase64sha256(data.archive_file.lambda_zip.output_path)
  memory_size      = 128

  runtime = "nodejs14.x"
  handler = "app.lambdaHandler"
  timeout = 30

  environment {
    variables = {
      TELEGRAM_CLIENT_ID = var.telegram_client_id
      TELEGRAM_BOT_TOKEN = var.telegram_bot_token
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

resource "aws_lambda_event_source_mapping" "passport_status" {
  event_source_arn  = data.terraform_remote_state.database.outputs.database_arn
  function_name     = aws_lambda_function.lambda.arn
  starting_position = "LATEST"
}

data "aws_iam_policy_document" "dynamodb" {
  statement {
    actions = [
      "dynamodb:GetItem", 
      "dynamodb:GetRecords",
      "dynamodb:Scan",
      "dynamodb:DescribeStream",
      "dynamodb:ListStreams",
      "dynamodb:ListShards",
      "dynamodb:GetShardIterator"
    ]
    resources = [
      data.terraform_remote_state.database.outputs.database_arn,
      "${data.terraform_remote_state.database.outputs.database_arn}/*"
    ]
  }
}

resource "aws_iam_role_policy" "lambda_dynamo" {
  name   = "DynamoDB"
  policy = data.aws_iam_policy_document.dynamodb.json
  role   = aws_iam_role.lambda.id
}
