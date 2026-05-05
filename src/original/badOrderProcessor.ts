// Порушення ISP: Інтерфейс змушує реалізовувати непотрібні методи
export interface IOrderOperations {
    processPayment(amount: number): void;
    shipPhysicalItem(): void;
    sendEmailReceipt(): void;
}

// Порушення DIP: Клас напряму залежить від конкретних реалізацій
class MySQLDatabase {
    save(order: any) { console.log("Saved to MySQL", order); }
}

class StripeAPI {
    charge(amount: number) { console.log(`Charged $${amount} via Stripe`); }
}

// Порушення SRP: Клас робить усе (валідація, розрахунки, робота з БД, оплата, логування)
export class BadOrderProcessor implements IOrderOperations {
    private db = new MySQLDatabase();
    private stripe = new StripeAPI();

    public processOrder(order: any, shippingType: string) {
        // Валідація
        if (!order || !order.items || order.items.length === 0) {
            throw new Error("Order is invalid");
        }

        // Порушення OCP: Для додавання нового типу доставки треба змінювати цей код
        let shippingCost = 0;
        if (shippingType === "standard") {
            shippingCost = 5;
        } else if (shippingType === "express") {
            shippingCost = 15;
        } else {
            throw new Error("Unknown shipping type");
        }

        const total = order.items.reduce((sum: number, item: any) => sum + item.price, 0) + shippingCost;

        this.processPayment(total);
        this.db.save(order);
        this.sendEmailReceipt();
    }

    public processPayment(amount: number): void {
        this.stripe.charge(amount);
    }

    public shipPhysicalItem(): void {
        console.log("Shipping physical item...");
    }

    public sendEmailReceipt(): void {
        console.log("Email sent to customer.");
    }
}

// Порушення LSP: Нащадок змінює очікувану поведінку базового класу (викидає помилку там, де не повинен)
export class DigitalOrderProcessor extends BadOrderProcessor {
    public shipPhysicalItem(): void {
        throw new Error("Digital orders cannot be shipped physically!");
    }
}