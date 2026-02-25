SERVER = ubuntu@100.28.232.183
APP_DIR = /home/ubuntu/app

# --- SSH ---

ssh:
	ssh $(SERVER)

# --- Logs ---

logs:
	ssh $(SERVER) 'cd $(APP_DIR) && pm2 logs lumilivro --lines 100'

logs-provision:
	ssh $(SERVER) 'tail -f /var/log/user-data.log'

logs-caddy:
	ssh $(SERVER) 'sudo journalctl -u caddy -f'

# --- Deploy ---

deploy:
	ssh $(SERVER) 'cd $(APP_DIR) && git pull && pnpm install --frozen-lockfile && pnpm exec prisma generate && pnpm exec prisma db push && pnpm build && pm2 restart lumilivro'

deploy-quick:
	ssh $(SERVER) 'cd $(APP_DIR) && git pull && pnpm build && pm2 restart lumilivro'

# --- App Management ---

restart:
	ssh $(SERVER) 'pm2 restart lumilivro'

stop:
	ssh $(SERVER) 'pm2 stop lumilivro'

start:
	ssh $(SERVER) 'pm2 start lumilivro'

status:
	ssh $(SERVER) 'pm2 status'

# --- Database ---

db-shell:
	ssh -t $(SERVER) 'sudo -u postgres psql lumilivro'

db-migrate:
	ssh $(SERVER) 'cd $(APP_DIR) && pnpm exec prisma db push'

# --- Infrastructure ---

infra-plan:
	cd infra && terraform plan

infra-apply:
	cd infra && terraform apply

infra-destroy:
	cd infra && terraform destroy

.PHONY: ssh logs logs-provision logs-caddy deploy deploy-quick restart stop start status db-shell db-migrate infra-plan infra-apply infra-destroy
