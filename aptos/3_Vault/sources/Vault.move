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

    public fun init_account<VaultCoin>(account: &signer) acquires VaultStatus {
        let is_vault_status_running = borrow_global<VaultStatus>(signer::address_of(account)).is_running;
        assert!(is_vault_status_running, EVAULT_NOT_RUNNING);
        
        ManagedCoin::publish_balance<VaultCoin>(account);
    }

    public fun balance_of<VaultCoin>(owner: address): u64 {
        ManagedCoin::balance_of<VaultCoin>(owner)
    }

    public fun transfer<VaultCoin: drop>(account: &signer, from: &signer, to: address, amount: u64) acquires VaultStatus {
        let is_vault_status_running = borrow_global<VaultStatus>(signer::address_of(account)).is_running;
        assert!(is_vault_status_running, EVAULT_NOT_RUNNING);

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

    // Tests

    // init
    #[test(account = @Owner)]
    public entry fun module_can_initialize(account: &signer) acquires VaultStatus {
        let addr = signer::address_of(account);
        let amount = 10;

        init(account, amount);

        let balance = balance_of<VaultCoin<u64>>(addr);
        let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
        assert!(is_vault_status_running, EVAULT_NOT_RUNNING);

        assert!(balance == amount, 0);
    }

    #[test(account = @0x1)]
    #[expected_failure]
    public entry fun module_cant_initialize_by_nonowner(account: signer) {
        let amount = 10;

        init(&account, amount);
    }

    // init_account
    // #[test(account = @Owner)]
    // public fun module_can_init_account<VaultCoin>(account: &signer) acquires VaultStatus {
    //     let addr = signer::address_of(account);
    //     let amount = 10;

    //     init(account, amount);
    //     // init_account<VaultCoin>(account);

    //     let balance = balance_of<VaultCoin>(addr);
    //     assert!(balance == amount, 0);

    //     // let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
    //     // assert!(is_vault_status_running, EVAULT_NOT_RUNNING);

    // }

    #[test(account = @0x1)]
    #[expected_failure]
        public fun module_cant_be_init_account_twice<VaultCoin>(account: &signer) acquires VaultStatus {
        init_account<VaultCoin>(account);
        init_account<VaultCoin>(account);
    }

    #[test(account = @Owner)]
    #[expected_failure]
    public fun module_cant_be_init_account_when_no_status<VaultCoin>(account: &signer) acquires VaultStatus {
        let addr = signer::address_of(account);
        let is_vault_status_running = &mut borrow_global_mut<VaultStatus>(addr).is_running;
        *is_vault_status_running = false;

        init_account<VaultCoin>(account);
    }
}