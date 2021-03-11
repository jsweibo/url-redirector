# url-redirector

It can redirect URL based on user settings

## Exmaple

### Rule

```json
[
  ["*://ajax.googleapis.com/*", "googleapis.com", "googleapis.cnpmjs.org"],
  ["*://fonts.googleapis.com/*", "googleapis.com", "googleapis.cnpmjs.org"],
  ["*://www.google.com/chrome/*", "google.com", "google.cn"],
  ["*://developer.android.com/*", "android.com", "android.google.cn"],
  ["*://translate.google.com/*", "google.com", "google.cn"],
  ["*://www.google.com/recaptcha/*", "google.com", "recaptcha.net"],
  ["*://cdnjs.cloudflare.com/*", "cdnjs.cloudflare.com", "cdn.bootcdn.net"]
]
```

### Result

| Before | After |
| - | - |
| `https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js` | `https://ajax.googleapis.cnpmjs.org/ajax/libs/jquery/1.12.4/jquery.min.js` |
| `https://fonts.googleapis.com/css?family=Source+Code+Pro` | `https://fonts.googleapis.cnpmjs.org/css?family=Source+Code+Pro` |

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present jsweibo
