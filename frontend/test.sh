#!/bin/bash

# Test runner script for development workflows

echo "🧪 MERN Chat App - Testing Suite"
echo "================================"

# Function to run tests with proper setup
run_tests() {
    echo "Running tests..."
    npm run test:run
    
    if [ $? -eq 0 ]; then
        echo "✅ All tests passed!"
        return 0
    else
        echo "❌ Some tests failed!"
        return 1
    fi
}

# Function to run tests with coverage
run_coverage() {
    echo "Running tests with coverage..."
    npm run test:coverage
    echo "📊 Coverage report available in coverage/ directory"
}

# Function to start test watch mode
run_watch() {
    echo "Starting test watch mode..."
    echo "Tests will re-run automatically when files change"
    npm run test:watch
}

# Function to start test UI
run_ui() {
    echo "Starting Vitest UI..."
    echo "Open your browser to see the interactive test interface"
    npm run test:ui
}

# Parse command line arguments
case "$1" in
    "coverage"|"cov")
        run_coverage
        ;;
    "watch"|"w")
        run_watch
        ;;
    "ui")
        run_ui
        ;;
    "help"|"--help"|"-h")
        echo "Usage: ./test.sh [command]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Run all tests once"
        echo "  coverage   Run tests with coverage report"
        echo "  watch      Run tests in watch mode"
        echo "  ui         Start Vitest UI interface"
        echo "  help       Show this help message"
        ;;
    "")
        run_tests
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use './test.sh help' for available commands"
        exit 1
        ;;
esac