#!/bin/bash

# This adds the next DevLog as a Template.

# License:
# ALL RIGHTS RESERVED
# This Code is bad. It should not be used in production.

# Variables:
SOURCE_FILE="Assets/BaseFiles/BASE_Log_Entry.html"  # Base File.
TARGET_FILE="Dev_Log/Dev_Log.html"  # Log.
SEARCH_STRING="<!-- NEW_ENTRY_HERE: -->"  # Log insert point.

# Check if the source file exists:
if [[ ! -f "$SOURCE_FILE" ]]; then
    echo "Source file does not exist."
    exit
fi

# Check if the target file exists:
if [[ ! -f "$TARGET_FILE" ]]; then
    echo "Target file does not exist."
    exit
fi

# Read and Copy Text:
COPY_TEXT=$(<"$SOURCE_FILE")

# Find insert String and then paste the base Text:
awk -v text="$COPY_TEXT" -v search="$SEARCH_STRING" '
{
    print $0
    if ($0 ~ search) {
        print text
    }
}' "$TARGET_FILE" > temp_file && mv temp_file "$TARGET_FILE"

echo "DONE"
