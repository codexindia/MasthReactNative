import { create } from 'zustand'

type QRStore = {
  qr: string
  setQR: (qr: string) => void
}
const useQRStore = create<QRStore>((set) => ({
  qr: __DEV__ ? 'codeAbinash' : '',
  setQR: (qr: string) => set({ qr }),
}))

export default useQRStore
