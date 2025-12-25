/**
 * 📦 Configuração central de planos
 * Usado por:
 * - Billing (Mercado Pago)
 * - Middleware de limite
 * - Dashboard
 * - Regras de negócio
 */

export const PLANS = {
    free: {
      name: "Free",
      price: 0,
  
      limits: {
        messages: 100,
        bots: 1,
        tokens: 0,
        rateLimitPerMinute: 30,
      },
  
      features: {
        branding: true,
        whiteLabel: false,
        apiAccess: true,
        support: "community",
      },
    },
  
    eco: {
      name: "Eco",
      price: 49,
  
      limits: {
        messages: 1000,
        bots: 2,
        tokens: 50000,
        rateLimitPerMinute: 60,
      },
  
      features: {
        branding: true,
        whiteLabel: false,
        apiAccess: true,
        support: "email",
      },
    },
  
    pro: {
      name: "Pro",
      price: 149,
  
      limits: {
        messages: 10000,
        bots: 10,
        tokens: 300000,
        rateLimitPerMinute: 200,
      },
  
      features: {
        branding: false,
        whiteLabel: true,
        apiAccess: true,
        support: "priority",
      },
    },
  };
  