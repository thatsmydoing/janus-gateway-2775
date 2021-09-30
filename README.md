Reproduction case for https://github.com/meetecho/janus-gateway/issues/2775

## Setup

Janus built with:

```
CFLAGS="-O1 -g3 -ggdb3 -fno-omit-frame-pointer -fsanitize=address -fno-sanitize-recover=all -fsanitize-address-use-after-scope" \
LDFLAGS=-fsanitize=address \
./configure \
--disable-static \
--disable-all-plugins \
--disable-all-transports \
--disable-all-handlers \
--enable-plugin-videoroom \
--enable-websockets
```

Config used is in `config`

## Run Test

Run the stress test with

```
npm install
node index.js
```
