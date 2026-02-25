variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "volume_size" {
  description = "Root EBS volume size in GB"
  type        = number
  default     = 30
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access (contents of ~/.ssh/id_ed25519.pub)"
  type        = string
}

variable "ssh_cidr" {
  description = "CIDR block allowed for SSH access (e.g. your IP: 203.0.113.5/32)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "domain" {
  description = "Domain name for the application"
  type        = string
  default     = "lumi-read.com"
}

variable "github_repo" {
  description = "GitHub repository HTTPS URL"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL password for the lumilivro user"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  sensitive   = true
}

variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook secret"
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "Resend API key for email"
  type        = string
  sensitive   = true
}

variable "email_from" {
  description = "Email sender address"
  type        = string
  default     = "LumiLivro <pedidos@lumuslivro.com.br>"
}

variable "admin_password" {
  description = "Admin panel password"
  type        = string
  sensitive   = true
}

variable "stripe_link_basic" {
  description = "Stripe Payment Link URL for LumiRead Basic"
  type        = string
}

variable "stripe_link_premium" {
  description = "Stripe Payment Link URL for LumiRead Premium"
  type        = string
}
