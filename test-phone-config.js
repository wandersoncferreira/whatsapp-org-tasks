#!/usr/bin/env node

/**
 * Test phone number configuration
 */

import { config } from './config.js';

console.log('📱 Phone Number Configuration Test\n');

const phoneNumber = config.myPhoneNumber;

console.log(`Configured number: ${phoneNumber}`);

// Validate format
const isValid = /^\d{10,15}$/.test(phoneNumber);

if (isValid) {
  console.log('✅ Phone number format is valid');
  console.log(`   Length: ${phoneNumber.length} digits`);

  // Try to parse country code
  if (phoneNumber.startsWith('55')) {
    console.log('   Country: Brazil (+55)');
    const withoutCountry = phoneNumber.substring(2);
    console.log(`   Number without country code: ${withoutCountry}`);

    // Brazilian mobile numbers
    if (withoutCountry.length === 11) {
      const areaCode = withoutCountry.substring(0, 2);
      const number = withoutCountry.substring(2);
      console.log(`   Area code: ${areaCode}`);
      console.log(`   Number: ${number.substring(0, 5)}-${number.substring(5)}`);
      console.log(`   Formatted: +55 ${areaCode} ${number.substring(0, 5)}-${number.substring(5)}`);
    }
  }

  console.log('\n✅ Configuration looks good!');
  console.log('\n📝 Messages to yourself at this number will create tasks.');
  console.log('   Make sure to use: ant: Task title');
} else {
  console.error('❌ Invalid phone number format!');
  console.error('\n   Expected: digits only, 10-15 characters');
  console.error('   Example: 5511966428772');
  console.error('   Wrong: +55 11 96642-8772');
  console.error('   Wrong: 55 11 966428772');
  process.exit(1);
}

console.log('\n🧪 Test what will match:');
console.log(`   Chat ID that will match: ${phoneNumber}@c.us`);
console.log(`   Chat user that will match: ${phoneNumber}`);
