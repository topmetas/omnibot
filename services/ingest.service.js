import axios from "axios";
import cheerio from "cheerio";

// Lê o HTML do site e extrai texto
export async function ingestSite(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let content = "";

  $("p, h1, h2, h3, li").each((_, el) => {
    content += $(el).text() + "\n";
  });

  return content.slice(0, 5000); // limita para não explodir tokens
}
