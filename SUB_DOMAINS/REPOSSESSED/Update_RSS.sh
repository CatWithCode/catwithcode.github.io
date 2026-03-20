#!/bin/bash

# This Updates the RSS-Feed.

# License:
# ALL RIGHTS RESERVED
# This Code is very bad. It should not be used in production.

# Variables:
# Files:
source_file="Dev_Log/Dev_Log.html"
target_file="Feed/RSS.xml"

# Description getter Counter:
line_counter=0

# Initialize the counter value:
idsToUse=$(grep -o "<h2><u>" "$source_file" | wc -l)

# CleanUP RSS-Feed:
> "$target_file"

# Prepair Feed:
echo "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" >> "$target_file"
echo "<rss version=\"2.0\">" >> "$target_file"
echo "    <channel>" >> "$target_file"
echo "        <title>REPOSSESSED - Development Log</title>" >> "$target_file"
echo "        <link>https://REPOSSESSED.catwithcode.moe/Dev_Log/Dev_Log.html</link>" >> "$target_file"
echo "        <description>Development Log for there upcoming Immersiv Sim REPOSSESSED.</description>" >> "$target_file"

# Initialize the titleDate value and it's formated version:
datePub=""
formatted_date=""

# Extract text between <h2> and </h2> and write to target file:
while IFS= read -r line; do

    # Check if line is Title:
    if [[ $line =~ \<h2\>(.*)\<\/h2\> ]]; then

        # Extract the text between <h2></h2>:
        text="${BASH_REMATCH[1]}"

        # Write to Tags:
        echo "		<item>" >> "$target_file"
        
        # Write actual Text:
        echo "			<title>RE//POSSESSED - $text</title>" >> "$target_file"
        
        # Get PubDate:
        date_string=${text:3:10}
        formatted_date=$(date -d "${date_string//./-}" +"%a, %d %b %Y 00:00:00 GMT")

        # Count Up:
        idsToUse=$((idsToUse - 1))

        # Write to Tags:
        echo "			<link>https://REPOSSESSED.catwithcode.moe/Dev_Log/Dev_Log.html?item=${idsToUse}</link>" >> "$target_file"
    fi

    # If just wrote Titel then:
    if [[ $(tail -n 1 "$target_file") == "			<link>https://REPOSSESSED.catwithcode.moe/Dev_Log/Dev_Log.html?item=${idsToUse}</link>" ]]; then

        # Get actual Text:
        line_counter=$((line_counter + 1))

        # After 3 lines, write the current line to the target file:
        if [ $line_counter -eq 3 ]; then
            
            # Reset:
            line_counter=0
            
            # Write Disc. and Tags:
            echo "			<description>$line</description>" >> "$target_file"
            echo "			<pubDate>$formatted_date</pubDate>" >> "$target_file"
            echo "		</item>" >> "$target_file"

            # Clean Date:
            datePub=""
            formatted_date=""
        fi
    fi
done < "$source_file"

# Closing Tags:
echo "    </channel>" >> "$target_file"
echo "</rss>" >> "$target_file"

# Clean the target file by removing HTML-Tags:
# u:
sed -i 's/<u>//g; s/<\/u>//g' "$target_file"
# h3:
sed -i 's/            <h3>//g; s/<\/h3>//g' "$target_file"

# Done:
echo "Extraction complete. Check $target_file for results."

# - Update Last Seen: ####################################################################################################
# Changes the last seen time stamp. Is written directly into the pages. Updated with RSS so it is only updated if this SubPage is actualy updated:

# TimeStemp-Files (Relative to Script):
timeStampFiles=(
    "index.html"
    "Dev_Log/Dev_Log.html"
    "License_and_Privacy.html"
    "OutgoingLinks.html"
    "Presskit/Presskit.html"
)

# Get Date:
current_date_time=$(date +"%Y.%m.%d - %H:%M")

# All files one by one because lazy:
for timeStampFile in "${timeStampFiles[@]}"; do
    sed -i -E "s/(Last Updated:&nbsp;<b>)(.*?)(<\/b>)/\1$current_date_time\3/" "$timeStampFile"
done

exit
