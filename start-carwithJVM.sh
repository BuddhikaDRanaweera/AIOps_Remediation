#!/bin/bash

SERVICE_NAME=$1
JVM_MIN=$2
JVM_MAX=$3
LOG_FILE=car-service.log


cd /home/ubuntu/Lab_App/Services/car-service

# Start the service
echo "Starting car-service-0.0.1-SNAPSHOT.jar..."
nohup java -Xms"$JVM_MIN"m -Xmx"$JVM_MAX"m -XX:+HeapDumpOnOutOfMemoryError \
    -XX:HeapDumpPath=./java_pid.hprof -jar /home/ubuntu/Lab_App/Services/car-service/car-service-0.0.1-SNAPSHOT.jar > $LOG_FILE 2>&1 &

echo "$SERVICE_NAME started successfully."
