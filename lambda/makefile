generate:
	cargo run --example generate
	cargo fmt
	find .. . -maxdepth 1 -name .gitignore | xargs -IX sed '/^#\s*EOF_DOCKERIGNORE.*/q' X > .dockerignore
run:
	PORT=8000 cargo run
test:
	cargo build --release --features frontend
	target/release/lambda
	docker build -t sarod-lambda .
	docker run --rm -it -p 8080:8080 sarod-lambda
%:
	@echo "no target $*"