#!/bin/bash

# Check if exactly one argument is provided
if [ $# -ne 1 ]; then

    echo "Usage: $0 <process_name>"

    exit 1
fi

process_name=$1

# Check if any process with the given name is running (excluding the script itself)

if ps -ef | grep "$process_name" | grep -v "grep" | grep -v "$0" > /dev/null; then

    exit 0
else

    exit 1
fi
