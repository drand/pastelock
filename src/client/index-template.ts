export const indexTemplate = (html: string, css: string) => `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>pastelock</title>
    <link rel="stylesheet" href="./public/styles.css"/>
    ${css}
    <script async type="text/javascript" src="./public/app.js"></script>
</head>
<body>
<div id="root">${html}</div>
</body>
</html>
`