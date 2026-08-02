param(
    [ValidateRange(1, 65535)]
    [int]$BackendPort = 8080
)

$ErrorActionPreference = 'Stop'

Write-Host "Creating a public tunnel to http://localhost:$BackendPort ..."
$tunnelJob = Start-Job -ScriptBlock {
    param($Port)
    & npx.cmd --yes localtunnel --port $Port 2>&1
} -ArgumentList $BackendPort

try {
    $tunnelUrl = $null
    $deadline = (Get-Date).AddSeconds(60)

    while ((Get-Date) -lt $deadline -and -not $tunnelUrl) {
        Start-Sleep -Milliseconds 500
        $output = (Receive-Job -Job $tunnelJob -Keep | Out-String)
        $match = [regex]::Match($output, 'https://[^\s]+')
        if ($match.Success) {
            $tunnelUrl = $match.Value.TrimEnd('/')
        }
    }

    if (-not $tunnelUrl) {
        throw "The backend tunnel did not start. Ensure a server is listening on port $BackendPort."
    }

    $env:EXPO_PUBLIC_API_URL = "$tunnelUrl/"
    Write-Host "Backend URL: $env:EXPO_PUBLIC_API_URL"
    Write-Host 'Starting Expo with its device tunnel. Press Ctrl+C to stop both tunnels.'
    & npx.cmd expo start --tunnel --clear
}
finally {
    if ($tunnelJob) {
        Stop-Job -Job $tunnelJob -ErrorAction SilentlyContinue
        Remove-Job -Job $tunnelJob -Force -ErrorAction SilentlyContinue
    }
}
