#!/bin/bash
# Install common Kodi addons on Raspberry Pi 4
# Run as your normal user (not root): bash 2-install-addons.sh

set -e

KODI_USERDATA="${HOME}/.kodi/userdata"
KODI_ADDONS="${HOME}/.kodi/addons"
ADDONS_DIR="/tmp/kodi-addons"

mkdir -p "$KODI_ADDONS" "$ADDONS_DIR"

echo "==> Installing Kodi addon repositories..."

# --- Kodi Repository (official) is built-in ---

# Install Fusion / SuperRepo installer (popular 3rd-party source)
FUSION_ZIP="${ADDONS_DIR}/repository.xbmchub.zip"
curl -fsSL "https://fusion.tvaddons.co/repository.xbmchub/repository.xbmchub-1.0.0.zip" \
     -o "$FUSION_ZIP" 2>/dev/null || echo "Warning: Could not download Fusion repo (optional)"

# Unpack any downloaded zips into addons folder
for zip in "$ADDONS_DIR"/*.zip; do
    [ -f "$zip" ] && unzip -qo "$zip" -d "$KODI_ADDONS" && echo "Installed: $(basename $zip)"
done

# --- Built-in addons to enable via advancedsettings ---
ADVANCED="${KODI_USERDATA}/advancedsettings.xml"
if [ ! -f "$ADVANCED" ]; then
    mkdir -p "$KODI_USERDATA"
    cat > "$ADVANCED" << 'EOF'
<advancedsettings version="1.0">
    <splash>false</splash>
    <loglevel hide="false">0</loglevel>
</advancedsettings>
EOF
    echo "Created advancedsettings.xml"
fi

echo ""
echo "==> Done. To install more addons:"
echo "    Kodi > Settings > Add-ons > Install from zip file"
echo "    or:  Kodi > Settings > Add-ons > Install from repository"
