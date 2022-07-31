module Deployment::Vault {
    use std::signer;
    use Deployment::ManagedCoin;
    
    struct VaultCoin<phantom CoinType> has key, drop { }

    struct VaultStatus has key {
        is_running: bool
    }

    fun init(account: &signer, amount: u64) {
        move_to(account, VaultStatus { is_running: true });

        ManagedCoin::publish_balance<VaultCoin<u64>>(account);

        let mintAddress = signer::address_of(account);
        ManagedCoin::mint<VaultCoin<u64>>(account, mintAddress, amount);
    }

    public fun publish_balance<VaultCoin>(account: &signer) {
        ManagedCoin::publish_balance<VaultCoin>(account);
    }

    public fun balance_of<VaultCoin>(owner: address): u64 {
        ManagedCoin::balance_of<VaultCoin>(owner)
    }

    public fun transfer<VaultCoin: drop>(from: &signer, to: address, amount: u64) {
        ManagedCoin::transfer<VaultCoin>(from, to, amount);
    }
}