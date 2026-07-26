$json = Get-Content -Path 'C:\Users\lusha\.claude\projects\C--Users-lusha-Desktop---\ea6d95f8-a90a-405b-9146-690c84e45965\tool-results\mcp-api-tester-http_get-1785065114279.txt' -Raw | ConvertFrom-Json
$body = $json.response.body
$idx = $body.IndexOf('目前我们已经完成')
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 200)
    $end = [Math]::Min($body.Length, $start + 8000)
    $body.Substring($start, $end - $start)
} else {
    "Content not found at expected position"
    # Print content after <body>
    $bodyIdx = $body.IndexOf('<body')
    if ($bodyIdx -ge 0) {
        $body.Substring($bodyIdx, [Math]::Min(3000, $body.Length - $bodyIdx))
    }
}
