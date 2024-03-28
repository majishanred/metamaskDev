'use client'
import { Button, Chip, Container, Dialog, DialogTitle, List, ListItem, ListItemButton, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { formatAddress } from "./utils";
import CheckIcon from '@mui/icons-material/Check';

type MetamaskProviderProps = {
  metaMaskProvider: EIP6963ProviderDetail | null;
}

type ManageAccountProps = {
  currentAccount: string | undefined,
  setCurrentAccount: Function;
} & MetamaskProviderProps;

export function ManageAccounts({currentAccount, setCurrentAccount, metaMaskProvider}: ManageAccountProps) {
  const [accounts, setAccounts] = useState<string[]>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function handleLoadAccounts() {
    const accounts = await metaMaskProvider?.provider
        .request({method:'eth_requestAccounts'})
        .catch(console.error);

    if(accounts != null) {
        setAccounts(accounts as string[]);
    };
  };
  
  function handleChangeAccount(account: string) {
    setCurrentAccount(account);
  };
  
  return (
    <>
      <Container sx={{
        marginTop: 2,
        display: 'flex'
      }} disableGutters>
          { currentAccount ? <Chip label={formatAddress(currentAccount)} variant="outlined" color='primary' sx={{ marginRight: 1}} clickable={false}></Chip> : <></>}
          <Button onClick={() => setIsDialogOpen(true)} variant='outlined'>{ accounts ? 'Change account' : 'Load accounts to begin'}</Button>
        </Container>
        <Dialog onClose={() => setIsDialogOpen(false)} open={isDialogOpen}>
          <DialogTitle>Select account</DialogTitle>
          <List>
            {
              accounts?.map(elem => 
                elem != currentAccount ? 
                  <ListItem disableGutters key={elem}>
                    <ListItemButton onClick={() => {
                      handleChangeAccount(elem);
                      setIsDialogOpen(false);
                    }}>{formatAddress(elem)}</ListItemButton>
                  </ListItem>
                :
                  <ListItem disableGutters key={elem}>
                    <ListItemButton onClick={() => {
                      setIsDialogOpen(false);
                    }}><CheckIcon color='primary' sx={{marginRight: 1}}/><span>{formatAddress(elem)}</span></ListItemButton>
                  </ListItem>
              )
            }
            <ListItem>
              <ListItemButton onClick={() => handleLoadAccounts()}>
                <span>{accounts ? 'Reupload accounts' : 'Load accounts'}</span>
              </ListItemButton>
            </ListItem>
          </List>
        </Dialog>
    </>
  );
};