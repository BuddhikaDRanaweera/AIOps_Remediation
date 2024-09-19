# check_encoding.py

# Make sure to import the 'os' module correctly
import os

# Specify the path to the requirements.txt file
file_path = 'requirements.txt'

# Open the file in binary mode
with open(file_path, 'rb') as f:
    contents = f.read()
    print(contents)
