# AIOps Application Setup and Configuration Guide

## Introduction
This guide provides instructions to set up the AIOps application. Follow the steps below to install necessary packages, create the database, configure the Flask app with Dynatrace integration, and start the Car microservice.

## Prerequisites
- Ubuntu operating system
- Root or sudo access

## Step 1: Install Required Packages

1. **Update Package List:**
    ```sh
    sudo apt-get update
    ```

2. **Install Apache2:**
    ```sh
    sudo apt-get install apache2 -y
    ```

3. **Install MySQL:**
    ```sh
    sudo apt-get install mysql-server -y
    ```

4. **Install Python and pip:**
    ```sh
    sudo apt-get install python3 python3-pip python3-venv -y
    ```

## Step 2: Create the Database

1. Open MySQL command line or a MySQL client tool.
2. Execute the following command to create the `aiops` database:
    ```sql
    CREATE DATABASE aiops;
    ```
3. Create a MySQL user `root` with the password `demoadmin` if it doesn't already exist:
    ```sql
    CREATE USER 'root'@'localhost' IDENTIFIED BY 'demoadmin';
    GRANT ALL PRIVILEGES ON aiops.* TO 'root'@'localhost';
    FLUSH PRIVILEGES;
    ```
4. All necessary tables will be automatically created when the application is run for the first time.

## Step 3: Set Up and Run the Flask App

1. Navigate to the directory containing the Flask application.
2. Create and activate a virtual environment:
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```
3. Install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```
4. Run the Flask app:
    ```sh
    python run.py
    ```

## Step 4: Configure Flask App for Dynatrace Integration

1. Determine the IP address of the machine where the Flask app is running.
2. Update the Dynatrace integration webhook URL with the Flask app IP:
    ```
    http://<IP>:5000/webhook
    ```
    Replace `<IP>` with the actual IP address of your Flask app.

## Step 5: Start Car Microservice

1. Navigate to the `troubleshoot` directory:
    ```sh
    cd troubleshoot
    ```
2. Start the Car microservice using the provided shell script:
    ```sh
    ./start-car.sh car-service-0.0.1-SNAPSHOT.jar
    ```

## Troubleshooting

- **Database Connection Issues:** Ensure MySQL is running and accessible. Check the credentials and the database name.
- **Flask App Not Responding:** Ensure Flask is properly configured and running. Verify the IP address and port.
- **Car Microservice Fails to Start:** Ensure Java is installed and the JAR file exists in the `troubleshoot` directory. Check the logs for any errors.

## Conclusion

By following these steps, you should have the AIOps application up and running with the necessary database, Dynatrace integration, and Car microservice. For further assistance, refer to the application's documentation or contact support.
