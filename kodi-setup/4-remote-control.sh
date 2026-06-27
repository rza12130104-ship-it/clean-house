#!/bin/bash
# Enable Kodi Web Interface + JSON-RPC remote control
# Run as your normal user: bash 4-remote-control.sh
# After running, control Kodi from any browser on your network:
#   http://<raspberry-pi-ip>:8080

set -e

USERDATA="${HOME}/.kodi/userdata"
mkdir -p "$USERDATA"

# --- Enable web server in Kodi settings ---
GUISETTINGS="${USERDATA}/guisettings.xml"

if [ ! -f "$GUISETTINGS" ]; then
    cat > "$GUISETTINGS" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<settings version="2">
</settings>
EOF
fi

# Patch or append webserver settings using Python (safe XML edit)
python3 << 'PYEOF'
import xml.etree.ElementTree as ET
import sys, os

path = os.path.expanduser("~/.kodi/userdata/guisettings.xml")
tree = ET.parse(path)
root = tree.getroot()

settings = {
    "services.webserver":        ("boolean", "true"),
    "services.webserverport":    ("integer", "8080"),
    "services.webserverusername":("string",  "kodi"),
    "services.webserverpassword":("string",  "kodi"),
    "services.zeroconf":         ("boolean", "true"),
    "services.devicename":       ("string",  "Kodi-RPi4"),
}

for sid, (stype, val) in settings.items():
    el = root.find(f".//setting[@id='{sid}']")
    if el is None:
        el = ET.SubElement(root, "setting")
        el.set("id", sid)
        el.set("type", stype)
    el.text = val

tree.write(path, encoding="utf-8", xml_declaration=True)
print("guisettings.xml updated.")
PYEOF

echo ""
echo "==> Web interface will be active after Kodi restarts."
echo "    URL:      http://$(hostname -I | awk '{print $1}'):8080"
echo "    Username: kodi"
echo "    Password: kodi"
echo ""
echo "==> JSON-RPC example (play/pause toggle):"
echo "    curl -s -u kodi:kodi \\"
echo "      http://$(hostname -I | awk '{print $1}'):8080/jsonrpc \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"jsonrpc\":\"2.0\",\"method\":\"Player.PlayPause\",\"params\":{\"playerid\":1},\"id\":1}'"
echo ""

# --- CEC (HDMI-CEC remote control) ---
if ! dpkg -l libcec6 &>/dev/null 2>&1; then
    echo "==> Installing CEC support for HDMI remote control..."
    sudo apt-get install -y libcec6 cec-utils
    echo "CEC installed. Your TV remote should now control Kodi via HDMI."
else
    echo "==> CEC already installed."
fi
