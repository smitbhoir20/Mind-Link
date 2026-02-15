# PowerShell script to reset the MindLink database

$DB_FILE = "backend/mindlink.db"
$WAL_FILE = "backend/mindlink.db-wal"
$SHM_FILE = "backend/mindlink.db-shm"

Write-Host "Resetting MindLink Database..." -ForegroundColor Cyan

# Check if files exist and try to remove them
$files = @($DB_FILE, $WAL_FILE, $SHM_FILE)

foreach ($file in $files) {
    if (Test-Path $file) {
        try {
            Remove-Item $file -Force -ErrorAction Stop
            Write-Host "Removed: $file" -ForegroundColor Green
        }
        catch {
            Write-Host "Could not remove $file. Ensure the server is stopped." -ForegroundColor Red
        }
    }
}

if (!(Test-Path $DB_FILE)) {
    Write-Host "`n✅ Database reset successful." -ForegroundColor Green
    Write-Host "The database will be reinitialized automatically when you next start the server."
}
else {
    Write-Host "`n❌ Database reset failed. Please ensure no other programs are using the file." -ForegroundColor Red
}
