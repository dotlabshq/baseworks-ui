# npm publish for @baseworks/ui. It ships its TypeScript source (consumers'
# bundlers compile it), so there is no build: `just publish` typechecks,
# packs with pnpm, checks the tarball and publishes that same tarball.
# Requires `npm login` (public scope).
default:
    @just --list

test:
    pnpm exec tsc --noEmit -p .

pack: test
    rm -rf .pack && mkdir .pack
    pnpm pack --pack-destination .pack
    node scripts/check-pack.mjs .pack/*.tgz

publish: pack
    npm publish .pack/*.tgz --access public
