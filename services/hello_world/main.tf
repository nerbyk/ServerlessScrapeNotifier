variable "global_name" { default = "hello_world" }
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

# resource "aws_apigatewayv2_api" "lambda" { 
#   name = var.global_name
#   protocol_type = "HTTP"
# }

# resource "aws_apigatewayv2_stage" "lambda" {
#   api_id = aws_apigatewayv2_api.lambda.id 

#   name = "$default"
#   auto_deploy = true
# }

# resource "aws_apigatewayv2_integration" "integration" {
#   api_id = aws_apigatewayv2_api.lambda.id

#   integration_uri = aws_lambda_function.lambda.invoke_arn
#   integration_type = "AWS_PROXY"
#   integration_method = "POST"
# }

# resource "aws_apigatewayv2_route" "get_hello_world" {
#   api_id = aws_apigatewayv2_api.lambda.id
#   route_key = "GET /{proxy+}"
#   target = "integrations/${aws_apigatewayv2_integration.integration.id}"
# }

# resource "aws_lambda_permission" "api_gw" {
#   statement_id = "AllowExecutionFromAPIGateway"
#   action       = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.lambda.function_name
#   principal = "apigateway.amazonaws.com"

#   source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
# }

resource "aws_lambda_function_url" "lambda" {
  function_name = aws_lambda_function.lambda.arn
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}


output "base_url" {
  value = aws_lambda_function_url.lambda.function_url
}
