# Publishing Checklist (v3.0.0)

1. **Tag & Release (GitHub)**
   - [ ] `git tag v3.0.0`
   - [ ] `git push origin v3.0.0`
   - [ ] Wait for GitHub Action "Release" to finish (Uploads binaries).

2. **Publish (NPM)**
   - [ ] `cd npm_wrapper`
   - [ ] `npm publish`

**Note:** The `npm_wrapper` now bundles `node_engine/` inside it.
