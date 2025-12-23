export function checkUpgrade(client) {
    if (client.usage > client.monthlyLimit) {
      return "Limite atingido. Faça upgrade do plano.";
    }
  }
  