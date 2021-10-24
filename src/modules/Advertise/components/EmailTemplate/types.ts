export interface EmailTemplateProps extends AdvertisePurchase {
  uuid: string
}

export interface ThankYouProps {
  auctionId: number
  selectedDates: string[]
  paymentMethod: PaymentMethods
  paymentCharacter: string
  locale: string
}

export interface SummaryProps {
  uuid: string
  advertisedCharacter: string
  auctionId: number
  selectedDates: string[]
  paymentMethod: PaymentMethods
  locale: string
}