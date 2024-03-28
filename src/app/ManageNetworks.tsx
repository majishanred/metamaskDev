'use client'
import { Button, Chip, Container, Dialog, DialogTitle, List, ListItem, ListItemButton } from "@mui/material";
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';

type MetamaskProviderProps = {
  metaMaskProvider: EIP6963ProviderDetail | null
}

type ManageNetworksProps = {
  currentChain: string | undefined,
  setCurrentChain: Function
} & MetamaskProviderProps

export function ManageNetworks({currentChain, setCurrentChain, metaMaskProvider }: ManageNetworksProps) {
  const chains = {
    '0x1': 'eth',
    '0xaa36a7': 'sepolia',
    '0x38': 'bnb',
    '0x61': 'bnb smartchain testnet'
  };

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function handlechangeNetwork(network: string) {
      try {
        await metaMaskProvider?.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{
                "chainId": network
            }]
        });

        setCurrentChain(network);
      }
      catch (e) {
          console.error(e);
      }
  };

  return (
    <>
      <Container disableGutters>
        { currentChain ? <Chip label={chains[currentChain].toUpperCase()} variant="outlined" color='primary' clickable={false} sx={{ marginRight: 1}}></Chip> : <></>}
        <Button onClick={() => setIsDialogOpen(true)} variant='outlined'>Change network</Button>
      </Container>
      <Dialog onClose={() => setIsDialogOpen(false)} open={isDialogOpen}>
        <DialogTitle>Select network</DialogTitle>
        <List>
          {
            Object.entries(chains).map(elem => 
              elem[0] != currentChain ? 
                <ListItem disableGutters key={elem[0]}>
                  <ListItemButton onClick={() => {
                    handlechangeNetwork(elem[0]);
                    setIsDialogOpen(false);
                  }}>{elem[1].toUpperCase()}</ListItemButton>
                </ListItem>
              :
                <ListItem disableGutters key={elem[0]}>
                  <ListItemButton onClick={() => {
                    handlechangeNetwork(elem[0]);
                    setIsDialogOpen(false);
                  }}><CheckIcon color='primary'/><span>{elem[1].toUpperCase()}</span></ListItemButton>
                </ListItem>
            )
          }
        </List>
      </Dialog>
    </>
  )
}