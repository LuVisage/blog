$jsonPath = 'C:\Users\lusha\.claude\projects\C--Users-lusha-Desktop---\ea6d95f8-a90a-405b-9146-690c84e45965\tool-results\mcp-api-tester-http_get-1785065114279.txt'
$json = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$body = $json.response.body

Write-Output "Body length: $($body.Length)"

Write-Output ""
Write-Output "=== Searching for content markers ==="
$patterns = @('NodeJS', 'Git', 'Python', '入门', '项目实战', 'lark-content', 'yuque-content', 'lake-content', 'doc-content', 'markdown-body', 'article-content')
foreach ($p in $patterns) {
    $found = [regex]::Matches($body, $p).Count
    Write-Output "Pattern '$p': $found matches"
}

Write-Output ""
Write-Output "=== All CDN images ==="
$imgPatterns = [regex]::Matches($body, 'https?://cdn\.nlark\.com/[^"''\s<>]+')
$seen = @{}
foreach ($m in $imgPatterns) {
    $url = $m.Value
    if (-not $seen.ContainsKey($url)) {
        $seen[$url] = $true
        Write-Output $url
    }
}

Write-Output ""
Write-Output "=== Article-related content ==="
$artIdx = $body.IndexOf('article')
if ($artIdx -ge 0) {
    $context = $body.Substring([Math]::Max(0, $artIdx - 100), [Math]::Min(500, $body.Length - [Math]::Max(0, $artIdx - 100)))
    Write-Output $context
}

# Search for any markdown-like content
Write-Output ""
Write-Output "=== Looking for rendered markdown ==="
$mdIdx = $body.IndexOf('lark-content')
if ($mdIdx -ge 0) {
    $context2 = $body.Substring($mdIdx, [Math]::Min(2000, $body.Length - $mdIdx))
    Write-Output $context2
} else {
    # Try alternate class names
    $contentClasses = @('lake-content', 'yuque-doc-content', 'doc-card', 'markdown-preview')
    foreach ($c in $contentClasses) {
        $ci = $body.IndexOf($c)
        if ($ci -ge 0) {
            Write-Output "Found '$c' at position $ci"
            Write-Output $body.Substring($ci, [Math]::Min(1000, $body.Length - $ci))
            Write-Output "---"
        }
    }
}
