import { db } from './db/index.js';
import { user } from './db/schema/auth.js';
import { workspaces } from './db/schema/workspace.js';
import { products } from './db/schema/product.js';
import { transactions } from './db/schema/transaction.js';
import crypto from 'node:crypto';

async function seed() {
  console.log('Seeding database...');
  try {
    // 1. Create a Workspaces
    const [workspace1] = await db
      .insert(workspaces)
      .values({
        id: crypto.randomUUID(),
        name: 'Acme Corp',
        maxSeats: 100,
        anomalySensitivity: '0.85',
      })
      .returning();

    console.log('Workspace created:', workspace1.name);

    // 2. Create Users
    const [adminUser] = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name: 'Admin User',
        email: 'admin@acme.corp',
        role: 'admin',
        jobTitle: 'Global Sales Director',
        workspaceId: workspace1.id,
      })
      .returning();
      
    const [salesUser] = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name: 'Alice Agent',
        email: 'alice@acme.corp',
        role: 'sales',
        jobTitle: 'Account Executive',
        workspaceId: workspace1.id,
      })
      .returning();

    console.log('Users created');

    // 3. Create Products
    const [product1] = await db
      .insert(products)
      .values({
        id: crypto.randomUUID(),
        workspaceId: workspace1.id,
        name: 'Enterprise Software License',
        category: 'Software',
        unitPrice: '5000.00',
      })
      .returning();
      
    const [product2] = await db
      .insert(products)
      .values({
        id: crypto.randomUUID(),
        workspaceId: workspace1.id,
        name: 'Premium Support Package',
        category: 'Service',
        unitPrice: '1200.00',
      })
      .returning();

    console.log('Products created');

    // 4. Create Transactions
    const dummyTransactions = [
      {
        transactionCode: 'TXN-882194',
        workspaceId: workspace1.id,
        salesAgentId: salesUser.id,
        productId: product1.id,
        customerName: 'Global Nexus Corp',
        date: new Date('2023-10-24').toISOString(),
        quantity: 8,
        unitPrice: '5000.00',
        totalSales: '40000.00',
        commissionPercent: '0.05',
        commissionAmount: '2000.00',
        status: 'success' as const,
      },
      {
        transactionCode: 'TXN-882155',
        workspaceId: workspace1.id,
        salesAgentId: adminUser.id,
        productId: product2.id,
        customerName: 'Apex Systems',
        date: new Date('2023-10-23').toISOString(),
        quantity: 10,
        unitPrice: '1200.00',
        totalSales: '12000.00',
        commissionPercent: '0.03',
        commissionAmount: '360.00',
        status: 'pending' as const,
      },
      {
        transactionCode: 'TXN-882101',
        workspaceId: workspace1.id,
        salesAgentId: salesUser.id,
        productId: product1.id,
        customerName: 'Terra Industries',
        date: new Date('2023-10-22').toISOString(),
        quantity: 19,
        unitPrice: '5000.00',
        totalSales: '95000.00',
        commissionPercent: '0.07',
        commissionAmount: '6650.00',
        status: 'success' as const,
      },
      {
        transactionCode: 'TXN-882088',
        workspaceId: workspace1.id,
        salesAgentId: salesUser.id,
        productId: product2.id,
        customerName: 'Kinetico Ltd.',
        date: new Date('2023-10-21').toISOString(),
        quantity: 4,
        unitPrice: '1200.00',
        totalSales: '4800.00',
        commissionPercent: '0.02',
        commissionAmount: '96.00',
        status: 'pending' as const,
      }
    ];

    await db.insert(transactions).values(dummyTransactions);
    
    console.log('Transactions created');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
