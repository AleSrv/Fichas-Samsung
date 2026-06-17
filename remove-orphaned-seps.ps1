$fixes = @{
  'r85h-2026.md' = 171
  'r95h-2026.md' = 181
  's83h-2026.md' = 135
  's90h-2026.md' = 132
  's93h-2026.md' = 133
  's95h-2026.md' = 145
  'm80h-2026.md' = 129
  's99h-2026.md' = 140
  'm90h-2026.md' = 118
  'qn1eh-2026.md' = 125
  'qn70h-2026.md' = 133
  'qn73h-2026.md' = 147
}

$base = 'C:\Users\corre\GITHUB\canva-web\src\data\specs'

foreach ($file in $fixes.Keys) {
  $path = Join-Path $base $file
  $lines = Get-Content $path
  $lineNum = $fixes[$file]
  # Remove the line (1-indexed -> 0-indexed)
  $newLines = for ($i = 0; $i -lt $lines.Count; $i++) { if ($i -ne ($lineNum - 1)) { $lines[$i] } }
  Set-Content $path $newLines
  Write-Output "Fixed $file (removed line $lineNum)"
}
