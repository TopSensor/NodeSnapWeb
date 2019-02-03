# NodeSnapWeb
[![Snap Status](https://build.snapcraft.io/badge/bleonard252/NodeSnapWeb.svg)](https://build.snapcraft.io/user/bleonard252/NodeSnapWeb)
![Maintenance: active](https://img.shields.io/badge/maintenance-active-green.svg)

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/nsw)

A configurable node.js server running under snap.

Simply `snap install nsw` to add it to any system. (Use `snap install nsw --edge` to install from master.)

To run it with port 80 and on /var/www/html, run:

```bash
sudo nsw start --port=80 --path=/var/www/html
```

(`sudo` is required to bind to port 80.)
