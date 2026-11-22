import assert from 'node:assert';
import { formatCurrency, formatDateFr, generateDevisNumber, getDefaultDevis } from '../formatters.js';
import { EMAIL_TEMPLATES } from '../../constants/emailTemplates.js';
import { ASSO_INFO } from '../../constants/assoInfo.js';

console.log('Testing Vrack Admin Logic...');

// 1. Currency formatting
assert.strictEqual(formatCurrency(1200).replace(/\s/g, ' '), '1 200,00 €');
assert.strictEqual(formatCurrency(0).replace(/\s/g, ' '), '0,00 €');

// 2. Date formatting
assert.ok(formatDateFr('2026-06-21').includes('2026'));
assert.ok(formatDateFr('2026-06-21').includes('juin'));

// 3. Devis number generation
assert.ok(generateDevisNumber(0).endsWith('D01'));
assert.ok(generateDevisNumber(4).endsWith('D05'));

// 4. Default Devis structure
const defaultDevis = getDefaultDevis();
assert.ok(defaultDevis.client.name);
assert.ok(defaultDevis.items.length >= 2);
assert.strictEqual(defaultDevis.event.musiciansCount, 11);

// 5. Asso Info
assert.strictEqual(ASSO_INFO.siret, '442 275 632 00010');
assert.strictEqual(ASSO_INFO.bank.iban, 'FR76 1027 8022 0600 0428 8394 011');
assert.strictEqual(ASSO_INFO.bank.bic, 'CMCIFR2A');

// 6. Email Templates
const testData = {
  eventName: 'Festival Test',
  clientName: 'Mairie de Toulouse',
  clientCity: 'Toulouse',
  contactName: 'Marc',
  date: '2026-07-14',
  dateFormatted: '14 juillet 2026',
  devisNumber: '26D01',
  totalTTC: '1 500,00 €',
  includeDevisMention: true,
  groupName: 'VRACK'
};

EMAIL_TEMPLATES.forEach(template => {
  const subject = template.subject(testData);
  const body = template.generateBody(testData);
  assert.ok(subject.length > 5, `Subject too short for ${template.id}`);
  assert.ok(body.includes('VRACK'), `Body must mention VRACK for ${template.id}`);
  assert.ok(body.includes('1 500,00 €'), `Body must include devis amount for ${template.id}`);
});

// 7. Dynamic musicians count
const testData8 = { ...testData, musiciansCount: 8 };
const body8 = EMAIL_TEMPLATES.find(t => t.id === 'festival').generateBody(testData8);
assert.ok(body8.includes('8 musiciens'), 'Body should mention 8 musiciens when musiciansCount is 8');

// 8. Custom group support (Anyatra, Dumbies)
const testDataAnyatra = { ...testData, groupName: 'ANYATRA', creatorName: 'Antoine' };
const bodyAnyatra = EMAIL_TEMPLATES.find(t => t.id === 'festival').generateBody(testDataAnyatra);
assert.ok(bodyAnyatra.includes('ANYATRA'), 'Body should mention ANYATRA');
assert.ok(bodyAnyatra.includes('Antoine & le groupe ANYATRA'), 'Signature should use creator and group name');

// 9. Devis with custom group and creator
const devisAnyatra = getDefaultDevis(
  { id: 'antoine', name: 'Antoine', role: 'Présidence' },
  { id: 'anyatra', name: 'ANYATRA', defaultMusicians: 5, baseline: 'Musiques du Monde' }
);
assert.strictEqual(devisAnyatra.group.name, 'ANYATRA');
assert.strictEqual(devisAnyatra.createdBy.name, 'Antoine');
assert.strictEqual(devisAnyatra.event.musiciansCount, 5);

console.log('✓ All 9 test suites passed successfully!');
