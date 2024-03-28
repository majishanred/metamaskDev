import BigNumber from "bignumber.js";

export const formatBalance = (rawBalance: string) => {
  const balance = (BigNumber(rawBalance, 16).dividedBy(BigNumber('1000000000000000000'))).toFixed(2)
  return balance
};

export const formatToWei = (eth: string) => {
  let value = BigNumber(eth).multipliedBy(10**18);
  value = value.isPositive() ? value : value.multipliedBy(-1);
  return value.toString(16);
}

export const formatToHex = (num: string) => {
  return '0x' + num
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0,2) + addr.slice(2)
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`
}