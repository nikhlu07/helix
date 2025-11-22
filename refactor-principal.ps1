# Principal to AccountId Refactoring Script
# This script carefully replaces principal references with accountId

$ErrorActionPreference = "Stop"

# Define replacement patterns (order matters!)
$replacements = @(
    # Function parameters and variables
    @{ Pattern = '\bprincipalId\b'; Replacement = 'accountId' }
    # Type properties
    @{ Pattern = '\bprincipal_id\b'; Replacement = 'accountId' }
    # Object properties (but not in strings)
    @{ Pattern = '(?<![''"])principal(?![''"]):\s*'; Replacement = 'accountId: ' }
    # Header names
    @{ Pattern = 'X-Principal-ID'; Replacement = 'X-Account-ID' }
    # Getter method
    @{ Pattern = '\buserPrincipal\b'; Replacement = 'userAccountId' }
    # Private field
    @{ Pattern = 'private principal:'; Replacement = 'private accountId:' }
    # this.principal
    @{ Pattern = 'this\.principal\b'; Replacement = 'this.accountId' }
)

# Files to process
$filesToProcess = @(
    "frontend\src\auth\types.ts",
    "frontend\src\auth\hederaWallet.ts",
    "frontend\src\contexts\AuthContext.tsx",
    "frontend\src\services\corruptGuardService.ts",
    "frontend\src\types\index.ts",
    "frontend\src\components\Admin\PrincipalRoleManager.tsx",
    "frontend\src\components\Auth\HederaAuthDemo.tsx",
    "frontend\src\components\common\RoleGate.tsx",
    "frontend\src\hooks\useContracts.ts",
    "frontend\src\data\mockData.ts"
)

$processedCount = 0
$errorCount = 0

foreach ($file in $filesToProcess) {
    $fullPath = Join-Path "c:\Users\HPP\Downloads\hacks\Helix" $file
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "Skipping $file - not found" -ForegroundColor Yellow
        continue
    }
    
    try {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Apply replacements
        foreach ($rep in $replacements) {
            $content = $content -replace $rep.Pattern, $rep.Replacement
        }
        
        # Only write if changed
        if ($content -ne $originalContent) {
            Set-Content $fullPath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✓ Updated" -ForegroundColor Green
            $processedCount++
        } else {
            Write-Host "  - No changes needed" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`nSummary:" -ForegroundColor White
Write-Host "  Processed: $processedCount files" -ForegroundColor Green
Write-Host "  Errors: $errorCount files" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
