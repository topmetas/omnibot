export function applyPlan(client) {
    if (client.plan === "free") {
      client.aiProvider = "local";
      client.monthlyLimit = 100;
    }
  
    if (client.plan === "eco") {
      client.aiProvider = "local";
      client.monthlyLimit = 1000;
    }
  
    if (client.plan === "pro") {
      client.aiProvider = "openai";
      client.monthlyLimit = 5000;
    }
  }
  