generate:
	find .. . -maxdepth 1 -name .gitignore | xargs -IX sed '/^#\s*EOF_DOCKERIGNORE.*/q' X > .dockerignore
run:
	cargo run
build:
	docker build -t converter .
test:
	docker run --rm --gpus all --entrypoint bash converter -c "nvidia-smi && nvcc --version"