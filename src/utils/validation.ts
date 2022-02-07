export const isValidTransactionId = (id: string): boolean => {
    return /^0x([A-Fa-f0-9]{64})$/.test(id);
}


export const isValidAddress = (address: string): boolean => {
    return /^0x([A-Fa-f0-9]{40})$/.test(address);
}