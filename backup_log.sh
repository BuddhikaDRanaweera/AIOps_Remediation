#!/bin/bash

# Hardcoded path to the log directory
LOG_DIR="/home/ubuntu/Lab_App/Services/car-service"

# Check if log file name is provided as an argument
#if [ $# -ne 1 ]; then
#    echo "Usage: $0 <log_file>"
#    exit 1
#fi

# Log file name provided as an argument
LOGFILE="car-service.log"

# Full path to the log file
FULL_LOG_PATH="$LOG_DIR/$LOGFILE"

# Check if the log file exists and is readable
if [[ ! -f "$FULL_LOG_PATH" || ! -r "$FULL_LOG_PATH" ]]; then
    echo "Error: Log file $FULL_LOG_PATH not found or not readable."
    exit 1
fi

# Change directory to the log directory
cd "$LOG_DIR" || {
    echo "Error: Unable to change directory to $LOG_DIR. Exiting."
    exit 1
}

# Current date and time formatted as YYYY-MM-DD-HHMMSS
TIMESTAMP=$(date +"%Y-%m-%d-%H%M%S")

# Backup filename with timestamp appended
BACKUP_FILENAME="${LOGFILE%.*}-${TIMESTAMP}.${LOGFILE##*.}"

# Perform the backup in the current directory (log directory)
mv "$LOGFILE" "$BACKUP_FILENAME"
echo "Moved $LOGFILE to $BACKUP_FILENAME in $LOG_DIR"


