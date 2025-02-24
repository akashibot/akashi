set positional-arguments

default:
    just --list

clippy:
    cargo clippy --fix --workspace --allow-dirty
    cargo fmt