/**
 * 📧 Serviço central de emails
 * (placeholder – futuramente entra Nodemailer, Resend, SendGrid, etc)
 */

/**
 * 👋 Email de boas-vindas
 */
export function sendWelcomeEmail(client) {
  console.log(`📧 Bem-vindo ${client.name} (${client.email})`);
}

/**
 * 🚀 Sugestão de upgrade de plano
 */
export function sendUpgradeEmail(client) {
  console.log(`📧 Upgrade sugerido para ${client.email}`);
}

/**
 * 🔁 Aviso de retry de pagamento
 */
export async function sendPaymentRetryEmail(email) {
  console.log(`📧 Tentativa de pagamento reenviada para ${email}`);
}

/**
 * 📊 Verifica uso e dispara email de upgrade (helper opcional)
 */
export function checkUsageAndNotifyUpgrade(client) {
  if (client.plan === "free" && client.usage?.messages > 80) {
    sendUpgradeEmail(client);
  }
}

  