generate:
	cargo run --example generate
	cargo fmt
run:
	PORT=8090 cargo run
test:
	cargo build --release --features frontend
	target/release/lambda
	docker build -t sarod-lambda .
	docker run --rm -it -p 8080:8080 sarod-lambda
%:
	@echo "no target $*"