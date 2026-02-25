output "public_ip" {
  description = "Public IP address — point your Hostinger DNS A record to this"
  value       = aws_eip.web.public_ip
}

output "ssh_command" {
  description = "SSH into the server"
  value       = "ssh ubuntu@${aws_eip.web.public_ip}"
}

output "provision_log" {
  description = "Watch provisioning progress (run after SSH is available)"
  value       = "ssh ubuntu@${aws_eip.web.public_ip} 'tail -f /var/log/user-data.log'"
}
