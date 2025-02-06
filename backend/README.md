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