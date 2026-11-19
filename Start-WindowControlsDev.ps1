[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$extensionDirectory = Split-Path -Parent $PSCommandPath
$extensionFile = Join-Path $extensionDirectory 'window-controls.js'

if (-not (Test-Path -LiteralPath $extensionFile)) {
    throw "Could not find $extensionFile."
}

$candidates = @(
    (Get-Command spicetify -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source),
    (Join-Path $env:USERPROFILE '.spicetify\spicetify.exe'),
    (Join-Path $env:LOCALAPPDATA 'spicetify\spicetify.exe'),
    (Join-Path $env:APPDATA 'spicetify\spicetify.exe')
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

if (-not $candidates) {
    throw 'Spicetify CLI was not found. Install it, or add spicetify.exe to PATH, then rerun this script.'
}

$spicetify = $candidates[0]

Write-Host 'Watching window-controls.js. Saved changes will hot-reload in Spotify.' -ForegroundColor Cyan
Write-Host 'Press Ctrl+C here to stop watching.' -ForegroundColor DarkGray

Push-Location $extensionDirectory
try {
    & $spicetify watch -le
}
finally {
    Pop-Location
}
