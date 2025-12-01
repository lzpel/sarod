generate:
	cargo run --example generate
run:
	cargo run
test:
	cargo build --release --features frontend
	target/release/lambda
	docker build -t sarod-lambda .
	docker run --rm -it -p 8080:8080 sarod-lambda
%:
	@echo "no target $*"