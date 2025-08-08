#!/bin/bash

# Deploy Website:
# This creates the SiteMap and Updates the Archiv, adddes missing entrys to Blog and Feed and moves SiteMap entrys into the right SubDomains. Footer must be set manually because the write Text can be different from file details.

# License:
# ALL RIGHTS RESERVED
# This Code is bad. It should not be used in production.

# - Clean Output:
clear

# - Configuration: ####################################################################################################
# - - Variables:
# Default location of Website:
DEFAULT_URL_PREFIX="https://catwithcode.moe/"
# Default Name of Website:
WEBSITE_NAME="CatWithCode"

# SubDomains (Must be adressed over Webhoster):
declare -A prefixes
	prefixes["REPOSSESSED"]="https://repossessed.catwithcode.moe/"
	#prefixes["repossessed2"]="https://repossessed2.catwithcode.moe/"
	#...

# Where the SubDomains are saved:
subdomains_dir="SUB_DOMAINS"

# Allowed FileTypes:
okFileTypes=(.html
			.htm
			.jpg
			.jpeg
			.png
			.gif
			.svg
			.mp4
			.avi
			.mov
			.wmv)

# Not allowed Strings:
notOkFileStrings=(404.html
					temp_links.html)

# 2: Paths:
# 2.1: Files:
SITEMAP_FILE="sitemap.xml"
BLOG_FILE="blog.html"
RSS_FEED_FILE="Feed/RSS.xml"
ARCHIVE_FILE="archive.html"

# 2.2: Folders:
BLOG_DIR="Blog"

# TimeStemp (Relative to Script):
timeStempFile="Assets/BaseFiles/Page/Footer.html"

# - GENERATE ARCHIVE and SITEMAP: ####################################################################################################

# 1: Generate the HTML-Links with indentation and sort. BR in the same line because new line befor it would glitch out find. Sitemap gets now created here too because of the SubDomain-Split:

# Create or clear the output file:
output_file="temp_links.html"
> "$output_file"

# Archive-Functions:
# Function to get the prefix based on the current directory:
# NEEDS: DirectoryPath
get_prefix() {
	local dir_path="$1"
	
	# Check if the path contains the subdomains directory and extract the subfolder name:
	if [[ "$dir_path" == *"/$subdomains_dir/"* ]]; then
		# Extract the subfolder name:
		local subfolder_name=$(echo "$dir_path" | awk -F'/' -v subdir="$subdomains_dir" '{for(i=1;i<=NF;i++) if($i==subdir) print $(i+1)}')
		echo "${prefixes[$subfolder_name]:-$URL_PREFIX}"  # Use defined prefix or default.
	else
		echo "$DEFAULT_URL_PREFIX"
	fi
}

# Function to check if a file-types is allowed. Returns 0 if it is:
# NEEDS: FullFileNameWithType
check_filetype() {
    local filename="$1"

    # Loop through the array of file types:
    for ext in "${okFileTypes[@]}"; do
		# If File ext. is OK:
        if [[ "$filename" == *"$ext" ]]; then
			for strName in "${notOkFileStrings[@]}"; do
				if [[ "$filename" == *"$strName"* ]]; then
					return 1 # If FileStr is in not Allowed List.
				fi
			done

			return 0  # If it is a String not in the array.
        fi
    done

    return 1  # If it is NOT a filetype of the array.
}
# Archive-Functions-END

# SiteMap-Functions:
# Clears current SiteMap and Writes Header:
# NEEDS: SITEMAP-PATH
write_SiteMapStart() {
	> "$1"
	echo '<?xml version="1.0" encoding="UTF-8"?>' >> "$1"
	echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> "$1"
}

# Writes a new Entry into the current SiteMap::
# NEEDS: SITEMAP-PATH, URL, DATE
write_SiteMapEntry() {
	# Check if file is not of wrong Filetype for SiteMap. JS for example should never be in a SiteMap!
	if check_filetype "$2"; then
		echo "  <url>" >> "$1"
		echo "    <loc>$2</loc>" >> "$1"
		echo "    <lastmod>$3</lastmod>" >> "$1"
		echo "  </url>" >> "$1"
	fi
}

# Simply writes the Footer to the current SiteMap:
# NEEDS: SITEMAP-PATH
write_SiteMapEnd() {
	echo '</urlset>' >> "$1"
}

# Function to check for subfolder/subdomain existence and process sitemap to split into Sites.
# Make sure to never have a SubDomain-Folder WITHOUT the entry in the Array here. Else it will Bug the Main-SiteMap!
# WARINING: THIS ONLY WORKS IF THE MAIN-SITEMAP IS VALID!
# NEEDS: SubFolder, SubDomain
process_prefix() {
	# Get current Path:
	local prefix_name="$1"
	local prefix_url="$2"
	
	# Check if the subdomain directory exists:
	local subdomain_dir_path="$subdomains_dir/$prefix_name"
	if [[ -d "$subdomain_dir_path" ]]; then
		# Create the new sitemap.xml file in the subdomain directory:
		local new_sitemap_file="$subdomain_dir_path/sitemap.xml"
		touch "$new_sitemap_file"

		# Create a temporary file to store the modified sitemap:
		local temp_sitemap_file=$(mktemp)

		# Header and Footer:
		local found=0

		# OneLineHolder:
		urlHolder=""

		# Initialize the done variable
		done=0
		
		# Start the loop
		while [[ $done -ne 1 ]]; do
			# Holding next Line:
			currentLine=""

			# Getting currentLine:
			if IFS= read -r next_line; then
				currentLine=$next_line
			else
				done=1
			fi
			
			# Check if currentLine is wanted SubDomain:
			if [[ "$currentLine" == *"$prefix_url"* ]]; then

				 # Write Header if first go:
				if [[ $found -eq 0 ]]; then\
					write_SiteMapStart $new_sitemap_file
				fi
				found=1
				
				# Write URL-Holder:
				if [[ "$urlHolder" == *"<url>"* ]]; then
					echo "$urlHolder" >> "$new_sitemap_file"
					# Clear URL-Holder:
					urlHolder=""
				fi

				# Write current URL:
				echo "$currentLine" >> "$new_sitemap_file"

				# Write Date-Line:
				if IFS= read -r dateHolder; then
					echo "$dateHolder" >> "$new_sitemap_file"
				else
					$done=1
				fi

				# Write Closing-Url-Line:
				if IFS= read -r urlEnder; then
					echo "$urlEnder" >> "$new_sitemap_file"
				else
					$done=1
				fi
			else
				# Hold currentLine if its URL-Opener because of the next Line COULD be a wanted SubDomain-URL:
				if [[ "$currentLine" == *"<url>"* ]]; then
					urlHolder=$currentLine
				else
					# Write URL-Holder:
					if [[ "$urlHolder" == *"<url>"* ]]; then
						echo "$urlHolder" >> "$temp_sitemap_file"
						# Clear URL-Holder:
						urlHolder=""
					fi

					# Write the line to the temporary file
					echo "$currentLine" >> "$temp_sitemap_file"
				fi
			fi
		# Closing File:
		done < "$SITEMAP_FILE"

		# Write Footer:
		if [[ $found -eq 1 ]]; then
			write_SiteMapEnd $new_sitemap_file
		fi

		# Replace the original sitemap file with the modified one
		mv "$temp_sitemap_file" "$SITEMAP_FILE"
	fi
}
# SiteMapFunctions - END

# Write Header for Main-SiteMap:
write_SiteMapStart $SITEMAP_FILE

# Find files:
find . -type f ! -path '*/.*' | while read -r file; do
	# Getting Current File-Folder:
	current_dir=$(dirname "$file")
	# Determen current Prefix:
	URL_PREFIX=$(get_prefix "$current_dir")
	# Getting current relativ File:
	file_name="${file#./}"  # Remove leading './'
	# Grabing File Change Date:
	file_DATE=$(date -u -d "$(stat -c %y "$file")" +"%Y-%m-%d")

	# Holds CombindNames:
	combined_name=""

	# Check if the current directory is in the subdomains_dir and one of the defined subfolders:
	if [[ "$current_dir" == *"/$subdomains_dir/"* ]]; then
		# Extract the subfolder name:
		subfolder_name=$(echo "$current_dir" | awk -F'/' -v subdir="$subdomains_dir" '{for(i=1;i<=NF;i++) if($i==subdir) print $(i+1)}')
		
		# Remove the subdomains_dir and the subfolder from the file path:
		relative_path="${file_name#*"$subdomains_dir"/$subfolder_name/}"

		# OutPut Entry:
		echo "    <a href=\"${prefixes[$subfolder_name]}$relative_path\">${prefixes[$subfolder_name]}$relative_path</a> <br>" >> "$output_file"

		# Fill Main-SiteMap:
		combined_name="${prefixes[$subfolder_name]}$relative_path"
		write_SiteMapEntry $SITEMAP_FILE $combined_name $file_DATE

	# Only write if it is NOT the default URL (Prevents doubles):
	elif [[ ! "$URL_PREFIX" == *"$DEFAULT_URL_PREFIX"* ]]; then
		# OutPut Entry:
		echo "    <a href=\"$URL_PREFIX$file_name\">$URL_PREFIX$file_name</a> <br>" >> "$output_file"
		
		# Fill Main-SiteMap:
		combined_name="$URL_PREFIX$file_name"
		write_SiteMapEntry $SITEMAP_FILE $combined_name $file_DATE
	fi

	# Write the link with the default prefix
	echo "    <a href=\"$DEFAULT_URL_PREFIX$file_name\">$DEFAULT_URL_PREFIX$file_name</a> <br>" >> "$output_file"

	# Fill Main-SiteMap:
	combined_name="$DEFAULT_URL_PREFIX$file_name"
	write_SiteMapEntry $SITEMAP_FILE $combined_name $file_DATE
done

# Write Main-SiteMap-Footer:
write_SiteMapEnd $SITEMAP_FILE

# Moving SiteMapEntrys to there right locations for SubDomains:
for prefix_name in "${!prefixes[@]}"; do
	process_prefix "$prefix_name" "${prefixes[$prefix_name]}"
done

# Sort the output file
sort -o "$output_file" "$output_file"

# 2: Remove Temp-Files and Script from List. Could not get it to work in one command or more cleanly:
sed -i '/DeployWebsite.sh/d' temp_links.html
sed -i '/temp_links.html/d' temp_links.html

# 3: CleanUp the old Archive:
sed -i '/<!-- ARCHIVE - START -->/,/<!-- ARCHIVE - END -->/{//!d;}' ${ARCHIVE_FILE}

# 4: Use sed to replace old Links between markers in archive.html. Is moved because read issues:
sed -e '/<!-- ARCHIVE - START -->/,/<!-- ARCHIVE - END -->/{ 
		/<!-- ARCHIVE - START -->/! { 
			/<!-- ARCHIVE - END -->/! d; 
		}
	}' \
	-e '/<!-- ARCHIVE - START -->/r temp_links.html' \
	-e 's/<!-- ARCHIVE - END -->/<!-- ARCHIVE - END -->/' \
	archive.html > temp.html

# 5: Move the temporary File back to archive.html:
mv temp.html ${ARCHIVE_FILE}

# 6: Update Time Stemp:
sed -i "s|<p>[0-9]\{4\}\.[0-9]\{2\}\.[0-9]\{2\} - [0-9]\{2\}:[0-9]\{2\} |<p>$(date '+%Y.%m.%d - %H:%M') |g" archive.html

# - Update BlogPage: ####################################################################################################

# 1: Create a list of all HTML files in the Blog directory and its subfolders:
html_files=$(find "$BLOG_DIR" -type f -name "*.html" | sort)

# 2: Loop through HTML files:
while IFS= read -r html_file; do

	# 3: Get LinkDateText:
	linkDate_text=${html_file:5:10}

	# 4: Check if the Entry is already in the Blog-Entry-List:
	if ! grep -q "$html_file" "$BLOG_FILE"; then

		# 5: Getting Blog-Entry Headline:
		h1_text=$(grep -oP '(?<=<h1>).*?(?=</h1>)' "$html_file" | head -n 1)

		# 6: Add new Entry. The double Lines are for indentation and new Line:
		sed -i "/<!-- BLOG ENTRYS - START -->/a \\      <li><a href=\"$html_file\">$linkDate_text - $h1_text</a><br><br></li>\\
		" "$BLOG_FILE"

		# 7: Tell user what has been found and added:
		echo "Added $html_file to $BLOG_FILE"
	fi
done <<< "$html_files"

# - Update RSS-Feed: ####################################################################################################
# WARNING: THE FIRST <p> MUST BE <p>ABC</p>! NOTHING FANCY NOT EVEN NEW LINE! ELSE THE REGEX BREAKS! This also breaks a little if a Entry has Sub-Pages LOL.
# 1: Create a list of all HTML files in the Blog directory and its subfolders:
html_files_for_RSS=$(find "$BLOG_DIR" -type f -name "*.html" | sort)

# 2: Loop through HTML files:
while IFS= read -r html_file_for_RSS; do

	# 3: Check if the Entry is already in the RSS-Feed:
	if ! grep -q "$html_file_for_RSS" "$RSS_FEED_FILE"; then

		# 4: Getting Blog-Entry Headline:
		h1_text=$(grep -oP '(?<=<h1>).*?(?=</h1>)' "$html_file_for_RSS" | head -n 1)

		# 5: Getting the Blog-Entry beginning:
		p_text=$(grep -oP '(?<=<p>).*?(?=</p>)' "$html_file_for_RSS" | head -n 2 | tail -n 1)

		# 6: Cleaning Discription from HTML:
		cleand_p_text=$(echo "$p_text" | sed 's/<[^>]*>//g')

		# Get the current Date for the PubDate:
		current_date=$(date -u +"%a, %d %b %Y %H:%M:%S GMT")

		# 7: Add new RSS-Entry. The double Lines are for indentation and new Line:
		sed -i "/<!-- RSS ENTRYS - START -->/a \
		\\        <item>\n\
			<title>$WEBSITE_NAME - $h1_text</title>\n\
			<link>${DEFAULT_URL_PREFIX}${html_file_for_RSS}</link>\n\
			<description>${cleand_p_text}\n\
			\n\
			${DEFAULT_URL_PREFIX}${html_file_for_RSS}\n\
			</description>\n\
			<pubDate>$current_date</pubDate>\n\
		</item>" "$RSS_FEED_FILE"

		# 8 Clean the target file by removing HTML-Tags:
		# u:
		sed -i 's/<u>//g; s/<\/u>//g' "$RSS_FEED_FILE"

		# 9: Tell user what has been found and added:
		echo "Added $html_file_for_RSS to $RSS_FEED_FILE"
	fi
done <<< "$html_files_for_RSS"

# TempFile CleanUp:
# 7: CleanUp the Temporary-Links-File:
rm $output_file

# - Update Last Seen: ####################################################################################################
# Changes the last seen time stamp. Is written directly into the Footer-HTML:
current_date_time=$(date +"%Y.%m.%d - %H:%M")
sed -i -E "s/(Latest Build:<b>)(.*?)(<\/b>)/\1$current_date_time\3/" "$timeStempFile"

exit
