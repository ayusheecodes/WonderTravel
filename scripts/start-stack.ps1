<#
.\scripts\start-stack.ps1
PowerShell helper to bring up Docker Compose, wait for health, and run a smoke POST.
Run from PowerShell: `powershell -ExecutionPolicy Bypass -File .\scripts\start-stack.ps1`
#>
param(
    [int]$MaxAttempts = 20,
    [int]$SleepSeconds = 3
)

# Resolve repository root (script lives in scripts/)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $repoRoot

Write-Host "Repository root: $repoRoot"

# Ensure Docker is available
try {
    docker info > $null 2>&1
} catch {
    Write-Error "Docker does not appear to be running. Start Docker Desktop and try again."
    exit 1
}

Write-Host "Starting Docker Compose (build if needed)..."
docker compose up -d --build

Write-Host "Waiting for server /health to respond (max $MaxAttempts attempts)"
$status = '000'
for ($i=1; $i -le $MaxAttempts; $i++) {
    try {
        $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/health' -UseBasicParsing -TimeoutSec 5
        if ($null -ne $resp -and $resp.status -eq 'ok') {
            Write-Host "Server ready: $($resp | ConvertTo-Json -Depth 2)"
            $status = '200'
            break
        }
    } catch {
        # ignore
    }
    Write-Host "Waiting for server... attempt $i/$MaxAttempts"
    Start-Sleep -Seconds $SleepSeconds
}

if ($status -ne '200') {
    Write-Error "Server did not become ready within timeout. Dumping last 200 lines of server logs:"
    docker compose logs --tail 200 server
    exit 1
}

Write-Host "Running smoke POST to /api/itinerary/generate"
$body = @{ destination = 'Manali'; days = 1; budget = 'Rs 10000'; style = 'relaxed'; travelers = '1 Person' } | ConvertTo-Json
try {
    $result = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/itinerary/generate' -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 10
    Write-Host "Smoke test response:"; $result | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Error "Smoke test failed: $_"
    docker compose logs --tail 200 server
    exit 1
}

Write-Host "All done — stack is up and smoke test passed."
