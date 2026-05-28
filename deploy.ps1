# Kairos Deployment Script
# Run in a PowerShell terminal: cd C:\Users\kylen\projects\kairos; .\deploy.ps1
# You will need to authorize in the browser twice (GitHub + Vercel)

param(
    [string]$RailwayUrl = ""  # Pass after Railway step: .\deploy.ps1 -RailwayUrl "https://xyz.railway.app"
)

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

function Step($n, $msg) {
    Write-Host ""
    Write-Host "[$n] $msg" -ForegroundColor Cyan
}

function OK($msg) { Write-Host "    OK: $msg" -ForegroundColor Green }
function Info($msg) { Write-Host "    $msg" -ForegroundColor Gray }

# ─────────────────────────────────────────────────────────────────────────────
# PHASE A: GitHub
# ─────────────────────────────────────────────────────────────────────────────

Step "1/4" "GitHub — authenticate + create repo + push"

gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Info "Opening browser for GitHub login..."
    gh auth login --web --git-protocol https
}

Set-Location $ROOT
$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Info "Creating private GitHub repo 'kairos'..."
    gh repo create kairos --private --source=. --remote=origin --push
} else {
    Info "Remote exists ($existing) — pushing..."
    git push -u origin master 2>&1 | Out-Null
}

$GITHUB_URL = gh repo view --json url -q ".url"
OK $GITHUB_URL

# ─────────────────────────────────────────────────────────────────────────────
# PHASE B: Railway (manual — needs web UI for DB provisioning)
# ─────────────────────────────────────────────────────────────────────────────

if ($RailwayUrl -eq "") {

    Step "2/4" "Railway — MANUAL STEP REQUIRED"
    Write-Host ""
    Write-Host "  Railway requires a database to be added via the web UI." -ForegroundColor Yellow
    Write-Host "  Do these steps now (takes ~3 minutes):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  1. Go to: https://railway.app/new" -ForegroundColor White
    Write-Host "  2. Click 'Deploy from GitHub repo'" -ForegroundColor White
    Write-Host "  3. Select the 'kairos' repo" -ForegroundColor White
    Write-Host "  4. Set root directory to: kairos-core" -ForegroundColor White
    Write-Host "  5. Deploy — Railway will use the Dockerfile automatically" -ForegroundColor White
    Write-Host "  6. In your Railway project: click + Add Service > Database > PostgreSQL" -ForegroundColor White
    Write-Host "  7. Railway auto-wires DATABASE_URL between the two services" -ForegroundColor White
    Write-Host "  8. Add env var: ENVIRONMENT = production" -ForegroundColor White
    Write-Host "  9. Wait for deployment to go green, copy the public URL from Settings > Networking" -ForegroundColor White
    Write-Host ""
    Write-Host "  Then re-run this script with:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 -RailwayUrl 'https://YOUR-URL.railway.app'" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}

# ─────────────────────────────────────────────────────────────────────────────
# PHASE C: Seed production database
# ─────────────────────────────────────────────────────────────────────────────

Step "3/4" "Seeding production database at $RailwayUrl"

# Verify API is alive
$health = Invoke-RestMethod "$RailwayUrl/health" -ErrorAction Stop
OK "API health: $($health.status)"

# Temporarily patch seed.py
$seedPath = "$ROOT\kairos-core\seed.py"
$original = Get-Content $seedPath -Raw
$patched = $original -replace 'BASE = "http://localhost:8000/v1"', "BASE = `"$RailwayUrl/v1`""
$patched | Set-Content $seedPath -Encoding utf8

try {
    python $seedPath
    OK "Seeded 4 demo executions"
} finally {
    # Always revert even if seed fails
    $original | Set-Content $seedPath -Encoding utf8
    Info "seed.py reverted to localhost"
}

# ─────────────────────────────────────────────────────────────────────────────
# PHASE D: Vercel
# ─────────────────────────────────────────────────────────────────────────────

Step "4/4" "Vercel — deploy kairos-web"

Set-Location "$ROOT\kairos-web"

# Write production env
"NEXT_PUBLIC_KAIROS_API_URL=$RailwayUrl" | Set-Content ".env.production" -Encoding utf8
Info "Set NEXT_PUBLIC_KAIROS_API_URL=$RailwayUrl"

Info "Opening browser for Vercel login..."
vercel login

Info "Deploying to production (takes ~2 minutes)..."
$deployOut = vercel --prod --yes 2>&1
$VERCEL_URL = ($deployOut | Select-String "https://[^\s]+" | Select-Object -Last 1).Matches[0].Value

# Cleanup temp env file
Remove-Item ".env.production" -ErrorAction SilentlyContinue

OK $VERCEL_URL

# ─────────────────────────────────────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Kairos is live" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " GitHub:       $GITHUB_URL"
Write-Host " API:          $RailwayUrl"
Write-Host " API docs:     $RailwayUrl/docs"
Write-Host " Dashboard:    $VERCEL_URL/app"
Write-Host " Landing:      $VERCEL_URL"
Write-Host ""
