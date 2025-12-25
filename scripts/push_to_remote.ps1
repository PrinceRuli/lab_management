#!/usr/bin/env pwsh
<#
One-click PowerShell script to add a git remote and push the current workspace.
Run locally: Open PowerShell in the repo root and run `./scripts/push_to_remote.ps1`.

It will:
- Prompt for remote URL (defaults to https://github.com/PrinceRuli/lab_management.git)
- Initialize git if necessary
- Stage and commit changes (if any)
- Add or update `origin` remote
- Push to `main` (option to force)

Do NOT run this script on a repo you don't intend to overwrite when using force push.
#>

Set-StrictMode -Version Latest

function Exec($cmd) {
    Write-Host "=> $cmd"
    $proc = Start-Process -FilePath "pwsh" -ArgumentList "-NoProfile","-Command",$cmd -PassThru -Wait -NoNewWindow -RedirectStandardOutput -RedirectStandardError
    if ($proc.ExitCode -ne 0) {
        throw "Command failed: $cmd (exit $($proc.ExitCode))"
    }
}

try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "git not found in PATH. Install git and re-run."
        exit 1
    }

    $default = 'https://github.com/PrinceRuli/lab_management.git'
    $inputUrl = Read-Host "Remote repository URL (leave empty for $default)"
    if ([string]::IsNullOrWhiteSpace($inputUrl)) { $remoteUrl = $default } else { $remoteUrl = $inputUrl }

    Write-Host "Using remote: $remoteUrl"

    # Ensure repo initialized
    $inside = & git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Git repo not found — initializing..."
        git init
    } else {
        Write-Host "Git repo detected."
    }

    # Stage all changes
    git add -A

    # Commit if there are staged changes
    $status = git status --porcelain
    if ($status) {
        $msg = Read-Host "Commit message (leave empty for 'Import local workspace')"
        if ([string]::IsNullOrWhiteSpace($msg)) { $msg = 'Import local workspace' }
        git commit -m "$msg"
    } else {
        Write-Host "No changes to commit."
    }

    # Remote handling
    $existing = & git remote get-url origin 2>$null
    if ($LASTEXITCODE -eq 0 -and $existing) {
        Write-Host "Remote 'origin' already set to: $existing"
        $resp = Read-Host "Replace remote 'origin' with $remoteUrl ? (y/N)"
        if ($resp -match '^(y|Y)') {
            git remote remove origin
            git remote add origin $remoteUrl
        } else {
            Write-Host "Keeping existing remote."
        }
    } else {
        git remote add origin $remoteUrl
    }

    # Ensure branch name main
    git branch -M main 2>$null

    $forceResp = Read-Host "Force push (will overwrite remote history)? (y/N)"
    if ($forceResp -match '^(y|Y)') {
        git push -u origin main --force
    } else {
        git push -u origin main
    }

    Write-Host "Done. Remote set and push completed."
} catch {
    Write-Error "Error: $_"
    exit 1
}
