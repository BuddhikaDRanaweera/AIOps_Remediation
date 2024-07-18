#!/bin/bash
# Start car service

SERVICE_NAME=$1
cd /home/ubuntu/Lab_App/Services/car-service
nohup java -Xms256m -Xmx512m -XX:+HeapDumpOnOutOfMemoryError \
-XX:HeapDumpPath=./java_pid.hprof -jar /home/ubuntu/Lab_App/Services/car-service/$SERVICE_NAME \
> /home/ubuntu/Lab_App/Services/car-service/carservice.log 2>&1 &
