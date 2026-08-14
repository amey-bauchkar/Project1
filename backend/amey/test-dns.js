import dns from 'dns';

console.log('Resolving DNS for project1.xxhxofo.mongodb.net using Google Public DNS (8.8.8.8)...');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

dns.resolveSrv('_mongodb._tcp.project1.xxhxofo.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('DNS SRV Resolution Error with 8.8.8.8:', err);
  } else {
    console.log('✅ Resolved DNS SRV Addresses:', addresses);
  }
});
