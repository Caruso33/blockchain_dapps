type HHDeploy {
    
        getNamedAccounts: () => Promise<{ [name: string]: string }>,
        deployments: {
            deploy: (contractName: string, options?: any) => Promise<any>
            log: (message: string) => void
        }
    
}