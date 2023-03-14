import '@/styles/globals.css'
import LoanProvider from '@/contexts/loans'
import WalletProvider from '@/contexts/wallet';

export default function App({ Component, pageProps }) {

  return <WalletProvider>
    <LoanProvider>
      <Component {...pageProps} />
    </LoanProvider>
  </WalletProvider>
}
