terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    
     local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region     = "ap-south-1"
  access_key = "AKIATCKAPXFYH4CM2T6C"
  secret_key = "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"
}