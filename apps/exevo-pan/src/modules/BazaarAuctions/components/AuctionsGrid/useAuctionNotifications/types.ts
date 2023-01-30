import type { RegisterAuctionNotificationInput } from 'server/registerAuctionNotification'

export type AuctionConfigProps = Pick<
  RegisterAuctionNotificationInput,
  'auctionId' | 'auctionEnd' | 'nickname'
> & { outfitId: string }

export type AuctionNotificationsContextData = {
  isSupported: boolean
  openNotificationsDialog: (config: AuctionConfigProps) => void
}

export type AuctionNotificationsProviderProps = {
  children: JSX.Element
}

export type NotificationDateArgs = {
  auctionEnd: number
  timeMode: 'minutes' | 'hours'
  timeValue: number
}
