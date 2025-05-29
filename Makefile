docker:
	docker buildx build --platform=linux/amd64 --no-cache=true -f Dockerfile -t flamework .

server:
	frankenphp run --config frankenphp/Caddyfile

static:
	docker build -t static-app -f frankenphp/static-build.Dockerfile .
