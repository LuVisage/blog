Add-Type -AssemblyName System.Web

$jsonPath = 'C:\Users\lusha\.claude\projects\C--Users-lusha-Desktop---\ea6d95f8-a90a-405b-9146-690c84e45965\tool-results\mcp-api-tester-http_get-1785065114279.txt'
$json = Get-Content -Path $jsonPath -Raw | ConvertFrom-Json
$body = $json.response.body

# Find all lake-content sections
$lakeIdx = $body.IndexOf('lake-content')
$lakeEnd = $body.IndexOf('<!-- lake-content-end -->', $lakeIdx)
if ($lakeEnd -lt 0) {
    # Try to find end differently
    $afterLake = $body.Substring($lakeIdx)
    if ($afterLake -match 'lake-content[^>]*>(.*?)</div>\s*</div>\s*</div>\s*<div') {
        $encodedContent = $Matches[1]
    } else {
        # Just take a large chunk and manually parse
        $encodedContent = $body.Substring($lakeIdx + 100, 50000)
        $encodedContent = $encodedContent -replace '^[^>]*>', ''
    }
} else {
    $encodedContent = $body.Substring($lakeIdx + 100, $lakeEnd - $lakeIdx - 100)
    $encodedContent = $encodedContent -replace '^[^>]*>', ''
}

# Now split on closing div patterns
# The content seems to be URL-encoded in the appData JSON
# Let's search for the appData JSON which contains the document content

# Find the appData JSON
$appDataIdx = $body.IndexOf('window.appData = JSON.parse(decodeURIComponent("')
if ($appDataIdx -ge 0) {
    $start = $appDataIdx + 'window.appData = JSON.parse(decodeURIComponent("'.Length
    $end = $body.IndexOf('"));', $start)
    $encodedJson = $body.Substring($start, $end - $start)

    # URL decode
    $decodedJson = [System.Web.HttpUtility]::UrlDecode($encodedJson)

    # Save decoded JSON
    $decodedPath = 'C:\Users\lusha\Desktop\博客\yuque_appdata.json'
    $decodedJson | Set-Content -Path $decodedPath -Encoding UTF8

    Write-Output "Saved decoded appData to: $decodedPath"
    Write-Output "Length: $($decodedJson.Length)"

    # Parse the JSON to get the document content
    $appData = $decodedJson | ConvertFrom-Json

    # Try to find the document body/content
    if ($appData.PSObject.Properties['doc']) {
        Write-Output "Found doc property"
        $doc = $appData.doc
        if ($doc.PSObject.Properties['body']) {
            Write-Output "Found doc.body"
            $docBody = $doc.body
            # Remove HTML tags for text
            $textOnly = $docBody -replace '<[^>]+>', ' ' -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&#39;', "'" -replace '&nbsp;', ' '
            $textOnly = $textOnly -replace '\s+', ' '
            $textPath = 'C:\Users\lusha\Desktop\博客\yuque_text.txt'
            $textOnly | Set-Content -Path $textPath -Encoding UTF8
            Write-Output "Saved text to: $textPath"
        }
    }

    # Print top-level properties
    Write-Output "Top-level properties:"
    $appData.PSObject.Properties | ForEach-Object { Write-Output "  - $($_.Name)" }
} else {
    Write-Output "Could not find appData JSON"
    # Look for alternative patterns
    if ($body -match 'window\.appData') {
        Write-Output "Found window.appData but not in expected format"
    }
}
