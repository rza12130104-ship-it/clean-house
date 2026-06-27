#!/bin/bash
# Autostart Kodi on boot using systemd (Raspberry Pi 4)
# Run as root: sudo bash 1-autostart-kodi.sh

set -e

KODI_USER="${SUDO_USER:-pi}"

cat > /etc/systemd/system/kodi.service << EOF
[Unit]
Description=Kodi Media Center
After=network.target sound.target

[Service]
User=${KODI_USER}
Group=${KODI_USER}
Type=simple
ExecStart=/usr/bin/kodi-standalone
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable kodi.service
systemctl start kodi.service

echo "Kodi autostart enabled for user: ${KODI_USER}"
echo "Status: $(systemctl is-active kodi.service)"
