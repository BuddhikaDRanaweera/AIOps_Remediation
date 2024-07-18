#!/bin/bash
# Stop car service using pgrep and kill

SERVICE_NAME=$1

sudo pkill -f "${SERVICE_NAME}"
