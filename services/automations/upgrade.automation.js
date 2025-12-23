/**
 * Automação de upgrade de plano
 * Dispara ações quando o cliente atinge determinado uso
 */

export async function checkUpgradeAutomation(client) {
    // ⚠️ Só aplica para plano Free
    if (client.plan !== "free") return;
  
    // 🎯 Regra: mais de 50 mensagens
    if (client.usage > 50) {
      // Aqui você pode:
      // - Enviar email
      // - Enviar WhatsApp
      // - Criar notificação no painel
      await sendUpgradeEmail(client);
    }
  }
  
  // Simulação simples (depois integra com SendGrid, Brevo, etc)
  async function sendUpgradeEmail(client) {
    console.log(`
  📧 Email de upgrade enviado para ${client.name}
  
  Mensagem:
  Você está usando bastante o chatbot.
  Libere mais recursos com o plano Pro.
  `);
  }
  