# Command for unit test
## Basic Testing Commands
### Run all tests in the current package:
```go test```

### Run all tests in the current package with verbose output:
```go test -v```

### Run tests recursively in all packages (from the current directory):
```go test ./...```

## Running Specific Tests
### Run tests in a specific package only:
```go test ./controllers```

## Testing with Coverage
### Run tests with coverage statistics displayed:
```go test -cover```

### Generate a coverage profile file:
```go test -coverprofile="coverage.out"```

### Display the coverage percentage by function:
```go tool cover -func="coverage.out"```

### View an interactive HTML coverage report:
```go tool cover -html="coverage.out"```

## Running Benchmarks
### Run benchmarks for the current package:
```go test -bench=.```

### Combine with CPU profiling:
```go test -bench=. -cpuprofile="cpu.out"```
```go tool pprof cpu.out```

## Combining Flags
### You can combine several flags together. For example, to run all tests with verbose output and generate a coverage profile:
```go test -v -coverprofile="coverage.out" ./...```
```go tool cover -html="coverage.out" -o coverage.html```
```go test -coverprofile="coverage.out" ./<package>/...```
```go test -coverpkg=./<package> -coverprofile=<package>/tests/coverage.out ./<package>/tests```

# Dotenv Vault CLI Commands

This guide covers essential **dotenv-vault** commands for managing environment variables securely.

## Installation

Ensure you have **Node.js** and **npm** installed. If not, download them from [nodejs.org](https://nodejs.org/).

You can use **dotenv-vault** without installation by running commands with `npx`, or install it globally:

```go get github.com/dotenv-org/godotenvvault```

## First run and initialize
```npx dotenv-vault@latest new```

## Run this command to Login (skip if already logged in)
```npx dotenv-vault@latest login```

## To open the UI
```npx dotenv-vault@latest open```

## Connect to this project
```npx dotenv-vault@latest new vlt_7ec328aea5a654d7066015590743239f5f6d332f49564e08bba71b8aa451f160```

## Pull the changes
```npx dotenv-vault@latest pull```

## Push the changes
```npx dotenv-vault@latest push```


