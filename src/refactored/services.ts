import { IPaymentProcessor, IOrderRepository, INotificationService, IShippingCalculator } from '../interfaces';

// Реалізації для DIP (Модулі нижнього рівня)
export class PostgresRepository implements IOrderRepository {
    saveOrder(order: any): void {
        console.log("Order saved to Postgres", order);
    }
}

export class StripePaymentProcessor implements IPaymentProcessor {
    processPayment(amount: number): boolean {
        console.log(`Charged $${amount} successfully.`);
        return true;
    }
}

export class EmailNotificationService implements INotificationService {
    sendReceipt(message: string): void {
        console.log(`Email sent: ${message}`);
    }
}

// Реалізації для OCP (Можна додавати нові типи без зміни існуючого коду)
export class StandardShipping implements IShippingCalculator {
    calculate(): number { return 5; }
}

export class ExpressShipping implements IShippingCalculator {
    calculate(): number { return 15; }
}

export class FreeShipping implements IShippingCalculator {
    calculate(): number { return 0; }
}