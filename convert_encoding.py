# convert_encoding.py

# Specify the path to the original file and the new file
input_file_path = 'requirements.txt'
output_file_path = 'requirements_utf8.txt'

# Read the original file in UTF-16 and write it as UTF-8
with open(input_file_path, 'r', encoding='utf-16') as f:
    contents = f.read()

with open(output_file_path, 'w', encoding='utf-8') as f:
    f.write(contents)

print(f'Converted {input_file_path} from UTF-16 to UTF-8 and saved as {output_file_path}.')
