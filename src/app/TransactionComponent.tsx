'use client'
import { useEffect, useRef, useState } from 'react'
import { useSyncProviders } from '../hooks/useSyncProviders'
import { Box, Button, Container, TextField } from '@mui/material';
import { ManageNetworks } from './ManageNetworks';
import { ManageAccounts } from './ManageAccounts';
import { formatBalance, formatToHex, formatToWei } from './utils';
import { ArrowRightAlt } from '@mui/icons-material';

export const TransactionComponent = () => {
    const metaMaskProvider = useSyncProviders();
    const [currentAccount, setCurrentAccount] = useState<string>();
    const [currentChain, setCurrentChain] = useState<string>();
    const [balance, setBalance] = useState<string>();

    const sendToInputRef = useRef<HTMLInputElement>(null);
    const valueInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(currentAccount != undefined) {
            const value = async () => {
                const rawBalance = await metaMaskProvider?.provider.request({
                    method: 'eth_getBalance',
                    params: [
                        currentAccount,
                        'latest'
                    ]
                }).catch(console.error) as string;

                setBalance(rawBalance);
            };
    
            value();
        };
    }, [currentAccount, currentChain]);

    useEffect(() => {
        const button = document.getElementById('send-transaction-button') as HTMLButtonElement;
        
        if(!(currentChain && currentAccount)) {
            button.disabled = true;
        } else {
            button.disabled = false;
        };
    }, [currentAccount, currentChain]);

    useEffect(() => {
        metaMaskProvider?.provider.request({method: 'eth_chainId'}).then((res) => setCurrentChain(res as string)).catch(console.error);
    }, [metaMaskProvider]);

    async function handleSendTransactioin() {
        const button = document.getElementById('send-transaction-button') as HTMLButtonElement;
        try {
            if(valueInputRef.current!.value == '' || sendToInputRef.current!.value == '') {
                return;
            }

            valueInputRef.current!.disabled = true;
            sendToInputRef.current!.disabled = true;
            button.disabled = true;

            await metaMaskProvider?.provider.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: currentAccount,
                        to: sendToInputRef.current!.value,
                        value: formatToHex(formatToWei(valueInputRef.current!.value as string))
                    }
                ]
            });

            button.disabled = false;
            valueInputRef.current!.disabled = false;
            sendToInputRef.current!.disabled = false;
            
            const value = async () => {
                const rawBalance = await metaMaskProvider?.provider.request({
                    method: 'eth_getBalance',
                    params: [
                        currentAccount,
                        'pending'
                    ]
                }).catch(console.error) as string;

                setBalance(rawBalance);
            };
            
            valueInputRef.current!.value = '';
            sendToInputRef.current!.value = '';
            value();
        } catch (e) {
            console.log(e);
            button.disabled = false;
            valueInputRef.current!.disabled = false;
            sendToInputRef.current!.disabled = false;

            valueInputRef.current!.value = '';
            sendToInputRef.current!.value = '';
        }
    };

    return (
        <Container maxWidth={'sm'} sx={{paddingTop: '50px'}}>
            <ManageNetworks currentChain={currentChain} setCurrentChain={setCurrentChain} metaMaskProvider={metaMaskProvider}></ManageNetworks>
            <ManageAccounts currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} metaMaskProvider={metaMaskProvider}></ManageAccounts>
            <Box sx={{marginTop: 2}}>
                { balance ? <Box><span>Current account balance: {formatBalance(balance)}</span></Box> : <></> }
                <Box>
                    <TextField label="Value" id="value-input" variant="outlined" fullWidth inputRef={valueInputRef} sx={{marginTop: 2}}></TextField>
                    <TextField label="To" id="addres-input" variant="outlined" sx={{marginTop: 2}} fullWidth inputRef={sendToInputRef}></TextField>
                    <Button id='send-transaction-button' color='primary' variant='contained' fullWidth sx={{marginTop: 2}}
                        onClick={() => handleSendTransactioin()}
                    >
                        <span>Send</span>
                        <ArrowRightAlt></ArrowRightAlt>
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}