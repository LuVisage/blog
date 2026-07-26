$jsonPath = 'C:\Users\lusha\Desktop\博客\yuque_appdata.json'
$appData = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json

# Explore doc structure
Write-Output "=== Doc Property Names ==="
$appData.doc.PSObject.Properties | ForEach-Object { Write-Output "  $($_.Name)" }

# Try to get body
if ($appData.doc.PSObject.Properties['body']) {
    Write-Output "Body type: $($appData.doc.body.GetType().FullName)"
    Write-Output ""
    Write-Output "=== Body Content ==="
    $bodyContent = $appData.doc.body
    # Save raw body
    $bodyContent | Set-Content -Path 'C:\Users\lusha\Desktop\博客\yuque_raw_body.txt' -Encoding UTF8
    Write-Output "Raw body saved. Length: $($bodyContent.Length)"

    # Try to extract text
    if ($bodyContent -is [string]) {
        $text = $bodyContent -replace '<[^>]+>', ' '
        $text = $text -replace '\s+', ' '
        $text.Trim() | Set-Content -Path 'C:\Users\lusha\Desktop\博客\yuque_cleaned.txt' -Encoding UTF8
        Write-Output "Cleaned text saved. First 2000 chars:"
        Write-Output $text.Trim().Substring(0, [Math]::Min(2000, $text.Trim().Length))
    }
} else {
    Write-Output "No 'body' property on doc"
    # Try other properties that might contain content
    foreach ($prop in $appData.doc.PSObject.Properties) {
        $val = $prop.Value
        if ($val -is [string]) {
            Write-Output "  $($prop.Name): $($val.Substring(0, [Math]::Min(200, $val.Length)))"
        } else {
            Write-Output "  $($prop.Name): $($val.GetType().FullName)"
        }
    }
}
