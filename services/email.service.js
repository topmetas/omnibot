export function sendWelcomeEmail(client) {
    console.log(`Bem-vindo ${client.name}`);
  }

  if (client.usage.messages > 80 && client.plan === "free") {
    sendUpgradeEmail(client);
  }
  
  
  export function sendUpgradeEmail(client) {
    console.log(`Upgrade sugerido para ${client.email}`);
  }
  