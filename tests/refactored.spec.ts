import { OrderProcessor, PhysicalOrder, DigitalOrder } from '../src/refactored/orderProcessor';
import { ExpressShipping, FreeShipping } from '../src/refactored/services';
import { IOrderRepository, IPaymentProcessor, INotificationService } from '../src/interfaces';

describe('OrderProcessor (SOLID Refactored)', () => {
    let mockRepo: IOrderRepository;
    let mockPayment: IPaymentProcessor;
    let mockNotifier: INotificationService;
    let processor: OrderProcessor;

    beforeEach(() => {
        // Створюємо моки для залежностей (DIP у дії)
        mockRepo = { saveOrder: jest.fn() };
        mockPayment = { processPayment: jest.fn().mockReturnValue(true) };
        mockNotifier = { sendReceipt: jest.fn() };

        processor = new OrderProcessor(mockRepo, mockPayment, mockNotifier);
    });

    it('should process a physical order with express shipping correctly', () => {
        const items = [{ name: 'Laptop', price: 1000 }];
        const order = new PhysicalOrder('1', items, new ExpressShipping());

        processor.processOrder(order);

        expect(mockPayment.processPayment).toHaveBeenCalledWith(1015); // 1000 + 15 shipping
        expect(mockRepo.saveOrder).toHaveBeenCalledWith(order);
        expect(mockNotifier.sendReceipt).toHaveBeenCalledWith(expect.stringContaining('Item packed and shipped'));
    });

    it('should process a digital order with free shipping correctly (LSP compliance)', () => {
        const items = [{ name: 'E-book', price: 20 }];
        const order = new DigitalOrder('2', items, new FreeShipping());

        processor.processOrder(order);

        expect(mockPayment.processPayment).toHaveBeenCalledWith(20); // 20 + 0 shipping
        expect(mockRepo.saveOrder).toHaveBeenCalledWith(order);
        expect(mockNotifier.sendReceipt).toHaveBeenCalledWith(expect.stringContaining('Download link generated'));
    });

    it('should throw an error if the order has no items', () => {
        const order = new PhysicalOrder('3', [], new FreeShipping());
        expect(() => processor.processOrder(order)).toThrow('Order is invalid');
    });
});