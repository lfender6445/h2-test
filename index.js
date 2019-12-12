const CSS1 = `body { color: green; }`
const CSS2 = `body { color: red; }`

const HTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Server push test</title>
    <link rel="stylesheet" href="h2-test/test-h2.css">
    <link rel="stylesheet" href="h2-test/test-h2-push.css">
  </head>
  <body>
    <h1>Server Push Comparison - See network panel</h1>
  </body>
</html>
`

async function handleRequest(request) {
  // hijack requests to test.css

  if (/test-h2.css$/.test(request.url)) {
    return new Response(CSS1, {
      headers: {
        'content-type': 'text/css',
      },
    })
  }

  if (/test-h2-push.css$/.test(request.url)) {
    return new Response(CSS2, {
      headers: {
        'content-type': 'text/css',
      },
    })
  }

  // NOTE: Link prefix must match wrangler route
  // serve raw HTML using HTTP/2 for the CSS file
  // wrangler route must have wildcard
  // route = "https://example.com/h2-test/*"
  return new Response(HTML, {
    headers: {
      'content-type': 'text/html',
      Link: '</h2-test/test-h2-push.css>; rel=preload;',
    },
  })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
