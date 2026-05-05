// ISP: Розділені та специфічні інтерфейси
export interface IPaymentProcessor {
    processPayment(amount: number): boolean;
}

export interface IOrderRepository {
    saveOrder(order: any): void;
}

export interface INotificationService {
    sendReceipt(message: string): void;
}

// OCP: Абстракція для стратегії розрахунку доставки
export interface IShippingCalculator {
    calculate(): number;
}