Add-Type -AssemblyName System.Web

$jsonPath = 'C:\Users\lusha\.claude\projects\C--Users-lusha-Desktop---\ea6d95f8-a90a-405b-9146-690c84e45965\tool-results\mcp-api-tester-http_get-1785065114279.txt'
$json = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$body = $json.response.body

# Find the lake-content section in the body
# It's encoded in the URL embedded in the appData JSON
# Find: "lake-content"
$pattern = 'lake-content[^>]*>(.*?)</div>'
$match = [regex]::Match($body, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($match.Success) {
    $lakeContent = $match.Groups[1].Value
    Write-Output "Found lake-content section. Raw length: $($lakeContent.Length)"
    # URL decode
    $decoded = [System.Web.HttpUtility]::UrlDecode($lakeContent)
    Write-Output "Decoded length: $($decoded.Length)"
    Write-Output ""
    Write-Output "=== First 3000 chars of decoded lake-content ==="
    Write-Output $decoded.Substring(0, [Math]::Min(3000, $decoded.Length))
} else {
    Write-Output "lake-content not found with simple pattern"
    # Try finding it differently
    $idx = $body.IndexOf('lake-content')
    if ($idx -ge 0) {
        $chunk = $body.Substring($idx, 2000)
        Write-Output "Found at position $idx, first 2000 chars:"
        Write-Output $chunk
    }
}
