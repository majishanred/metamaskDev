declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent
  }
}

let metaMaskProvider: EIP6963ProviderDetail | null = null;

export const store = {
  value: ()=>metaMaskProvider,
  subscribe: (callback: ()=>void)=>{
      function onAnnouncement(event: EIP6963AnnounceProviderEvent){
          if(metaMaskProvider) return
          metaMaskProvider = event.detail.info.name == 'MetaMask' ? event.detail : null;
          callback();
      }
      window.addEventListener("eip6963:announceProvider", onAnnouncement);
      window.dispatchEvent(new Event("eip6963:requestProvider"));
  
      return ()=>window.removeEventListener("eip6963:announceProvider", onAnnouncement)
  }
}