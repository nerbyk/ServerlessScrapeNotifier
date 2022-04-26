provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "passport-observer-tfstate"
  acl    = "private"
  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }
}
