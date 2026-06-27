#!/bin/bash
# Configure Kodi media library sources (Movies, TV Shows, Music)
# Run as your normal user: bash 3-media-library.sh
# Edit MOVIES_PATH / TV_PATH / MUSIC_PATH to match your actual media locations.

set -e

MOVIES_PATH="${1:-/media/movies}"
TV_PATH="${2:-/media/tvshows}"
MUSIC_PATH="${3:-/media/music}"

SOURCES="${HOME}/.kodi/userdata/sources.xml"
mkdir -p "${HOME}/.kodi/userdata"

cat > "$SOURCES" << EOF
<sources>
    <programs>
        <default pathversion="1"></default>
    </programs>
    <video>
        <default pathversion="1"></default>
        <source>
            <name>Movies</name>
            <path pathversion="1">${MOVIES_PATH}/</path>
            <allowsharing>true</allowsharing>
        </source>
        <source>
            <name>TV Shows</name>
            <path pathversion="1">${TV_PATH}/</path>
            <allowsharing>true</allowsharing>
        </source>
    </video>
    <music>
        <default pathversion="1"></default>
        <source>
            <name>Music</name>
            <path pathversion="1">${MUSIC_PATH}/</path>
            <allowsharing>true</allowsharing>
        </source>
    </music>
    <pictures>
        <default pathversion="1"></default>
    </pictures>
    <files>
        <default pathversion="1"></default>
    </files>
</sources>
EOF

echo "Sources configured:"
echo "  Movies   -> ${MOVIES_PATH}"
echo "  TV Shows -> ${TV_PATH}"
echo "  Music    -> ${MUSIC_PATH}"
echo ""
echo "Restart Kodi then: Videos > Files > Movies > Set content > Movies"
echo "                   Videos > Files > TV Shows > Set content > TV shows"
echo "Custom paths: bash 3-media-library.sh /path/to/movies /path/to/tv /path/to/music"
