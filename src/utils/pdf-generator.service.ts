import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Policy } from '../policies/schemas/policy.schema';
import { InsuranceProduct } from '../insurance-products/schemas/insurance-product.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PdfGeneratorService {
  async generatePolicyDocument(
    policy: Policy,
    product: InsuranceProduct,
    user: User
  ): Promise<string> {
    // Create a document directory if it doesn't exist
    const docsDir = path.join(process.cwd(), 'documents');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Create a unique filename
    const filename = `policy_${policy.policyNumber}_${Date.now()}.pdf`;
    const filePath = path.join(docsDir, filename);

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    // Pipe the PDF to the file
    doc.pipe(stream);

    // Add content to the PDF
    this.addHeader(doc);
    this.addPolicyDetails(doc, policy, product, user);
    this.addCoverageDetails(doc, policy);
    this.addBeneficiaries(doc, policy);
    this.addFooter(doc, policy);

    // Finalize the PDF
    doc.end();

    // Return a promise that resolves when the PDF is written
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  private addHeader(doc: PDFKit.PDFDocument): void {
    doc
      .fontSize(20)
      .text('INSURANCE POLICY CERTIFICATE', { align: 'center' })
      .moveDown(0.5);
    
    // Add logo if available
    // doc.image('path/to/logo.png', { width: 150, align: 'center' });
    
    doc.moveDown(2);
  }

  private addPolicyDetails(
    doc: PDFKit.PDFDocument,
    policy: Policy,
    product: InsuranceProduct,
    user: User
  ): void {
    doc
      .fontSize(16)
      .text('Policy Information', { underline: true })
      .moveDown(0.5)
      .fontSize(12);

    const policyInfo = [
      { label: 'Policy Number', value: policy.policyNumber },
      { label: 'Status', value: policy.status },
      { label: 'Start Date', value: new Date(policy.startDate).toLocaleDateString() },
      { label: 'End Date', value: new Date(policy.endDate).toLocaleDateString() },
      { label: 'Premium', value: `$${policy.premium.toFixed(2)}` },
    ];

    this.addKeyValueTable(doc, policyInfo);
    doc.moveDown(1);

    doc
      .fontSize(16)
      .text('Product Information', { underline: true })
      .moveDown(0.5)
      .fontSize(12);

    const productInfo = [
      { label: 'Product Name', value: product.name },
      { label: 'Type', value: product.type },
      { label: 'Description', value: product.description },
    ];

    this.addKeyValueTable(doc, productInfo);
    doc.moveDown(1);

    doc
      .fontSize(16)
      .text('Policyholder Information', { underline: true })
      .moveDown(0.5)
      .fontSize(12);

    const userInfo = [
      { label: 'Name', value: `${user.firstName} ${user.lastName}` },
      { label: 'DNI', value: user.dni },
      { label: 'Email', value: user.email },
      { label: 'Phone', value: user.phoneNumber },
    ];

    this.addKeyValueTable(doc, userInfo);
    doc.moveDown(1);
  }

  private addCoverageDetails(doc: PDFKit.PDFDocument, policy: Policy): void {
    doc
      .fontSize(16)
      .text('Coverage Details', { underline: true })
      .moveDown(0.5)
      .fontSize(12);

    if (policy.coverageDetails) {
      const coverageInfo = Object.entries(policy.coverageDetails).map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
        
        let formattedValue = value;
        if (typeof value === 'boolean') {
          formattedValue = value ? 'Yes' : 'No';
        } else if (typeof value === 'number') {
          formattedValue = `$${value.toLocaleString()}`;
        }

        return { label: formattedKey, value: formattedValue };
      });

      this.addKeyValueTable(doc, coverageInfo);
    } else {
      doc.text('No coverage details available');
    }

    doc.moveDown(1);
  }

  private addBeneficiaries(doc: PDFKit.PDFDocument, policy: Policy): void {
    doc
      .fontSize(16)
      .text('Beneficiaries', { underline: true })
      .moveDown(0.5)
      .fontSize(12);

    if (policy.beneficiaries && policy.beneficiaries.length > 0) {
      policy.beneficiaries.forEach((beneficiary, index) => {
        doc.text(`${index + 1}. ${beneficiary}`);
      });
    } else {
      doc.text('No beneficiaries specified');
    }

    doc.moveDown(1);
  }

  private addFooter(doc: PDFKit.PDFDocument, policy: Policy): void {
    // Add a line
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    doc
      .moveDown(0.5)
      .fontSize(10)
      .text(
        `This document is an official certificate of your insurance policy. Generated on ${new Date().toLocaleDateString()}.`,
        { align: 'center' }
      )
      .moveDown(0.5)
      .text(
        `Policy Number: ${policy.policyNumber}`,
        { align: 'center' }
      );
  }

  private addKeyValueTable(
    doc: PDFKit.PDFDocument,
    data: Array<{ label: string; value: any }>
  ): void {
    const tableTop = doc.y;
    const labelWidth = 200;
    const valueX = 250;

    data.forEach((item, i) => {
      const y = tableTop + i * 20;
      doc
        .font('Helvetica-Bold')
        .text(item.label, 50, y)
        .font('Helvetica')
        .text(String(item.value), valueX, y);
    });

    // Update the y position after the table
    doc.y = tableTop + data.length * 20;
  }
}