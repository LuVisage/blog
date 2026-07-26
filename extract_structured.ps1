Add-Type -AssemblyName System.Web

$htmlPath = 'C:\Users\lusha\Desktop\博客\yuque_decrypted_body.txt'
$html = Get-Content -Path $htmlPath -Raw -Encoding UTF8

# Extract headings
Write-Output "=== HEADINGS ==="
$headingPattern = '<h([1-6])\s+id="([^"]*)"[^>]*><span[^>]*>([^<]*)</span></h\1>'
$headingMatches = [regex]::Matches($html, $headingPattern)
$headings = @()
foreach ($m in $headingMatches) {
    $level = $m.Groups[1].Value
    $id = $m.Groups[2].Value
    $text = $m.Groups[3].Value
    $headings += "H${level}: $text (id=$id)"
    Write-Output "H${level}: $text (id=$id)"
}

# Extract images
Write-Output ""
Write-Output "=== CDN.NLARK.COM IMAGE URLS ==="
$imgPattern = 'https://cdn\.nlark\.com/[^"''\s<>]+'
$imgMatches = [regex]::Matches($html, $imgPattern)
$seen = @{}
$imgUrls = @()
foreach ($m in $imgMatches) {
    $url = $m.Value
    if (-not $seen.ContainsKey($url)) {
        $seen[$url] = $true
        $imgUrls += $url
    }
}
# Also check for any other image URLs
$allImgPattern = '<img\s+src="([^"]+)"'
$allImgMatches = [regex]::Matches($html, $allImgPattern)
foreach ($m in $allImgMatches) {
    $url = $m.Groups[1].Value
    if ($url -like '*cdn.nlark.com*' -and -not $seen.ContainsKey($url)) {
        $seen[$url] = $true
        $imgUrls += $url
    }
}
Write-Output "Total unique CDN images: $($imgUrls.Count)"
$imgUrls | ForEach-Object { Write-Output $_ }

# Extract code blocks
Write-Output ""
Write-Output "=== CODE BLOCKS ==="
$codePattern = '<pre[^>]*><code[^>]*>(.*?)</code></pre>'
$codeMatches = [regex]::Matches($html, $codePattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
$codes = @()
$i = 1
foreach ($m in $codeMatches) {
    $code = $m.Groups[1].Value
    $code = $code -replace '<[^>]+>', '' -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'"
    Write-Output "Code block $i :"
    Write-Output $code
    Write-Output "---"
    $codes += $code
    $i++
}

# Clean text for full content
Write-Output ""
Write-Output "=== FULL CLEAN TEXT ==="
$text = $html -replace '<script[^>]*>.*?</script>', ' ' -replace '<style[^>]*>.*?</style>', ' '
$text = $text -replace '<[^>]+>', ' '
$text = $text -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&nbsp;', ' '
$text = $text -replace '\s+', ' '
$textPath = 'C:\Users\lusha\Desktop\博客\yuque_full_text.txt'
$text.Trim() | Set-Content -Path $textPath -Encoding UTF8
Write-Output $text.Trim()
