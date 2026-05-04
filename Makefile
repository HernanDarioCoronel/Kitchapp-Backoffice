.PHONY: help backend-up backend-down backend-rebuild backend-logs backend-clean backend-ps

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