import base64
import os

app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
icon_path = os.path.join(app_dir, 'public', 'icons', 'icon-180x180.png')
output_path = os.path.join(app_dir, 'public', 'lionmode.mobileconfig')

with open(icon_path, 'rb') as f:
    icon_base64 = base64.b64encode(f.read()).decode('utf-8')

config_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.lionmodekarate.app.webclip</string>
            <key>PayloadUUID</key>
            <string>B4E17C8A-3E49-411A-9B38-6D70C92F9E51</string>
            <key>PayloadDisplayName</key>
            <string>Lion Mode Karate</string>
            <key>PayloadDescription</key>
            <string>Installs Lion Mode Karate App Icon onto your iPhone Home Screen</string>
            <key>PayloadOrganization</key>
            <string>Lion Mode Karate Academy</string>
            <key>Label</key>
            <string>Lion Mode</string>
            <key>URL</key>
            <string>https://app.lionmodekarate.com/</string>
            <key>IsRemovable</key>
            <true/>
            <key>FullScreen</key>
            <true/>
            <key>Precomposed</key>
            <true/>
            <key>Icon</key>
            <data>
{icon_base64}
            </data>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>Lion Mode Karate App</string>
    <key>PayloadIdentifier</key>
    <string>com.lionmodekarate.profile</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>F9D28B10-5390-410C-B351-40F9E13C8D12</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadOrganization</key>
    <string>Lion Mode Karate Academy</string>
    <key>PayloadDescription</key>
    <string>Installs Lion Mode Karate App Icon onto your iPhone Home Screen.</string>
</dict>
</plist>
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(config_content)

print(f"Generated {output_path} successfully ({os.path.getsize(output_path)} bytes)")
