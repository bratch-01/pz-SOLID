import { IPaymentProcessor, IOrderRepository, INotificationService, IShippingCalculator } from '../interfaces';

// Базовий клас замовлення
export abstract class BaseOrder {
    constructor(public id: string, public items: any[], public shippingCalculator: IShippingCalculator) {}
    abstract processFulfillment(): string; // LSP: Усі нащадки повинні коректно реалізувати це
}

// LSP: Правильне наслідування, кожен клас має свою коректну поведінку
export class PhysicalOrder extends BaseOrder {
    processFulfillment(): string {
        return "Item packed and shipped to address.";
    }
}

export class DigitalOrder extends BaseOrder {
    processFulfillment(): string {
        return "Download link generated and ready.";
    }
}

// SRP: OrderProcessor відповідає лише за координацію процесу, а не за логіку БД, оплати чи доставки.
// DIP: Клас залежить від абстракцій, а не від конкретних реалізацій (впровадження залежностей через конструктор).
export class OrderProcessor {
    constructor(
        private repository: IOrderRepository,
        private paymentProcessor: IPaymentProcessor,
        private notificationService: INotificationService
    ) {}

    public processOrder(order: BaseOrder): void {
        if (!order || !order.items || order.items.length === 0) {
            throw new Error("Order is invalid");
        }

        const itemsTotal = order.items.reduce((sum, item) => sum + item.price, 0);
        const shippingCost = order.shippingCalculator.calculate();
        const total = itemsTotal + shippingCost;

        const paymentSuccess = this.paymentProcessor.processPayment(total);

        if (paymentSuccess) {
            this.repository.saveOrder(order);
            const fulfillmentStatus = order.processFulfillment();
            this.notificationService.sendReceipt(`Order processed. Status: ${fulfillmentStatus}`);
        } else {
            throw new Error("Payment failed.");
        }
    }
}