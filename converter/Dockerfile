# Build stage
FROM nvidia/cuda:12.8.0-devel-ubuntu22.04 AS base
WORKDIR /app
# builder
FROM base AS builder
RUN apt-get update -y && apt-get install -y gcc g++ curl
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
COPY . .
RUN sh -c ". $HOME/.cargo/env && cargo build --release"
RUN find target/release -maxdepth 1 -type f -executable | xargs -IX install -D X -t target/bin/

# Runtime stage
FROM base AS runner
COPY --from=builder /app/target/release/converter .
CMD ["./converter"]
