import { Client } from 'ssh2';

const VPS_HOST = '130.185.119.66';
const VPS_USER = 'root';
const VPS_PASS = 'Temporal132';

const conn = new Client();

conn.on('ready', () => {
  console.log('✅ SSH Connected!');
  
  // Read the easypanel.json to find GitHub credentials
  const commands = [
    `cat /root/nexodigital24/deploy/easypanel.json 2>/dev/null | head -50`,
    `cat /opt/nexodigital24/deploy/easypanel.json 2>/dev/null | head -50`,
    // Check the easypanel database for service config
    `ls -la /var/lib/easypanel/ 2>/dev/null || echo "no /var/lib/easypanel"`,
    // Check Docker Swarm service config
    `docker service inspect nexodigital24_mundial --format '{{json .Spec.TaskTemplate.ContainerSpec}}' 2>/dev/null | python3 -m json.tool 2>/dev/null | head -30`,
    // Check if there's a GitHub App config  
    `find /etc/easypanel -type f 2>/dev/null | head -20`,
    `cat /etc/easypanel/config.json 2>/dev/null | head -50 || echo "no config.json"`,
  ];
  
  let i = 0;
  
  function runNext() {
    if (i >= commands.length) {
      conn.end();
      return;
    }
    
    const cmd = commands[i++];
    console.log(`\n🔧 [${i}] ${cmd.substring(0, 120)}`);
    
    conn.exec(cmd, (err, stream) => {
      if (err) { console.error(`❌ ${err.message}`); runNext(); return; }
      stream.on('data', (data) => { process.stdout.write(data.toString()); });
      stream.stderr.on('data', (data) => { process.stderr.write(data.toString()); });
      stream.on('close', () => { runNext(); });
    });
  }
  
  runNext();
});

conn.on('error', (err) => console.error('❌ SSH failed:', err.message));
conn.connect({ host: VPS_HOST, port: 22, username: VPS_USER, password: VPS_PASS, readyTimeout: 15000 });
