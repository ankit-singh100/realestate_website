// dto/create-payment.dto.ts
export class CreatePaymentDto {
  userId: number;
  propertyId: number;
  amount: number;
  khaltiToken: string;
}
