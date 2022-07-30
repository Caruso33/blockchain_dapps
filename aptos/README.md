# Infos

## Run

### Aptos Setup

`git clone https://github.com/aptos-labs/aptos-core.git`

`cd aptos-core`

`./scripts/dev_setup.sh`

`cargo build`

`source ~/.cargo/env`

(optional)
`git checkout --track origin/devnet`

### Move Setup

`git clone https://github.com/move-language/move.git`

`cd move`

(optional)
`./scripts/dev_setup.sh` (as alternative to aptos dev_setup)

`cargo install --path language/tools/move-cli`

(VS Extension)

`cargo install --path language/move-analyzer`

Search for `move-analyzer`

### Build

`move package build`

better:

`aptos move compile`

### Test

`aptos move test`
