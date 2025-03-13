#!/bin/bash

# Variables:
# Files:
source_file="Dev_Log/Dev_Log.html"
target_file="Feed/RSS.xml"

# Description getter Counter:
line_counter=0

# CleanUP RSS-Feed:
> "$target_file"

# Prepair Feed:
echo "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" >> "$target_file"
echo "<rss version=\"2.0\">" >> "$target_file"
echo "    <channel>" >> "$target_file"
echo "        <title>REPOSSESSED - Development Log</title>" >> "$target_file"
echo "        <link>https://REPOSSESSED.catwithcode.moe/Dev_Log/Dev_Log.html</link>" >> "$target_file"
echo "        <description>Development Log for there upcoming Immersiv Sim REPOSSESSED.</description>" >> "$target_file"

# Initialize the counter value:
counter=0

# Extract text between <h2> and </h2> and write to target file:
while IFS= read -r line; do

    # Check if line is Title:
    if [[ $line =~ \<h2\>(.*)\<\/h2\> ]]; then

        # Extract the text between <h2></h2>:
        text="${BASH_REMATCH[1]}"

        # Write to Tags:
        echo "		<item>" >> "$target_file"
        
        # Write actual Text:
        echo "			<title>$text</title>" >> "$target_file"

        # Count Up:
        counter=$((counter + 1))

        # Write to Tags:
        echo "			<link>https://REPOSSESSED.catwithcode.moe/Dev_Log/Dev_Log.html?item=${counter}</link>" >> "$target_file"
    fi

    # If just wrote Titel then:
    if [[ $(tail -n 1 "$target_file") == "			<link>https://REPOSSESSED.catwithcode.moe/Dev_Log/Dev_Log.html?item=${counter}</link>" ]]; then

        # Get actual Text:
        line_counter=$((line_counter + 1))

        # After 3 lines, write the current line to the target file:
        if [ $line_counter -eq 3 ]; then
            
            # Reset:
            line_counter=0
            
            # Write Disc. and Tags:
            echo "			<description>$line</description>" >> "$target_file"
            echo "		</item>" >> "$target_file"
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
