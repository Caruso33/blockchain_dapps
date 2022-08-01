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

    public entry fun init(account: &signer, amount: u64) {
        move_to(account, VaultStatus { is_running: true });

        ManagedCoin::publish_balance<VaultCoin<u64>>(account);

        let mintAddress = signer::address_of(account);
        ManagedCoin::mint<VaultCoin<u64>>(account, mintAddress, amount);
    }

    public fun init_account<VaultCoin>(module_owner: &signer) {
        // let is_vault_status_running = borrow_global<VaultStatus>(signer::address_of(account)).is_running;
        // assert!(is_vault_status_running, EVAULT_NOT_RUNNING);

        assert!(signer::address_of(module_owner) == MODULE_OWNER, ENOT_MODULE_OWNER);

        ManagedCoin::publish_balance<VaultCoin>(module_owner);
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
    // #[test(account = @Owner)]
    // public fun module_can_initialize(account: &signer) acquires VaultStatus {
    //     let addr = signer::address_of(account);
    //     let amount = 10;

    //     init(account, amount);

    //     let balance = balance_of<VaultCoin<u64>>(addr);
    //     assert!(balance == amount, 0);

    //     let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
    //     assert!(is_vault_status_running, EVAULT_NOT_RUNNING);
    // }

    // #[test(account = @0x1)]
    // #[expected_failure]
    // public fun module_cant_initialize_by_nonowner(account: signer) {
    //     let amount = 10;

    //     init(&account, amount);
    // }

    // // init_account
    // #[test(owner = @Owner, account = @TestAccount)]
    // public fun module_can_init_account(owner: &signer, account: &signer)  {
    //     let addr = signer::address_of(account);
    //     let amount = 10;

    //     init(owner, amount);
    //     // init_account<VaultCoin<u64>>(owner);

    //     let balance = balance_of<VaultCoin<u64>>(addr);
    //     assert!(balance == amount, 0);
    // }

    // #[test(module_owner = @Owner, account = @Deployment)]
    // #[expected_failure]
    // public fun module_cant_init_account_twice<VaultCoin>(module_owner: &signer, account: &signer) acquires VaultStatus {
    //     init_account<VaultCoin>(module_owner, account);
    //     init_account<VaultCoin>(module_owner, account);
    // }

    // #[test(module_owner = @Owner, account = @Deployment)]
    // #[expected_failure]
    // public fun module_cant_init_account_when_no_status<VaultCoin>(module_owner: &signer, account: &signer) acquires VaultStatus {
    //     let addr = signer::address_of(account);
    //     let is_vault_status_running = &mut borrow_global_mut<VaultStatus>(addr).is_running;
    //     *is_vault_status_running = false;

    //     init_account<VaultCoin>(module_owner, account);
    // }

    // #[test(account = @Owner, testAccount = @TestAccount)]
    // public fun module_can_balance_of_and_transfer(account: &signer, testAccount: &signer) acquires VaultStatus {
    //     let addr_from = signer::address_of(account);
    //     let addr_to = signer::address_of(testAccount);
        
    //     let amount = 10;
    //     let transferAmount = 4;

    //     init(account, amount);

    //     let balance_from_before = balance_of<VaultCoin<u64>>(addr_from);
    //     let balance_to_before = balance_of<VaultCoin<u64>>(addr_to);

    //     assert!(balance_from_before == amount, 0);
    //     assert!(balance_to_before == 0, 0);

    //     transfer<VaultCoin<u64>>(account, account, addr_to, transferAmount);

    //     let balance_from_after = balance_of<VaultCoin<u64>>(addr_from);
    //     let balance_to_after = balance_of<VaultCoin<u64>>(addr_to);

    //     assert!(balance_from_after == (amount - transferAmount), 0);
    //     assert!(balance_to_after == (0 + transferAmount), 0);
    // }

    // #[test(account = @Owner, testAccount = @TestAccount)]
    // #[expected_failure]
    // public fun module_cant_transfer_when_not_status(account: &signer, testAccount: &signer) acquires VaultStatus {
    //     let addr_from = signer::address_of(account);
    //     let addr_to = signer::address_of(testAccount);

    //     let is_vault_status_running = &mut borrow_global_mut<VaultStatus>(addr_from).is_running;
    //     *is_vault_status_running = false;

    //     transfer<VaultCoin<u64>>(account, account, addr_to, 0);
    // }

    // #[test(module_owner = @Owner, account = @Deployment)]
    // public fun module_can_pause(module_owner: &signer, account: &signer) acquires VaultStatus {
    //     let addr = signer::address_of(account);
        
    //     let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
    //     assert!(is_vault_status_running, 0);

    //     pause(module_owner, account);

    //     let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
    //     assert!(!is_vault_status_running, 0);
    // }

    // #[test(module_owner = @Owner, account = @Deployment)]
    // public fun module_can_unpause(module_owner: &signer, account: &signer) acquires VaultStatus {
    //     let addr = signer::address_of(account);
        
    //     let is_vault_status_running = &mut borrow_global_mut<VaultStatus>(addr).is_running;
    //     *is_vault_status_running = false;

    //     let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
    //     assert!(!is_vault_status_running, 0);

    //     unpause(module_owner, account);

    //     let is_vault_status_running = borrow_global<VaultStatus>(addr).is_running;
    //     assert!(is_vault_status_running, 0);
    // }
}