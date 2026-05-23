.PHONY: help backend-up backend-down backend-rebuild backend-logs backend-clean backend-ps types models generate-api lint lint-fix

include .env

# Ruta absoluta al proyecto del backend
BACKEND_DIR = ../Kitchapp-Backend

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

backend-up: ## Levanta todos los servicios del backend
	cd $(BACKEND_DIR) && make up

backend-down: ## Para todos los servicios del backend
	cd $(BACKEND_DIR) && make down

backend-rebuild: ## Reconstruye el backend
	cd $(BACKEND_DIR) && make rebuild

backend-watch: ## Levanta el backend con hot reload
	cd $(BACKEND_DIR) && make watch

backend-logs: ## Logs del backend en tiempo real
	cd $(BACKEND_DIR) && make logs

backend-clean: ## Limpia contenedores y volúmenes del backend
	cd $(BACKEND_DIR) && make clean

backend-ps: ## Estado de los servicios del backend
	cd $(BACKEND_DIR) && make ps

generate-api:  ## Genera los tipos y modelos de la API
	npx openapi-typescript $(SWAGGER_URL) -o src/api/types.ts
	npx @openapitools/openapi-generator-cli generate -i $(SWAGGER_URL) -g typescript-axios -o src/api

lint:
	bun run lint
	bun run build:tsc

lint-fix:
	bun run lint --fix
