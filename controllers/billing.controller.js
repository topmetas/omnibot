import Billing from "../models/Billing.js";

export async function getBillingHistory(req, res) {
  const client = req.client;

  const history = await Billing.find({
    clientId: client._id,
  }).sort({ createdAt: -1 });

  res.json(history);
}