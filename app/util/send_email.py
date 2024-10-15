import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, body):
    print("to_email, subject, body")
    # Email configuration
    from_email = "appehms@gmail.com"
    password = "ujcmlcuuohjpmqkr"
    
    # Create a multipart email message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the email body
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to the SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)  # Use your email provider's SMTP server and port
        server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
        server.login(from_email, password)  # Login to the email account

        # Send the email
        server.sendmail(from_email, to_email, msg.as_string())
        print("Email sent successfully!")

    except Exception as e:
        print(f"Failed to send email: {e}")

    finally:
        server.quit()  # Close the connection

