server:
	frankenphp run --config frankenphp/Caddyfile

# https://frankenphp.dev/docs/embed/#creating-a-linux-binary

static:
	docker build -t static-app -f frankenphp/static-build.Dockerfile .
	# docker cp $(docker create --name static-app-tmp static-app):/go/src/app/dist/frankenphp-linux-x86_64 flamework ; docker rm static-app-tmp
