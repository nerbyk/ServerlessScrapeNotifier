variable "global_name" { default = "status_notifier" }
variable "api_lambda_name" { default = "application_status_api" }
variable "telegram_bot_token" { }
variable "telegram_client_id" { }
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

resource "aws_cloudwatch_event_rule" "every_hour_on_weekdays" {
  name                = "every_hour_on_weekdays"
  description         = "Fires every hour between 6:00 AM and 9:00 PM UTC weekdays"
  schedule_expression = "cron(0/60 6-21 ? * MON-FRI *)"
}

resource "aws_cloudwatch_event_target" "sync_ptos_with_notion_every_hour" {
  rule      = aws_cloudwatch_event_rule.every_hour_on_weekdays.name
  target_id = "lambda"
  arn       = aws_lambda_function.lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_hour_on_weekdays.arn
}
