# Community Garden Kitchens Inventory Scanning

This is the front end of the application. It must be used with the API available at https://github.com/calendee/community-garden-kitchen-barcodes-api

## Development

- `yarn install`
- `yarn dev start`

## Publishing

- When a new branch is pushed to Github, Cloudflare pages will automatically generate a preview URL for usage.
- All changes will be published to production when merged into the `main` branch.
  - As branches are merged into the `main` branch, Cloudflare Pages will automatically rebuild and update the production URL.
