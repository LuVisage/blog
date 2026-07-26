$jsonPath = 'C:\Users\lusha\Desktop\博客\yuque_appdata.json'
$appData = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$doc = $appData.doc

# Get cachedContent
$cached = $doc._cachedContent
Write-Output "=== CachedContent Properties ==="
foreach ($prop in $cached.PSObject.Properties) {
    $val = $prop.Value
    if ($null -eq $val) {
        Write-Output "$($prop.Name): NULL"
    } elseif ($val -is [string]) {
        Write-Output "$($prop.Name): string, length=$($val.Length)"
    } else {
        Write-Output "$($prop.Name): $($val.GetType().FullName)"
    }
}

# Try to get _cache_decrypted_body
if ($cached.PSObject.Properties['_cache_decrypted_body'] -and $cached._cache_decrypted_body -is [string]) {
    $decrypted = $cached._cache_decrypted_body
    Write-Output ""
    Write-Output "=== _cache_decrypted_body ==="
    Write-Output "Length: $($decrypted.Length)"

    # Save it
    $decrypted | Set-Content -Path 'C:\Users\lusha\Desktop\博客\yuque_decrypted_body.txt' -Encoding UTF8

    # Strip HTML
    $text = $decrypted -replace '<[^>]+>', ' '
    $text = $text -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&nbsp;', ' '
    $text = $text -replace '\s+', ' '

    $textPath = 'C:\Users\lusha\Desktop\博客\yuque_article_text.txt'
    $text | Set-Content -Path $textPath -Encoding UTF8

    Write-Output "Full text first 3000 chars:"
    Write-Output $text.Substring(0, [Math]::Min(3000, $text.Length))
    Write-Output "..."
    Write-Output "Total text length: $($text.Length)"
}
