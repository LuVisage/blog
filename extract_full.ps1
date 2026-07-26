$jsonPath = 'C:\Users\lusha\.claude\projects\C--Users-lusha-Desktop---\ea6d95f8-a90a-405b-9146-690c84e45965\tool-results\mcp-api-tester-http_get-1785065114279.txt'
$json = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$body = $json.response.body

# Extract article text: remove scripts, styles, then strip HTML tags
$cleaned = $body -replace '<script[^>]*>.*?</script>', ' ' -replace '<style[^>]*>.*?</style>', ' ' -replace '<[^>]+>', ' ' -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&nbsp;', ' '
$cleaned = $cleaned -replace '\s+', ' '

# Find all cdn.nlark.com image URLs
$imgMatches = [regex]::Matches($body, 'https?://cdn\.nlark\.com/[^"''\s<>]+')
$imgUrls = $imgMatches | ForEach-Object { $_.Value } | Select-Object -Unique

# Find headings (h1-h6)
$headingMatches = [regex]::Matches($body, '<h([1-6])[^>]*>(.*?)</h\1>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$headings = $headingMatches | ForEach-Object {
    $level = $_.Groups[1].Value
    $text = $_.Groups[2].Value -replace '<[^>]+>', ''
    "H${level}: $text"
}

# Find code blocks
$codeMatches = [regex]::Matches($body, '<pre[^>]*><code[^>]*>(.*?)</code></pre>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
$codes = $codeMatches | ForEach-Object { $_.Groups[1].Value } | Select-Object -First 20

Write-Output "=== IMAGE URLS (cdn.nlark.com) ==="
$imgUrls | ForEach-Object { Write-Output $_ }

Write-Output "`n=== HEADINGS ==="
$headings | ForEach-Object { Write-Output $_ }

Write-Output "`n=== CODE BLOCKS ==="
$codes | ForEach-Object { Write-Output $_; Write-Output "---" }

Write-Output "`n=== ARTICLE TEXT ==="
# Extract text between body tags
$bodyContent = ''
if ($body -match '<body[^>]*>(.*)</body>') {
    $bodyContent = $Matches[1]
}
$bodyText = $bodyContent -replace '<script[^>]*>.*?</script>', ' ' -replace '<style[^>]*>.*?</style>', ' ' -replace '<[^>]+>', ' ' -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&nbsp;', ' ' -replace '&#x27;', "'"
$bodyText = $bodyText -replace '\s+', ' '
$bodyText.Trim().Substring(0, [Math]::Min(20000, $bodyText.Trim().Length))
