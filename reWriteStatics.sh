#!/bin/bash
# Static maker:
# This catastrophic Script cleans the MainFunctions js from earlier executions and then loads all with comments marked HTML files and turns them into static HTML strings so they can be loaded NON-ASYNC. Why? Loading HTML-Code ASYNC works BUT it causes issues with classes and CSS and with Archives and all types of web-tools like translators. I want a way to easily and CLEANLY develop for my website WITHOUT turning HTML code into strings for JavaScript to directly use. I could load them with mainThread load methods BUT this is deprecated and works BAD! So I use this script. It automates it and AS LONG as I keep to my own define limitation so the script can execute cleanly this should work fine.

# IMPORTANT: The loaded HTML MUST have a EMPTY LINE at the end!!!

# License:
# ALL RIGHTS RESERVED
# This Code is REALLY bad. It should not be used in production.

# Clean Only:
cleanOnly="0"

if [ $# -ge 1 ]; then
    cleanOnly="1"
fi

# JavaScript file to work on (NO SLASHES!):
javaScriptFilePath="Assets/MainFunctions.js"

# HardCode marker:
startOfStatics="STATICS - START"
hardCodedMarker="_STATIC_HTML_INSERT"
endOfStatics="STATICS - END"

# Temp File for the cleanUp:
cleanTempFile=$(mktemp)

# Remove old read:
allowClean="0"

while IFS= read -r line || [ -n "$line" ]; do
    # Start Cleaning:
    if [[ "$line" == *"$startOfStatics"* ]]; then
        allowClean="1"
    fi
    
    # Clean Marker:
    if [[ "$line" == *"$hardCodedMarker"* && $allowClean == "1" ]]; then
        continue
    fi

    # End of Static Variable Area:
    if [[ "$line" == *"$endOfStatics"* ]]; then
        allowClean="0"
    fi
    echo "$line" >> "$cleanTempFile"
done < "$javaScriptFilePath"

# IF ONLY CLEANING:
if [[ "$cleanOnly" == "1" ]]; then
    mv "$cleanTempFile" "$javaScriptFilePath"
    exit
fi

# Temp File for the cleanUp for insert:
insertTempFile=$(mktemp)

# Read file again:
while IFS= read -r line || [ -n "$line" ]; do
    # Check for trigger:
    if [[ "$line" == *"### HARD_CODE_TRIGGER ###"* ]]; then
        
        # Get Data (By reading lines):
        read -r constLine
        read -r pathLine
        constName="${constLine:3}"
        pathToFile="${pathLine:3}"

        # Holder for input:
        fileData=""

        # Read input Data:
        while IFS= read -r fileLine; do
            fileData+="$fileLine"
        done < "$pathToFile"

        # Build STATIC insert:
        newLine="const $constName$hardCodedMarker = '$fileData';"

        # Write trigger Area and Data:
        echo "$line" >> "$insertTempFile"
        echo "$constLine" >> "$insertTempFile"
        echo "$pathLine" >> "$insertTempFile"
        echo "$newLine" >> "$insertTempFile"
    else # Normal Code:
        echo "$line" >> "$insertTempFile"
    fi
done < "$cleanTempFile"

# Replace og and cleanUp:
mv "$insertTempFile" "$javaScriptFilePath"
rm "$cleanTempFile"
