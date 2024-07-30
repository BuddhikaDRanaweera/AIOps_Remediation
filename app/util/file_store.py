import os
import logging
import stat

from flask import json

# Configure logger
logger = logging.getLogger(__name__)
# Define the relative path for saving files
directory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'lib_script')

# Create the directory if it doesn't exist
os.makedirs(directory, exist_ok=True)


def save_script_to_directory(filename, extension, content):
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, f"{extension}.{filename}")
    print(file_path)
    try:
        # Replace Windows-style line endings with Unix-style
        content = content.replace('\r\n', '\n').replace('\r', '\n')

        with open(file_path, 'w', newline='\n') as file:
            file.write(content)
        os.chmod(file_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
        logger.info(f"File {filename}.{extension} saved successfully in {directory}")
        return file_path
    except Exception as e:
        logger.error(f"Error saving file {filename}.{extension}: {e}")
        return None

def combine_json_files(file_paths):
    combined_data = ""
    for file_path in file_paths:
        try:
            with open(file_path, 'r') as file:
                data = file.read()
                combined_data += data + "\n"  # Add a newline between scripts
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            return None
    return combined_data

# def combine_json_files(file_paths):
#     combined_data = []
#     print(file_paths,"lll")
#     for file_path in file_paths:
#         try:
#             with open(file_path, 'r') as file:
#                 data = json.load(file)
#                 combined_data.extend(data)
#         except Exception as e:
#             logger.error(f"Error reading file {file_path}: {e}")
#             return None
#     return combined_data