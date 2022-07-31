module Deployment::Vault {
    use std::signer;
    use Deployment::ManagedCoin;
    
    const MODULE_OWNER: address = @Owner;

    const ENOT_MODULE_OWNER: u64 = 0;
    const EVAULT_NOT_RUNNING: u64 = 1;
    
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

    public fun transfer<VaultCoin: drop>(from: &signer, to: address, amount: u64) acquires VaultStatus {
        ManagedCoin::transfer<VaultCoin>(from, to, amount);
    }

    public fun pause(module_owner: &signer, account: &signer) acquires VaultStatus {
        assert!(signer::address_of(module_owner) == MODULE_OWNER, ENOT_MODULE_OWNER);

        let vault_status = borrow_global_mut<VaultStatus>(signer::address_of(account));
        vault_status.is_running = false;
    }

    public fun unpause(module_owner: &signer, account: &signer) acquires VaultStatus {
        assert!(signer::address_of(module_owner) == MODULE_OWNER, ENOT_MODULE_OWNER);

        let vault_status = borrow_global_mut<VaultStatus>(signer::address_of(account));
        vault_status.is_running = true;
    }

}